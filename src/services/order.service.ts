import Order from '../models/Order';

export async function getPaginatedOrders(page: number, limit: number) {
  const skip = (page - 1) * limit;

  const total = await Order.countDocuments();

  const orders = await Order.find()        
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return { orders, total };
}

export async function getAllOrders(userId: string) {

    const orders = await Order.find({ user: userId })
    .sort({ createdAt: -1 })
    .populate('items.product', 'name image price')
    .lean();

  return orders;
}
