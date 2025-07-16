import { Request, Response, NextFunction } from 'express';

export function authorizeRoles(...allowedRoles: ('user' | 'admin')[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = (req as any).user ? 'user' : (req as any).admin ? 'admin' : null;

    if (!role || !allowedRoles.includes(role)) {
      return res.status(403).json({ message: 'Access Denied' });
    }
    next();
  };
}