import User from '../models/User';
import Order from '../models/Order';
import Product from '../models/Product';

export async function getAdminDashboardStats() {
  try {
    const [totalUsers, totalOrders, totalProducts] = await Promise.all([
      User.countDocuments(),
      Order.countDocuments(),
      Product.countDocuments(),
    ]);

    const totalSalesAgg = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    const totalCommissionAgg = await User.aggregate([
      { $group: { _id: null, total: { $sum: '$commissionBalance' } } }
    ]);

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email');

    const topUsersByOrders = await Order.aggregate([
      { $group: { _id: '$user', orderCount: { $sum: 1 }, totalSpent: { $sum: '$total' } } },
      { $sort: { orderCount: -1 } },
      { $limit: 5 },
    ]);

    return {
      totalUsers,
      totalOrders,
      totalProducts,
      totalSales: totalSalesAgg[0]?.total || 0,
      totalCommission: totalCommissionAgg[0]?.total || 0,
      recentOrders,
      topUsersByOrders,
    };
  } catch (error) {
    throw new Error('Failed to load admin stats: ' + (error as any).message);
  }
}
