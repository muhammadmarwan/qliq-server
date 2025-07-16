import { Request, Response } from 'express';
import * as checkoutService from '../services/checkout.service';

export async function checkout(req: Request, res: Response) {
  try {
    const token = req.headers.authorization?.split(' ')[1] || '';
    const userId = (req as any).user.id;
    const order = await checkoutService.checkout(userId, token);
    res.status(201).json({ message: 'Checkout successful', order });
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Checkout failed' });
  }
}