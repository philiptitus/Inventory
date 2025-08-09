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
        if (allocation.user && 'password' in allocation.user) {
          delete (allocation.user as { password?: string }).password;
        }
        return res.status(200).json(allocation);
      } else {
        // List view with optional filters
        const { search = '' } = req.query;
        const searchStr = (search as string).trim();
        
        // For non-admin users, only show their own allocations
        const isAdmin = payload.isAdmin === true;
        let where: any = {};
        
        // If user is not admin, force filter by their user ID
        if (!isAdmin) {
          where.userId = payload.userId;
        }
        
        // Apply other filters if provided
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
        allocations.forEach(a => {
          if (a.user && 'password' in a.user) {
            delete (a.user as { password?: string }).password;
          }
        });
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
    if (!itemId) {
      return res.status(400).json({ error: 'Missing required field: itemId' });
    }
    
    // If userId is not provided, use the authenticated user's ID
    const targetUserId = userId ? Number(userId) : payload.userId;
    if (!targetUserId) {
      return res.status(400).json({ error: 'User ID not provided and could not be determined from token' });
    }
    try {
      const user = await prisma.user.findUnique({ where: { id: targetUserId } });
      if (!user) return res.status(400).json({ error: 'User not found' });
      const item = await prisma.item.findUnique({ where: { id: Number(itemId) } });
      if (!item) return res.status(400).json({ error: 'Item not found' });

      // Check for active allocation for this item
      const existingAllocation = await prisma.allocation.findFirst({
        where: {
          itemId: Number(itemId),
          status: 'active'
        },
        include: {
          user: true
        }
      });

      if (existingAllocation) {
        return res.status(400).json({
          error: `Someone else is already using this item: ${existingAllocation.user?.name || 'Unknown user'}`
        });
      }

      const allocation = await prisma.allocation.create({
        data: {
          userId: targetUserId,
          itemId: Number(itemId),
          Date_Allocated: new Date().toISOString(),
          Date_Returned: null,
          status: 'active',
          Message: message || null
        },
        include: { user: true, item: true }
      });
      if (allocation.user && 'password' in allocation.user) {
        delete (allocation.user as { password?: string }).password;
      }
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
      // First, get the current allocation to check its status
      const currentAllocation = await prisma.allocation.findUnique({
        where: { id: Number(id) }
      });

      if (!currentAllocation) {
        return res.status(404).json({ error: 'Allocation not found' });
      }

      // Check if the current status is 'active' before allowing any modifications
      if (currentAllocation.status !== 'active') {
        return res.status(400).json({ error: 'This action is prohibited. Only active allocations can be modified.' });
      }

      const data: any = {};
      if (message !== undefined) data.Message = message;

      // Only allow changing status to 'returned'
      if (status === 'returned') {
        data.status = 'returned';
        data.Date_Returned = new Date().toISOString();
      }

      const updated = await prisma.allocation.update({
        where: { id: Number(id) },
        data,
        include: { user: true, item: true }
      });

      if (updated.user && 'password' in updated.user) {
        delete (updated.user as { password?: string }).password;
      }
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
      return res.status(200).json({ message: 'Allocation deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to delete allocation', details: error.message });
    }
    return;
  } else if (req.url?.includes('/return-request')) {
    // Handle PUT /api/allocation/return-request
    if (req.method === 'PUT') {
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
              where: { id: Number(requestId) },
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

        res.status(200).json(response);
        return;
      } catch (error: any) {
        console.error('Error updating return request:', error);
        res.status(500).json({
          error: 'Failed to update return request',
          details: error.message
        });
        return;
      }
    }
    // Handle GET /api/allocation/return-request
    if (req.method === 'GET') {
      const isAdmin = (await prisma.user.findUnique({
        where: { id: payload.userId },
        select: { isAdmin: true }
      }))?.isAdmin || false;

      // Common query parameters
      const { status, search = '', page = '1', limit = '10' } = req.query;
      const pageNum = parseInt(page as string, 10) || 1;
      const pageSize = parseInt(limit as string, 10) || 10;
      const searchStr = (search as string).trim();

      try {
        const where: any = {};

        // Filter by status if provided
        if (status) {
          where.status = status;
        }

        // For non-admin users, only show their own requests
        if (!isAdmin) {
          where.requestedById = payload.userId;
        }

        // Add search functionality
        if (searchStr) {
          where.OR = [
            { message: { contains: searchStr, mode: 'insensitive' } },
            { adminNotes: { contains: searchStr, mode: 'insensitive' } },
            {
              allocation: {
                OR: [
                  { item: { pname: { contains: searchStr, mode: 'insensitive' } } },
                  { item: { serialno: { contains: searchStr, mode: 'insensitive' } } },
                  ...(isAdmin ? [
                    { user: { name: { contains: searchStr, mode: 'insensitive' } } },
                    { user: { email: { contains: searchStr, mode: 'insensitive' } } }
                  ] : [])
                ]
              }
            }
          ];
        }

        const [returnRequests, total] = await Promise.all([
          prisma.returnRequest.findMany({
            where,
            include: {
              allocation: {
                include: {
                  item: true,
                  user: {
                    select: {
                      id: true,
                      name: true,
                      email: true
                    }
                  }
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
            orderBy: {
              requestedAt: 'desc'
            },
            skip: (pageNum - 1) * pageSize,
            take: pageSize
          }),
          prisma.returnRequest.count({ where })
        ]);

        res.status(200).json({
          success: true,
          data: returnRequests,
          pagination: {
            total,
            page: pageNum,
            pageSize,
            totalPages: Math.ceil(total / pageSize)
          }
        });
      } catch (error: any) {
        console.error('Error fetching return requests:', error);
        res.status(500).json({
          error: 'Failed to fetch return requests',
          details: error.message
        });
      }
      return;
    } else if (req.method === 'POST') {
      // Handle POST /api/allocation/return-request
      const { allocationId, message } = req.body;

      if (!allocationId) {
        return res.status(400).json({ error: 'Missing required field: allocationId' });
      }

      try {
        // Check if the allocation exists and belongs to the user
        const allocation = await prisma.allocation.findUnique({
          where: { id: Number(allocationId) },
          include: { item: true }
        });

        if (!allocation) {
          return res.status(404).json({ error: 'Allocation not found' });
        }

        if (allocation.userId !== payload.userId) {
          return res.status(403).json({ error: 'You can only create return requests for your own allocations' });
        }

        // Check if allocation is active
        if (allocation.status !== 'active') {
          return res.status(400).json({ error: 'Cannot create return request for a non-active allocation' });
        }

        // Check for existing pending request
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

        // No need to remove password as we're not including user details in the response
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
            }
          }
        };

        res.status(201).json(response);
      } catch (error: any) {
        console.error('Error creating return request:', error);
        res.status(500).json({
          error: 'Failed to create return request',
          details: error.message
        });
      }
    } else {
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
