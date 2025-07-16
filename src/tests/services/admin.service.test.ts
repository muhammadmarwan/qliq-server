// tests/services/adminDashboard.service.test.ts

import * as adminService from '../../services/admin.service';
import User from '../../models/User';
import Order from '../../models/Order';
import Product from '../../models/Product';

jest.mock('../../models/User');
jest.mock('../../models/Order');
jest.mock('../../models/Product');

describe('Admin Dashboard Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAdminDashboardStats', () => {
    it('should return aggregated admin stats', async () => {
      // Mock countDocuments
      (User.countDocuments as jest.Mock).mockResolvedValue(100);
      (Order.countDocuments as jest.Mock).mockResolvedValue(50);
      (Product.countDocuments as jest.Mock).mockResolvedValue(200);

      // Mock aggregate for totalSalesAgg
      (Order.aggregate as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve([{ total: 12345 }])
      );

      // Mock aggregate for totalCommissionAgg
      (User.aggregate as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve([{ total: 6789 }])
      );

      // Mock recentOrders query with chaining
      const mockPopulate = jest.fn().mockResolvedValue([
        { _id: 'order1', user: { name: 'User1', email: 'user1@example.com' } },
        { _id: 'order2', user: { name: 'User2', email: 'user2@example.com' } },
      ]);
      const mockLimit = jest.fn(() => ({ populate: mockPopulate }));
      const mockSort = jest.fn(() => ({ limit: mockLimit }));
      (Order.find as jest.Mock).mockReturnValue({ sort: mockSort });

      // Mock aggregate for topUsersByOrders
      (Order.aggregate as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve([
          { _id: 'user1', orderCount: 10, totalSpent: 5000 },
          { _id: 'user2', orderCount: 8, totalSpent: 4000 },
        ])
      );

      const result = await adminService.getAdminDashboardStats();

      expect(User.countDocuments).toHaveBeenCalled();
      expect(Order.countDocuments).toHaveBeenCalled();
      expect(Product.countDocuments).toHaveBeenCalled();

      expect(Order.aggregate).toHaveBeenCalledTimes(2);
      expect(User.aggregate).toHaveBeenCalledTimes(1);

      expect(Order.find).toHaveBeenCalled();

      expect(result).toEqual({
        totalUsers: 100,
        totalOrders: 50,
        totalProducts: 200,
        totalSales: 12345,
        totalCommission: 6789,
        recentOrders: [
          { _id: 'order1', user: { name: 'User1', email: 'user1@example.com' } },
          { _id: 'order2', user: { name: 'User2', email: 'user2@example.com' } },
        ],
        topUsersByOrders: [
          { _id: 'user1', orderCount: 10, totalSpent: 5000 },
          { _id: 'user2', orderCount: 8, totalSpent: 4000 },
        ],
      });
    });

    it('should throw an error if something goes wrong', async () => {
      (User.countDocuments as jest.Mock).mockRejectedValue(new Error('DB error'));

      await expect(adminService.getAdminDashboardStats()).rejects.toThrow(
        'Failed to load admin stats: DB error'
      );
    });
  });
});
