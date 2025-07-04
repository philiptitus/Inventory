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

  // GET: List or detail
  if (req.method === 'GET') {
    const { id, page = '1', limit = '10' } = req.query;
    const pageNum = parseInt(page as string, 10) || 1;
    const pageSize = parseInt(limit as string, 10) || 10;
    if (id) {
      // Only admin can get detail view
      if (!payload.isAdmin) return res.status(403).json({ error: 'Admin only' });
      try {
        const department = await prisma.department.findUnique({ where: { id: Number(id) } });
        if (!department) return res.status(404).json({ error: 'Department not found' });
        // Paginated users in this department
        const [users, total] = await Promise.all([
          prisma.user.findMany({
            where: { departmentId: Number(id) },
            skip: (pageNum - 1) * pageSize,
            take: pageSize,
            select: { id: true, name: true, email: true, isAdmin: true }
          }),
          prisma.user.count({ where: { departmentId: Number(id) } })
        ]);
        return res.status(200).json({
          ...department,
          users,
          pagination: {
            total,
            page: pageNum,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
          },
        });
      } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch department', details: error.message });
      }
      return;
    } else {
      // Any authenticated user can get list
      try {
        const [departments, total] = await Promise.all([
          prisma.department.findMany({
            skip: (pageNum - 1) * pageSize,
            take: pageSize,
          }),
          prisma.department.count(),
        ]);
        return res.status(200).json({
          departments,
          pagination: {
            total,
            page: pageNum,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
          },
        });
      } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch departments', details: error.message });
      }
      return;
    }
  }

  // Only admin can create, update, delete
  if (!payload.isAdmin) return res.status(403).json({ error: 'Admin only' });

  if (req.method === 'POST') {
    const { Dep_ID, Dep_name } = req.body;
    if (typeof Dep_ID !== 'number' || !Dep_name) {
      return res.status(400).json({ error: 'Missing required fields: Dep_ID (number), Dep_name (string)' });
    }
    try {
      const department = await prisma.department.create({ data: { Dep_ID, Dep_name } });
      res.status(201).json(department);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to create department', details: error.message });
    }
    return;
  } else if (req.method === 'PUT') {
    const { id, Dep_ID, Dep_name } = req.body;
    if (!id) return res.status(400).json({ error: 'Missing required field: id' });
    try {
      const data: any = {};
      if (typeof Dep_ID === 'number') data.Dep_ID = Dep_ID;
      if (Dep_name) data.Dep_name = Dep_name;
      const updated = await prisma.department.update({ where: { id: Number(id) }, data });
      res.status(200).json(updated);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to update department', details: error.message });
    }
    return;
  } else if (req.method === 'DELETE') {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'Missing required field: id' });
    try {
      await prisma.department.delete({ where: { id: Number(id) } });
      res.status(200).json({ message: 'Department deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to delete department', details: error.message });
    }
    return;
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
