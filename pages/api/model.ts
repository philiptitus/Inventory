import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

function getTokenFromHeader(req: NextApiRequest): string | null {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) {
    return auth.slice(7);
  }
  return null;
}

function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // List or detail view with pagination
    const { id, page = '1', limit = '10' } = req.query;
    const pageNum = parseInt(page as string, 10) || 1;
    const pageSize = parseInt(limit as string, 10) || 10;
    try {
      if (id) {
        // Detail view: model + paginated items
        const model = await prisma.model.findUnique({ where: { id: Number(id) } });
        if (!model) return res.status(404).json({ error: 'Model not found' });
        // Find items in this model (by model_name)
        const [items, total] = await Promise.all([
          prisma.item.findMany({
            where: { model: model.model_name },
            skip: (pageNum - 1) * pageSize,
            take: pageSize,
          }),
          prisma.item.count({ where: { model: model.model_name } }),
        ]);
        return res.status(200).json({
          ...model,
          items,
          pagination: {
            total,
            page: pageNum,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
          },
        });
      } else {
        // Paginated list of models with optional search
        const { search = '' } = req.query;
        const searchStr = (search as string).trim();
        const where = searchStr ? { model_name: { contains: searchStr } } : undefined;
        const [models, total] = await Promise.all([
          prisma.model.findMany({
            skip: (pageNum - 1) * pageSize,
            take: pageSize,
            ...(where ? { where } : {}),
          }),
          prisma.model.count({ ...(where ? { where } : {}) }),
        ]);
        return res.status(200).json({
          models,
          pagination: {
            total,
            page: pageNum,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
          },
        });
      }
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to fetch model(s)', details: error.message });
    }
    return;
  } else if (req.method === 'POST') {
    // Require auth for POST
    const token = getTokenFromHeader(req);
    if (!token) return res.status(401).json({ error: 'No token provided' });
    const payload = verifyToken(token);
    if (!payload) return res.status(401).json({ error: 'Invalid token' });
    const { model_name, status } = req.body;
    if (!model_name) {
      return res.status(400).json({ error: 'Missing required field: model_name (string)' });
    }
    try {
      const newModel = await prisma.model.create({
        data: {
          model_name
        },
      });
      res.status(201).json(newModel);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to create model', details: error.message });
    }
    return;
  } else if (req.method === 'PUT') {
    // Require auth for PUT
    const token = getTokenFromHeader(req);
    if (!token) return res.status(401).json({ error: 'No token provided' });
    const payload = verifyToken(token);
    if (!payload) return res.status(401).json({ error: 'Invalid token' });
    // Update model
    const { id, model_name } = req.body;
    if (!id) return res.status(400).json({ error: 'Missing required field: id' });
    try {
      const data: any = {};
      if (model_name) data.model_name = model_name;
      const updated = await prisma.model.update({ where: { id: Number(id) }, data });
      res.status(200).json(updated);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to update model', details: error.message });
    }
    return;
  } else if (req.method === 'DELETE') {
    // Require auth for DELETE
    const token = getTokenFromHeader(req);
    if (!token) return res.status(401).json({ error: 'No token provided' });
    const payload = verifyToken(token);
    if (!payload) return res.status(401).json({ error: 'Invalid token' });
    // Delete model
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'Missing required field: id' });
    try {
      await prisma.model.delete({ where: { id: Number(id) } });
      res.status(200).json({ message: 'Model deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to delete model', details: error.message });
    }
    return;
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
