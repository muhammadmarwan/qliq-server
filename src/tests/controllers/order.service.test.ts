import * as orderService from '../../services/order.service';
import Order from '../../models/Order';

jest.mock('../../models/Order');

describe('Order Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllOrders', () => {
    it('should return all orders for a user with populated products', async () => {
      const userId = 'user123';
      const mockOrders = [
        {
          _id: 'order1',
          items: [
            { product: { name: 'Product 1', image: 'img1.jpg', price: 10 } },
          ],
        },
      ];

      // Chain mocks for find().sort().populate().lean()
      const mockLean = jest.fn().mockResolvedValue(mockOrders);
      const mockPopulate = jest.fn(() => ({ lean: mockLean }));
      const mockSort = jest.fn(() => ({ populate: mockPopulate }));

      (Order.find as jest.Mock).mockReturnValue({ sort: mockSort });

      const result = await orderService.getAllOrders(userId);

      expect(Order.find).toHaveBeenCalledWith({ user: userId });
      expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(mockPopulate).toHaveBeenCalledWith('items.product', 'name image price');
      expect(mockLean).toHaveBeenCalled();
      expect(result).toEqual(mockOrders);
    });
  });
});
