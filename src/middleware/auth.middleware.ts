import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import Admin from '../models/Admin';

interface JwtPayload {
  id: string;
  role: 'user' | 'admin';
}

export async function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    if (decoded.role === 'user') {
      const user = await User.findById(decoded.id);
      if (!user) return res.status(401).json({ message: 'User not found' });
      (req as any).user = user;
    } else if (decoded.role === 'admin') {
      const admin = await Admin.findById(decoded.id);
      if (!admin) return res.status(401).json({ message: 'Admin not found' });
      (req as any).admin = admin;
    } else {
      return res.status(403).json({ message: 'Invalid role' });
    }

    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}
