import axios from 'axios';
import * as checkoutService from '../../services/checkout.service';
import Cart from '../../models/Cart';
import Order from '../../models/Order';
import User from '../../models/User';

jest.mock('axios');
jest.mock('../../models/Cart');
jest.mock('../../models/Order');
jest.mock('../../models/User');

describe('checkout service', () => {
  const userId = 'user123';
  const token = 'test-token';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error if cart is empty', async () => {
    const mockPopulate = jest.fn().mockResolvedValue(null);
    (Cart.findOne as jest.Mock).mockReturnValue({ populate: mockPopulate });

    await expect(checkoutService.checkout(userId, token)).rejects.toThrow('Cart is empty');
  });

  it('should process checkout and distribute commission on success', async () => {
    const mockCart = {
      items: [
        {
          product: { _id: 'prod1', price: 100 },
          quantity: 2,
        },
      ],
    };

    const mockUser = {
      _id: userId,
      referrer: 'ref1',
    };

    const mockRef1 = {
      _id: 'ref1',
      referrer: 'ref2',
    };
    const mockRef2 = {
      _id: 'ref2',
      referrer: 'ref3',
    };
    const mockRef3 = {
      _id: 'ref3',
      referrer: null,
    };

    const mockPopulate = jest.fn().mockResolvedValue(mockCart);
    (Cart.findOne as jest.Mock).mockReturnValue({ populate: mockPopulate });

    (axios.post as jest.Mock).mockResolvedValue({
      data: {
        success: true,
        transactionId: 'txn-123',
      },
    });

    (Order.create as jest.Mock).mockResolvedValue({ id: 'order1' });

    (User.findById as jest.Mock)
      .mockResolvedValueOnce(mockUser)
      .mockResolvedValueOnce(mockRef1)
      .mockResolvedValueOnce(mockRef2)
      .mockResolvedValueOnce(mockRef3);

    (User.findByIdAndUpdate as jest.Mock).mockResolvedValue({});

    (Cart.findOneAndDelete as jest.Mock).mockResolvedValue(true);

    const order = await checkoutService.checkout(userId, token);

    expect(Cart.findOne).toHaveBeenCalledWith({ user: userId });
    expect(axios.post).toHaveBeenCalled();
    expect(Order.create).toHaveBeenCalled();
    expect(Cart.findOneAndDelete).toHaveBeenCalledWith({ user: userId });
    expect(User.findByIdAndUpdate).toHaveBeenCalledTimes(3);
    expect(order).toEqual({ id: 'order1' });
  });
});
