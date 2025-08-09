import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET requests for search
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];

  try {
    const { search } = req.query;
    
    // If no search term, return empty array
    if (!search || typeof search !== 'string') {
      return res.status(200).json([]);
    }

    const searchStr = search.trim();
    const where = {
      OR: [
        { name: { contains: searchStr, mode: 'insensitive' } },
        { email: { contains: searchStr, mode: 'insensitive' } },
        { phone: { contains: searchStr } },
        { county: { contains: searchStr, mode: 'insensitive' } },
        { department: { is: { Dep_name: { contains: searchStr, mode: 'insensitive' } } } },
      ],
    };

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        isAdmin: true,
        department: {
          select: {
            id: true,
            Dep_name: true,
            Dep_ID: true,
          },
        },
        county: true,
      },
      take: 20, // Limit to 20 results
    });

    // Format the response to match the expected Member type
    const formattedMembers = users.map((user) => ({
      id: user.id,
      member_name: user.name,
      email: user.email,
      phone: user.phone,
      county: user.county,
      department: user.department?.Dep_name || '',
      department_id: user.department?.id || null,
      office_location: '', // Add if available in your schema
      isAdmin: user.isAdmin,
    }));

    return res.status(200).json(formattedMembers);
  } catch (error) {
    console.error('Error searching members:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
