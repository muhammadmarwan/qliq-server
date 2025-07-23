import { Request, Response } from 'express';
import * as adminService from '../services/admin.service';

export async function getDashoardStats(req: Request, res: Response) {
  try {
    const stats = await adminService.getAdminDashboardStats();
    res.json(stats);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export async function getMyIP(req: Request, res: Response) {
  try {
    const ip = await adminService.getMyIP();
    res.json(ip);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
