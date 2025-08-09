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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = getTokenFromHeader(req);
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  // Handle POST /api/allocation/return-request - Create return request
  if (req.method === 'POST') {
    const { allocationId, message } = req.body;

    if (!allocationId) {
      return res.status(400).json({ error: 'Missing required field: allocationId' });
    }

    try {
      // Check if the allocation exists and belongs to the user
      const allocation = await prisma.allocation.findUnique({
        where: { id: Number(allocationId) },
        include: { user: true }
      });

      if (!allocation) {
        return res.status(404).json({ error: 'Allocation not found' });
      }

      // Check if the allocation belongs to the requesting user
      if (allocation.userId !== payload.userId && !payload.isAdmin) {
        return res.status(403).json({ error: 'Not authorized to create return request for this allocation' });
      }

      // Check if there's already a pending return request
      const existingRequest = await prisma.returnRequest.findFirst({
        where: {
          allocationId: allocation.id,
          status: 'pending'
        }
      });

      if (existingRequest) {
        return res.status(400).json({ error: 'A pending return request already exists for this allocation' });
      }

      // Create the return request
      const returnRequest = await prisma.returnRequest.create({
        data: {
          allocationId: allocation.id,
          requestedById: payload.userId,
          status: 'pending',
          message: message || null,
          requestedAt: new Date()
        },
        include: {
          allocation: {
            include: {
              item: true
            }
          },
          requestedBy: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      // Prepare response
      const response = {
        success: true,
        data: {
          id: returnRequest.id,
          status: returnRequest.status,
          message: returnRequest.message,
          requestedAt: returnRequest.requestedAt,
          allocation: {
            id: returnRequest.allocation?.id,
            item: returnRequest.allocation?.item
          },
          requestedBy: {
            id: returnRequest.requestedBy.id,
            name: returnRequest.requestedBy.name,
            email: returnRequest.requestedBy.email
          }
        }
      };

      return res.status(201).json(response);
    } catch (error: any) {
      console.error('Error creating return request:', error);
      return res.status(500).json({
        error: 'Failed to create return request',
        details: error.message
      });
    }
  }
  
  // Handle PUT /api/allocation/return-request - Update return request status (admin only)
  else if (req.method === 'PUT') {
    // Verify admin status
    const adminUser = await prisma.user.findUnique({
      where: { id: payload.userId }
    });

    if (!adminUser?.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { requestId, status, adminNotes } = req.body;

    if (!requestId || !status) {
      return res.status(400).json({ error: 'Missing required fields: requestId, status' });
    }

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be "approved" or "rejected"' });
    }

    try {
      // First get the return request to find the allocationId
      const returnRequest = await prisma.returnRequest.findUnique({
        where: { id: Number(requestId) },
        select: {
          id: true,
          allocationId: true
        }
      });

      if (!returnRequest) {
        return res.status(404).json({ error: 'Return request not found' });
      }

      // Start a transaction to ensure both updates succeed or fail together
      const [updatedRequest] = await prisma.$transaction([
        // Update the return request
        prisma.returnRequest.update({
          where: { id: Number(requestId) },
          data: {
            status,
            adminNotes: adminNotes || null,
            processedAt: new Date(),
            processedById: payload.userId
          },
          include: {
            allocation: true,
            requestedBy: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }),
        // Update the associated allocation if approved
        ...(status === 'approved' ? [
          prisma.allocation.update({
            where: { id: returnRequest.allocationId },
            data: {
              status: 'returned',
              Date_Returned: new Date().toISOString()
            }
          })
        ] : [])
      ]);

      // Prepare response
      const response = {
        success: true,
        data: {
          id: updatedRequest.id,
          status: updatedRequest.status,
          adminNotes: updatedRequest.adminNotes,
          processedAt: updatedRequest.processedAt,
          allocation: {
            id: updatedRequest.allocationId,
            status: status === 'approved' ? 'returned' : updatedRequest.allocation.status
          },
          requestedBy: updatedRequest.requestedBy,
          processedBy: {
            id: adminUser.id,
            name: adminUser.name,
            email: adminUser.email
          }
        }
      };

      return res.status(200).json(response);
    } catch (error: any) {
      console.error('Error updating return request:', error);
      return res.status(500).json({
        error: 'Failed to update return request',
        details: error.message
      });
    }
  }
  
  // Handle GET /api/allocation/return-request - List return requests
  else if (req.method === 'GET') {
    try {
      const { status, page = '1', limit = '10', search = '' } = req.query;
      const pageNum = parseInt(page as string, 10) || 1;
      const pageSize = parseInt(limit as string, 10) || 10;
      const searchStr = (search as string).trim();
      const statusFilter = status as 'pending' | 'approved' | 'rejected' | undefined;

      // For non-admin users, only show their own requests
      const where: any = {};
      if (!payload.isAdmin) {
        where.requestedById = payload.userId;
      }
      
      if (statusFilter) {
        where.status = statusFilter;
      }
      
      if (searchStr) {
        where.OR = [
          { message: { contains: searchStr, mode: 'insensitive' } },
          { adminNotes: { contains: searchStr, mode: 'insensitive' } },
          { requestedBy: { name: { contains: searchStr, mode: 'insensitive' } } },
          { allocation: { item: { pname: { contains: searchStr, mode: 'insensitive' } } } },
          { allocation: { item: { serialno: { contains: searchStr, mode: 'insensitive' } } } }
        ];
      }

      const [requests, total] = await Promise.all([
        prisma.returnRequest.findMany({
          where,
          include: {
            allocation: {
              include: {
                item: true
              }
            },
            requestedBy: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            processedBy: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: { requestedAt: 'desc' },
          skip: (pageNum - 1) * pageSize,
          take: pageSize,
        }),
        prisma.returnRequest.count({ where })
      ]);

      return res.status(200).json({
        data: requests,
        pagination: {
          total,
          page: pageNum,
          limit: pageSize,
          totalPages: Math.ceil(total / pageSize)
        }
      });
    } catch (error: any) {
      console.error('Error fetching return requests:', error);
      return res.status(500).json({
        error: 'Failed to fetch return requests',
        details: error.message
      });
    }
  }
  
  // Handle unsupported methods
  else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
