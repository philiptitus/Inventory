import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
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
  const token = getTokenFromHeader(req);
  if (!token) return res.status(401).json({ error: 'No token provided' });
  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ error: 'Invalid token' });

  if (req.method === 'GET') {
    // List or detail view with pagination
    const { id, page = '1', limit = '10' } = req.query;
    const pageNum = parseInt(page as string, 10) || 1;
    const pageSize = parseInt(limit as string, 10) || 10;
    try {
      if (id) {
        // Detail view: category + paginated items
        const category = await prisma.category.findUnique({ where: { id: Number(id) } });
        if (!category) return res.status(404).json({ error: 'Category not found' });
        // Find items in this category (by category_name)
        const [items, total] = await Promise.all([
          prisma.item.findMany({
            where: { category: category.category_name },
            skip: (pageNum - 1) * pageSize,
            take: pageSize,
          }),
          prisma.item.count({ where: { category: category.category_name } }),
        ]);
        return res.status(200).json({
          ...category,
          items,
          pagination: {
            total,
            page: pageNum,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
          },
        });
      } else {
        // Paginated list of categories with optional search
        const { search = '' } = req.query;
        const searchStr = (search as string).trim();
        const where = searchStr ? { category_name: { contains: searchStr } } : undefined;
        const [categories, total] = await Promise.all([
          prisma.category.findMany({
            skip: (pageNum - 1) * pageSize,
            take: pageSize,
            ...(where ? { where } : {}),
          }),
          prisma.category.count({ ...(where ? { where } : {}) }),
        ]);
        return res.status(200).json({
          categories,
          pagination: {
            total,
            page: pageNum,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
          },
        });
      }
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to fetch category', details: error.message });
    }
    return;
  } else if (req.method === 'POST') {
    // Create category
    const { category_name } = req.body;
    if (!category_name) {
      return res.status(400).json({ error: 'Missing required field: category_name (string)' });
    }
    try {
      const category = await prisma.category.create({ data: { category_name } });
      res.status(201).json(category);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to create category', details: error.message });
    }
    return;
  } else if (req.method === 'PUT') {
    // Update category
    const { id, category_name } = req.body;
    if (!id) return res.status(400).json({ error: 'Missing required field: id' });
    try {
      const data: any = {};
      if (category_name) data.category_name = category_name;
      const updated = await prisma.category.update({ where: { id: Number(id) }, data });
      res.status(200).json(updated);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to update category', details: error.message });
    }
    return;
  } else if (req.method === 'DELETE') {
    // Delete category
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'Missing required field: id' });
    try {
      await prisma.category.delete({ where: { id: Number(id) } });
      res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to delete category', details: error.message });
    }
    return;
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
