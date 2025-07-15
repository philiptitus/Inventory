import type { NextApiRequest, NextApiResponse } from 'next';

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

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // List or detail view with pagination
    const { id, page = '1', limit = '10' } = req.query;
    const pageNum = parseInt(page as string, 10) || 1;
    const pageSize = parseInt(limit as string, 10) || 10;
    try {
      if (id) {
        // Detail view: county + paginated items
        const county = await prisma.county.findUnique({ where: { id: Number(id) } });
        if (!county) return res.status(404).json({ error: 'County not found' });
        // Find items in this county (by county_name)
        const [items, total] = await Promise.all([
          prisma.item.findMany({
            where: { county: county.county_name },
            skip: (pageNum - 1) * pageSize,
            take: pageSize,
          }),
          prisma.item.count({ where: { county: county.county_name } }),
        ]);
        return res.status(200).json({
          ...county,
          items,
          pagination: {
            total,
            page: pageNum,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
          },
        });
      } else {
        // Paginated list of counties with optional search
        const { search = '' } = req.query;
        const searchStr = (search as string).trim();
        const where = searchStr ? { county_name: { contains: searchStr } } : undefined;
        const [counties, total] = await Promise.all([
          prisma.county.findMany({
            skip: (pageNum - 1) * pageSize,
            take: pageSize,
            ...(where ? { where } : {}),
          }),
          prisma.county.count({ ...(where ? { where } : {}) }),
        ]);
        return res.status(200).json({
          counties,
          pagination: {
            total,
            page: pageNum,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
          },
        });
      }
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to fetch county', details: error.message });
    }
    return;
  } else if (req.method === 'POST') {
    // Require auth for POST
    const token = getTokenFromHeader(req);
    if (!token) return res.status(401).json({ error: 'No token provided' });
    const payload = verifyToken(token);
    if (!payload) return res.status(401).json({ error: 'Invalid token' });
    // Create county
    const { county_name, county_number } = req.body;
    if (!county_name || typeof county_number !== 'number') {
      return res.status(400).json({ error: 'Missing required fields: county_name (string), county_number (number)' });
    }
    try {
      const county = await prisma.county.create({ data: { county_name, county_number } });
      res.status(201).json(county);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to create county', details: error.message });
    }
    return;
  } else if (req.method === 'PUT') {
    // Require auth for PUT
    const token = getTokenFromHeader(req);
    if (!token) return res.status(401).json({ error: 'No token provided' });
    const payload = verifyToken(token);
    if (!payload) return res.status(401).json({ error: 'Invalid token' });
    // Update county
    const { id, county_name, county_number } = req.body;
    if (!id) return res.status(400).json({ error: 'Missing required field: id' });
    try {
      const data: any = {};
      if (county_name) data.county_name = county_name;
      if (typeof county_number === 'number') data.county_number = county_number;
      const updated = await prisma.county.update({ where: { id: Number(id) }, data });
      res.status(200).json(updated);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to update county', details: error.message });
    }
    return;
  } else if (req.method === 'DELETE') {
    // Require auth for DELETE
    const token = getTokenFromHeader(req);
    if (!token) return res.status(401).json({ error: 'No token provided' });
    const payload = verifyToken(token);
    if (!payload) return res.status(401).json({ error: 'Invalid token' });
    // Delete county
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'Missing required field: id' });
    try {
      await prisma.county.delete({ where: { id: Number(id) } });
      res.status(200).json({ message: 'County deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to delete county', details: error.message });
    }
    return;
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
