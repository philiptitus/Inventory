import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Prisma } from '@prisma/client';
import jwt from 'jsonwebtoken';

// Extend the Prisma client to include all necessary methods
type ExtendedPrismaClient = PrismaClient & {
  repairRequest: {
    findMany: (args: any) => Promise<any[]>;
    findUnique: (args: any) => Promise<any>;
    create: (args: any) => Promise<any>;
    update: (args: any) => Promise<any>;
    delete: (args: any) => Promise<any>;
    count: (args?: any) => Promise<number>;
  };
  allocation: {
    findUnique: (args: any) => Promise<any>;
  };
  item: {
    update: (args: any) => Promise<any>;
  };
};

// Extend the Prisma client to include the repairRequests relation
type AllocationWithRepairRequests = Prisma.AllocationGetPayload<{
  include: {
    repairRequests: true;
    item: true;
    user: true;
  };
}>;

const prisma = new PrismaClient() as unknown as ExtendedPrismaClient;
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
  // Authentication
  const token = getTokenFromHeader(req);
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  const userId = Number(payload.userId);

  // Handle POST /api/repair-request - Create a new repair request
  if (req.method === 'POST') {
    try {
      const { allocationId, issue, additionalNotes } = req.body;

      // Validate required fields
      if (!allocationId || !issue) {
        return res.status(400).json({ 
          success: false,
          error: 'Missing required fields: allocationId and issue are required' 
        });
      }

      // Check if the allocation exists and belongs to the user
      const allocation = await (prisma as any).allocation.findUnique({
        where: { id: Number(allocationId) },
        include: {
          item: true,
          user: true,
          repairRequests: {
            where: {
              status: {
                in: ['pending', 'in_progress']
              }
            },
            select: {
              id: true,
              status: true,
              issue: true,
              requestedAt: true
            }
          }
        }
      }) as {
        id: number;
        userId: number;
        itemId: number;
        Date_Allocated: string;
        Date_Returned: string | null;
        status: string;
        Message: string | null;
        item: any;
        user: any;
        repairRequests: Array<{
          id: number;
          status: string;
          issue: string;
          requestedAt: Date;
        }>;
      } | null;

      // Check if allocation exists
      if (!allocation) {
        return res.status(404).json({ 
          success: false,
          error: 'Allocation not found' 
        });
      }

      // Check if the allocation belongs to the user
      if (allocation.userId !== userId) {
        return res.status(403).json({ 
          success: false,
          error: 'You do not have permission to request repair for this item' 
        });
      }

      // Check if there's already an active repair request for this allocation
      if (allocation.repairRequests && allocation.repairRequests.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'This item already has an active repair request',
          existingRequest: allocation.repairRequests[0]
        });
      }

      // Create the repair request
      const repairRequest = await (prisma as any).repairRequest.create({
        data: {
          allocationId: allocation.id,
          requestedById: userId,
          status: 'pending',
          issue: issue,
          adminNotes: additionalNotes || null,
          itemId: allocation.itemId
        },
        include: {
          item: {
            select: {
              id: true,
              pname: true,
              serialno: true
            }
          }
        }
      });

      // Update the item's repair status
      await (prisma as any).item.update({
        where: { id: allocation.itemId },
        data: { 
          isUnderRepair: true,
          lastRepairDate: new Date()
        }
      });

      return res.status(201).json({
        success: true,
        repairRequest: {
          id: repairRequest.id,
          status: repairRequest.status,
          issue: repairRequest.issue,
          additionalNotes: repairRequest.adminNotes,
          requestedAt: repairRequest.requestedAt,
          item: {
            id: repairRequest.item.id,
            name: repairRequest.item.pname,
            serialno: repairRequest.item.serialno
          }
        }
      });
      
    } catch (error: any) {
      console.error('Error creating repair request:', error);
      return res.status(500).json({ 
        success: false,
        error: 'Failed to create repair request',
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined
      });
    }
  }

  // Handle PATCH /api/repair-request - Update repair request status
  if (req.method === 'PATCH') {
    try {
      // Only admins can update repair requests
      const user = await (prisma as any).user.findUnique({
        where: { id: userId }
      });

      if (!user?.isAdmin) {
        return res.status(403).json({
          success: false,
          error: 'Only administrators can update repair requests'
        });
      }

      const { id, ...updateData } = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'Missing repair request ID'
        });
      }

      // Find the existing repair request
      const existingRequest = await (prisma as any).repairRequest.findUnique({
        where: { id: Number(id) },
        include: {
          item: true,
          allocation: true
        }
      });

      if (!existingRequest) {
        return res.status(404).json({
          success: false,
          error: 'Repair request not found'
        });
      }

      // Update the repair request
      const updatedRequest = await (prisma as any).repairRequest.update({
        where: { id: Number(id) },
        data: {
          status: updateData.status,
          adminNotes: updateData.adminNotes || existingRequest.adminNotes,
          completedById: updateData.status === 'completed' ? userId : existingRequest.completedById,
          completedAt: updateData.status === 'completed' ? new Date() : existingRequest.completedAt,
          updatedAt: new Date()
        },
        include: {
          item: {
            select: {
              id: true,
              pname: true,
              serialno: true
            }
          },
          requestedBy: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          allocation: {
            select: {
              id: true,
              status: true,
              itemId: true
            }
          }
        }
      });

      // If status is completed, update the item's repair status
      if (updateData.status === 'completed' && updateData.isItemFixed !== false) {
        await (prisma as any).item.update({
          where: { id: existingRequest.itemId },
          data: { 
            isUnderRepair: false,
            lastRepairDate: new Date()
          }
        });
      } else if (updateData.status === 'rejected') {
        // If rejected, mark the item as not under repair
        await (prisma as any).item.update({
          where: { id: existingRequest.itemId },
          data: { isUnderRepair: false }
        });
      }

      return res.status(200).json({
        success: true,
        repairRequest: {
          id: updatedRequest.id,
          status: updatedRequest.status,
          issue: updatedRequest.issue,
          adminNotes: updatedRequest.adminNotes,
          requestedAt: updatedRequest.requestedAt,
          updatedAt: updatedRequest.updatedAt,
          completedAt: updatedRequest.completedAt,
          item: {
            id: updatedRequest.item.id,
            name: updatedRequest.item.pname,
            serialno: updatedRequest.item.serialno
          },
          requestedBy: updatedRequest.requestedBy,
          allocation: {
            id: updatedRequest.allocation.id,
            status: updatedRequest.allocation.status,
            itemId: updatedRequest.allocation.itemId
          }
        }
      });
      
    } catch (error: any) {
      console.error('Error updating repair request:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to update repair request',
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined
      });
    }
  }

  // Handle GET /api/repair-request - Get repair requests
  if (req.method === 'GET') {
    try {
      const isAdmin = payload.isAdmin;
      
      // Pagination
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10));
      const skip = (page - 1) * limit;

      // Build where clause
      const where: any = {};
      
      // Regular users can only see their own requests
      if (!isAdmin) {
        where.requestedById = userId;
      }

      // Status filter
      if (req.query.status) {
        where.status = req.query.status;
      }

      // Search in issue/notes
      if (req.query.search) {
        where.OR = [
          { issue: { contains: req.query.search as string, mode: 'insensitive' } },
          { adminNotes: { contains: req.query.search as string, mode: 'insensitive' } }
        ];
      }

      // Sorting
      const orderBy: any = {};
      const sortField = (req.query.sortBy as string) || 'requestedAt';
      const sortOrder = (req.query.sortOrder as string)?.toLowerCase() === 'asc' ? 'asc' : 'desc';
      orderBy[sortField] = sortOrder;

      // Get total count for pagination
      const total = await prisma.repairRequest.count({ where });

      // Get paginated results with proper typing
      const repairRequests = await (prisma as any).repairRequest.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          item: {
            select: {
              id: true,
              pname: true,
              serialno: true
            }
          },
          requestedBy: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          completedBy: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          allocation: {
            select: {
              id: true,
              status: true,
              Date_Allocated: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  department: {
                    select: {
                      id: true,
                      Dep_name: true
                    }
                  }
                }
              }
            }
          }
        }
      });

      return res.status(200).json({
        success: true,
        data: repairRequests.map((request: any) => ({
          id: request.id,
          status: request.status,
          issue: request.issue,
          adminNotes: request.adminNotes,
          requestedAt: request.requestedAt,
          updatedAt: request.updatedAt,
          completedAt: request.completedAt,
          item: request.item,
          requestedBy: request.requestedBy,
          completedBy: request.completedBy,
          allocation: request.allocation
        })),
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      });

    } catch (error) {
      console.error('Error fetching repair requests:', error);
      return res.status(500).json({ 
        success: false,
        error: 'Failed to fetch repair requests',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  // Handle PATCH /api/repair-request/[id] - Update repair request status (Admin only)
  if (req.method === 'PATCH') {
    try {
      // Verify admin access
      if (!payload.isAdmin) {
        return res.status(403).json({ 
          success: false,
          error: 'Only administrators can update repair requests' 
        });
      }

      const { id } = req.query;
      const { status, adminNotes, isItemFixed } = req.body;

      // Validate required fields
      if (!id) {
        return res.status(400).json({ 
          success: false, 
          error: 'Missing repair request ID' 
        });
      }

      // Validate status is provided and valid
      if (!status || !['in_progress', 'completed', 'rejected'].includes(status)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid or missing status. Must be one of: in_progress, completed, rejected' 
        });
      }

      // If marking as completed, isItemFixed is required
      if (status === 'completed' && typeof isItemFixed === 'undefined') {
        return res.status(400).json({ 
          success: false, 
          error: 'isItemFixed is required when status is completed' 
        });
      }

      // Find the existing repair request with related data
      const existingRequest = await prisma.repairRequest.findUnique({
        where: { id: Number(id) },
        include: {
          item: true,
          allocation: true
        }
      });

      if (!existingRequest) {
        return res.status(404).json({ 
          success: false, 
          error: 'Repair request not found' 
        });
      }

      // Validate status transition
      const validTransitions: Record<string, string[]> = {
        'pending': ['in_progress', 'rejected'],
        'in_progress': ['completed', 'rejected'],
        'completed': [],
        'rejected': []
      };

      if (!validTransitions[existingRequest.status]?.includes(status)) {
        return res.status(400).json({
          success: false,
          error: `Invalid status transition from ${existingRequest.status} to ${status}`
        });
      }

      // Prepare update data
      const updateData: any = {
        status,
        updatedAt: new Date(),
        adminNotes: adminNotes || existingRequest.adminNotes
      };

      // If completing the request, set completedAt and completedBy
      if (status === 'completed') {
        updateData.completedAt = new Date();
        updateData.completedById = userId;
      }

      // Update the repair request
      const updatedRequest = await prisma.$transaction(async (tx) => {
        const repairRequest = await (tx as any).repairRequest.update({
          where: { id: Number(id) },
          data: updateData,
          include: {
            item: {
              select: {
                id: true,
                pname: true,
                serialno: true
              }
            },
            requestedBy: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            completedBy: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            allocation: {
              select: {
                id: true,
                status: true,
                Date_Allocated: true,
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    department: {
                      select: {
                        id: true,
                        Dep_name: true
                      }
                    }
                  }
                }
              }
            }
          }
        });

        // If completing the repair, update the item's repair status
        if (status === 'completed') {
          const updateData: any = {
            isUnderRepair: !isItemFixed // If item is fixed, set to false
          };
          
          if (isItemFixed) {
            updateData.lastRepairDate = new Date();
          }
          
          await prisma.item.update({
            where: { id: repairRequest.itemId },
            data: updateData
          });
        }

        return repairRequest;
      });

      return res.status(200).json({
        success: true,
        repairRequest: updatedRequest
      });

    } catch (error) {
      console.error('Error updating repair request:', error);
      return res.status(500).json({ 
        success: false,
        error: 'Failed to update repair request',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  // Method not allowed
  return res.status(405).json({ error: 'Method not allowed' });
}
