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
  // Enforce JWT auth for all endpoints
  const token = getTokenFromHeader(req);
  if (!token) return res.status(401).json({ error: 'No token provided' });
  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ error: 'Invalid token' });

  if (req.method === 'GET') {
    // List or detail view (public)
    const { id } = req.query;
    try {
      if (id) {
        // Detail view
        const item = await prisma.item.findUnique({ where: { id: Number(id) } });
        if (!item) return res.status(404).json({ error: 'Item not found' });
        return res.status(200).json(item);
      } else {
        // Paginated list view with optional search
        const { page = '1', limit = '10', search = '' } = req.query;
        const pageNum = parseInt(page as string, 10) || 1;
        const pageSize = parseInt(limit as string, 10) || 10;
        const searchStr = (search as string).trim();
        const where = searchStr
          ? {
              OR: [
                { pname: { contains: searchStr } },
                { serialno: { contains: searchStr } },
                { model: { contains: searchStr } },
                { category: { contains: searchStr } },
                { county: { contains: searchStr } },
              ],
            }
          : undefined;
        const [items, total] = await Promise.all([
          prisma.item.findMany({
            skip: (pageNum - 1) * pageSize,
            take: pageSize,
            ...(where ? { where } : {}),
          }),
          prisma.item.count({ ...(where ? { where } : {}) }),
        ]);
        return res.status(200).json({
          items,
          pagination: {
            total,
            page: pageNum,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
          },
        });
      }
    } catch (error: any) {
      res.status(500).json({
        error: 'Failed to fetch inventory',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      });
    }
    return;
  } else if (req.method === 'POST') {
    // Create a new inventory item
    let { pname, serialno, model, category, county } = req.body;
    if (!pname || !serialno || !model || !category || !county) {
      return res.status(400).json({ error: 'Missing required fields: pname, serialno, model, category, county' });
    }
    // Allow category to be id or string, and auto-create if not exists
    if (typeof category === 'number') {
      let cat = await prisma.category.findUnique({ where: { id: category } });
      if (!cat) {
        cat = await prisma.category.create({ data: { category_name: `Category-${category}` } });
      }
      category = cat.category_name;
    } else if (typeof category === 'string') {
      let cat = await prisma.category.findFirst({ where: { category_name: category } });
      if (!cat) {
        cat = await prisma.category.create({ data: { category_name: category } });
      }
      category = cat.category_name;
    }
    // Require county to exist
    let countyRec = await prisma.county.findFirst({ where: { county_name: county } });
    if (!countyRec) {
      return res.status(400).json({ error: 'County does not exist. Please use an existing county.' });
    }
    // Require model to exist
    let modelRec = await prisma.model.findFirst({ where: { model_name: model } });
    if (!modelRec) {
      return res.status(400).json({ error: 'Model does not exist. Please use an existing model.' });
    }
    try {
      const newItem = await prisma.item.create({
        data: {
          pname,
          serialno,
          model,
          category,
          county,
          userId: payload.userId,
        },
      });
      res.status(201).json(newItem);
    } catch (error: any) {
      res.status(500).json({
        error: 'Failed to create inventory item',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      });
    }
  } else if (req.method === 'PUT') {
    // Update inventory item
    const { id, pname, serialno, model, category, county } = req.body;
    if (!id) return res.status(400).json({ error: 'Missing required field: id' });
    try {
      const item = await prisma.item.findUnique({ where: { id: Number(id) } });
      if (!item) return res.status(404).json({ error: 'Item not found' });
      if (item.userId !== payload.userId) return res.status(403).json({ error: 'Forbidden: not your inventory' });
      const data: any = {};
      if (pname) data.pname = pname;
      if (serialno) data.serialno = serialno;
      if (model) data.model = model;
      if (category) {
        // Allow category to be id or string, and auto-create if not exists
        let catValue = category;
        if (typeof category === 'number') {
          let cat = await prisma.category.findUnique({ where: { id: category } });
          if (!cat) {
            cat = await prisma.category.create({ data: { category_name: `Category-${category}` } });
          }
          catValue = cat.category_name;
        } else if (typeof category === 'string') {
          let cat = await prisma.category.findFirst({ where: { category_name: category } });
          if (!cat) {
            cat = await prisma.category.create({ data: { category_name: category } });
          }
          catValue = cat.category_name;
        }
        data.category = catValue;
      }
      // Require county to exist
      if (county) {
        let countyRec = await prisma.county.findFirst({ where: { county_name: county } });
        if (!countyRec) {
          return res.status(400).json({ error: 'County does not exist. Please use an existing county.' });
        }
      }
      // Require model to exist
      if (model) {
        let modelRec = await prisma.model.findFirst({ where: { model_name: model } });
        if (!modelRec) {
          return res.status(400).json({ error: 'Model does not exist. Please use an existing model.' });
        }
      }
      if (county) data.county = county;
      const updated = await prisma.item.update({ where: { id: Number(id) }, data });
      res.status(200).json(updated);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to update inventory item', details: error.message });
    }
    return;
  } else if (req.method === 'DELETE') {
    // Delete inventory item (admin only)
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'Missing required field: id' });
    
    try {
      // Check if user is admin
      if (!payload.isAdmin) {
        return res.status(403).json({ error: 'Forbidden: Only administrators can delete items' });
      }

      // Check if item exists and get related data
      const item = await prisma.item.findUnique({ 
        where: { id: Number(id) },
        include: {
          allocations: {
            where: { status: 'active' },
            include: { 
              user: { select: { name: true } },
              repairRequests: true,
              returnRequests: true
            }
          }
        }
      });
      
      if (!item) return res.status(404).json({ error: 'Item not found' });

      // Check for active allocations
      if (item.allocations && item.allocations.length > 0) {
        const allocatedTo = item.allocations.map(a => a.user.name).join(', ');
        return res.status(400).json({ 
          error: 'Cannot delete item with active allocations',
          details: `This item is currently allocated to: ${allocatedTo}`
        });
      }

      // Proceed with deletion in a transaction to handle all related records
      await prisma.$transaction([
        // Delete related repair requests
        prisma.repairRequest.deleteMany({
          where: { allocation: { itemId: Number(id) } }
        }),
        // Delete related return requests
        prisma.returnRequest.deleteMany({
          where: { allocation: { itemId: Number(id) } }
        }),
        // Delete allocations
        prisma.allocation.deleteMany({
          where: { itemId: Number(id) }
        }),
        // Finally delete the item
        prisma.item.delete({ 
          where: { id: Number(id) } 
        })
      ]);
      
      res.status(200).json({ message: 'Item and all related records deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to delete inventory item', details: error.message });
    }
    return;
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
