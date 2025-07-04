import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

interface TokenPayload {
  userId: number;
  email: string;
  isAdmin: boolean;
}

interface UserResponse extends Omit<User, 'password'> {
  password?: string;
}

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
  // GET user profile
  if (req.method === 'GET') {
    const token = getTokenFromHeader(req);
    if (!token) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }
    
    const payload = verifyToken(token);
    if (!payload) {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          isAdmin: true,
          department: true,
          county: true,
          items: true
        }
      });

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.status(200).json(user);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to fetch user', details: error.message });
    }
    return;
  }

  // PUT update user
  if (req.method === 'PUT') {
    const token = getTokenFromHeader(req);
    if (!token) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const payload = verifyToken(token);
    if (!payload) {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }

    const { name, phone, password, payroll_no, department, county } = req.body;
    const data: Partial<User> = {};

    if (name) data.name = name;
    if (phone) data.phone = phone;
    if (password) data.password = await bcrypt.hash(password, 10);
    if (payroll_no) data.payroll_no = payroll_no;
    if (department) data.department = department;
    if (county) data.county = county;

    try {
      const updatedUser = await prisma.user.update({
        where: { id: payload.userId },
        data,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          isAdmin: true,
          department: true,
          county: true,
          items: true
        }
      });
      res.status(200).json(updatedUser);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to update user', details: error.message });
    }
    return;
  }

  // DELETE user
  if (req.method === 'DELETE') {
    const token = getTokenFromHeader(req);
    if (!token) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }
    
    const payload = verifyToken(token);
    if (!payload) {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }

    try {
      await prisma.user.delete({ where: { id: payload.userId } });
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to delete user', details: error.message });
    }
    return;
  }

  // POST register/login
  if (req.method === 'POST') {
    const { action, name, email, password, phone, isAdmin, department, county } = req.body;
    
    if (!action || !['register', 'login'].includes(action)) {
      res.status(400).json({ error: 'Action must be register or login' });
      return;
    }

    if (action === 'register') {
      if (!name || !email || !password || !phone || !county) {
        res.status(400).json({ 
          error: 'Missing required fields: name, email, password, phone, county' 
        });
        return;
      }

      try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
          res.status(409).json({ error: 'User already exists' });
          return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userData: any = {
          name,
          email,
          password: hashedPassword,
          phone,
          isAdmin: !!isAdmin,
          county
        };
        if (department) userData.departmentId = department;
        const user = await prisma.user.create({
          data: userData,
          select: {
            id: true,
            name: true,
            email: true,
            isAdmin: true
          }
        });

        const token = jwt.sign(
          { userId: user.id, email: user.email, isAdmin: user.isAdmin },
          JWT_SECRET,
          { expiresIn: '1d' }
        );

        res.status(201).json({ 
          message: 'User registered successfully',
          token,
          user
        });
      } catch (error: any) {
        res.status(500).json({ 
          error: 'Failed to register user', 
          details: error.message 
        });
      }
      return;
    } 
    
    // Login
    if (action === 'login') {
      if (!email || !password) {
        res.status(400).json({ 
          error: 'Missing required fields: email, password' 
        });
        return;
      }

      try {
        const user = await prisma.user.findUnique({ 
          where: { email },
          select: {
            id: true,
            name: true,
            email: true,
            password: true,
            phone: true,
            isAdmin: true,
            department: true,
            county: true,
            items: true
          }
        });

        if (!user) {
          res.status(401).json({ error: 'Invalid credentials' });
          return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          res.status(401).json({ error: 'Invalid credentials' });
          return;
        }

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;

        const token = jwt.sign(
          { userId: user.id, email: user.email, isAdmin: user.isAdmin },
          JWT_SECRET,
          { expiresIn: '1d' }
        );

        res.status(200).json({ 
          message: 'Login successful', 
          token,
          user: userWithoutPassword
        });
      } catch (error: any) {
        res.status(500).json({ 
          error: 'Login failed', 
          details: error.message 
        });
      }
      return;
    }
  }

  // Method not allowed
  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
