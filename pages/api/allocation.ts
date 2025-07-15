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
  // List and detail view (GET)
  if (req.method === 'GET') {
    const token = getTokenFromHeader(req);
    if (!token) return res.status(401).json({ error: 'No token provided' });
    const payload = verifyToken(token);
    if (!payload) return res.status(401).json({ error: 'Invalid token' });

    const { id, userId, itemId, status, page = '1', limit = '10' } = req.query;
    const pageNum = parseInt(page as string, 10) || 1;
    const pageSize = parseInt(limit as string, 10) || 10;
    try {
      if (id) {
        // Detail view
        const allocation = await prisma.allocation.findUnique({ where: { id: Number(id) }, include: { user: true, item: true } });
        if (!allocation) return res.status(404).json({ error: 'Allocation not found' });
        if (allocation.user) delete allocation.user.password;
        return res.status(200).json(allocation);
      } else {
        // List view with optional filters
        const { search = '' } = req.query;
        const searchStr = (search as string).trim();
        let where: any = {};
        if (userId) where.userId = Number(userId);
        if (itemId) where.itemId = Number(itemId);
        if (status) where.status = status;
        if (searchStr) {
          where = {
            ...where,
            OR: [
              { status: { contains: searchStr } },
              { Message: { contains: searchStr } },
              { user: { is: { name: { contains: searchStr } } } },
              { user: { is: { email: { contains: searchStr } } } },
              { item: { is: { pname: { contains: searchStr } } } },
              { item: { is: { serialno: { contains: searchStr } } } },
              { item: { is: { model: { contains: searchStr } } } },
              { item: { is: { category: { contains: searchStr } } } },
              { item: { is: { county: { contains: searchStr } } } },
            ],
          };
        }
        const [allocations, total] = await Promise.all([
          prisma.allocation.findMany({
            where,
            skip: (pageNum - 1) * pageSize,
            take: pageSize,
            include: { user: true, item: true }
          }),
          prisma.allocation.count({ where }),
        ]);
        allocations.forEach(a => { if (a.user) delete a.user.password; });
        return res.status(200).json({
          allocations,
          pagination: {
            total,
            page: pageNum,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
          },
        });
      }
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to fetch allocations', details: error.message });
    }
    return;
  }

  // All other methods require authentication
  const token = getTokenFromHeader(req);
  if (!token) return res.status(401).json({ error: 'No token provided' });
  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ error: 'Invalid token' });

  if (req.method === 'POST') {
    // Create allocation
    const { userId, itemId, message } = req.body;
    if (!userId || !itemId) {
      return res.status(400).json({ error: 'Missing required fields: userId, itemId' });
    }
    try {
      const user = await prisma.user.findUnique({ where: { id: Number(userId) } });
      if (!user) return res.status(400).json({ error: 'User not found' });
      const item = await prisma.item.findUnique({ where: { id: Number(itemId) } });
      if (!item) return res.status(400).json({ error: 'Item not found' });
      const allocation = await prisma.allocation.create({
        data: {
          userId: Number(userId),
          itemId: Number(itemId),
          Date_Allocated: new Date().toISOString(),
          Date_Returned: null,
          status: 'active',
          Message: message || null
        },
        include: { user: true, item: true }
      });
      if (allocation.user) delete allocation.user.password;
      res.status(201).json(allocation);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to create allocation', details: error.message });
    }
    return;
  } else if (req.method === 'PUT') {
    // Update allocation
    const { id, message, status } = req.body;
    if (!id) return res.status(400).json({ error: 'Missing required field: id' });
    try {
      const data: any = {};
      if (message !== undefined) data.Message = message;
      if (status === 'returned') {
        data.status = 'returned';
        data.Date_Returned = new Date().toISOString();
      }
      const updated = await prisma.allocation.update({ where: { id: Number(id) }, data, include: { user: true, item: true } });
      if (updated.user) delete updated.user.password;
      res.status(200).json(updated);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to update allocation', details: error.message });
    }
    return;
  } else if (req.method === 'DELETE') {
    // Delete allocation
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'Missing required field: id' });
    try {
      await prisma.allocation.delete({ where: { id: Number(id) } });
      res.status(200).json({ message: 'Allocation deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to delete allocation', details: error.message });
    }
    return;
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
