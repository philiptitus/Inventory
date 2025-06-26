import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Fetch all inventory items
    try {
      const inventory = await prisma.inventory.findMany();
      res.status(200).json(inventory);
    } catch (error: any) {
      res.status(500).json({
        error: 'Failed to fetch inventory',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      });
    }
  } else if (req.method === 'POST') {
    // Create a new inventory item
    const { name, quantity, description, model_id, office_location } = req.body;
    if (!name || !quantity || !model_id || !office_location) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
      const newItem = await prisma.inventory.create({
        data: {
          name,
          quantity: Number(quantity),
          description: description || null,
          model_id: Number(model_id),
          office_location,
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
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
