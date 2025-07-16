import e, { Request, Response } from 'express';
import * as userService from '../services/user.service';

export async function getMLMTree(req: Request, res: Response) {
  try {

    const tree = await userService.getUserTree();
    res.json(tree);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to fetch MLM tree' });
  }
}

export async function getMLMUserTree(req: Request, res: Response) {
  try {
    const userId = (req as any).user.id;
    const tree = await userService.getUserTreeByUserId(userId);
    res.json(tree);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to fetch MLM tree' });
  }
}

export async function getUserDetails(req: Request, res: Response) {
  try {
    const userId = (req as any).user.id;
    const user = await userService.getUserDetails(userId);
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to fetch user details' });
  }
}
