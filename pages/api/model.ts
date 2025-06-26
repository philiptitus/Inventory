import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { model_name, status } = req.body;
    if (!model_name || typeof status !== 'boolean') {
      return res.status(400).json({ error: 'Missing required fields: model_name (string), status (boolean)' });
    }
    try {
      const newModel = await prisma.model.create({
        data: {
          model_name,
          status,
        },
      });
      res.status(201).json(newModel);
    } catch (error: any) {
      res.status(500).json({
        error: 'Failed to create model',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      });
    }
  } else if (req.method === 'GET') {
    try {
      const models = await prisma.model.findMany();
      res.status(200).json(models);
    } catch (error: any) {
      res.status(500).json({
        error: 'Failed to fetch models',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
