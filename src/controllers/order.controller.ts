import { Request, Response } from 'express';
import { getAllOrders, getPaginatedOrders } from '../services/order.service';

export async function getOrdersPaginated(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const { orders, total } = await getPaginatedOrders(page, limit);

    res.json({
      data: orders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error('Error fetching paginated orders:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch orders' });
  }
}

export async function getOrdersList(req: Request, res: Response) {
  try {
    const userId = (req as any).user.id;
    const orders = await getAllOrders(userId);
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to fetch orders' });
  }
}
