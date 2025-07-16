import mongoose from 'mongoose';
import * as cartService from '../../services/cart.service';
import Cart from '../../models/Cart';

jest.mock('../../models/Cart');

describe('Cart Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCartByUser', () => {
    it('should return populated cart', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const mockCart = { user: userId, items: [] };

      const populateMock = jest.fn().mockReturnThis();
      const leanMock = jest.fn().mockResolvedValue(mockCart);
      (Cart.findOne as jest.Mock).mockReturnValue({
        populate: populateMock,
        lean: leanMock,
      });

      const result = await cartService.getCartByUser(userId);

      expect(Cart.findOne).toHaveBeenCalledWith({ user: userId });
      expect(populateMock).toHaveBeenCalledWith('items.product', 'name price image');
      expect(leanMock).toHaveBeenCalled();
      expect(result).toEqual(mockCart);
    });
  });

  describe('addToCart', () => {
    it('should create a new cart if none exists', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const productId = new mongoose.Types.ObjectId().toString();
      const quantity = 2;

      (Cart.findOne as jest.Mock).mockResolvedValue(null);
      const mockNewCart = { user: userId, items: [{ product: productId, quantity }] };
      (Cart.create as jest.Mock).mockResolvedValue(mockNewCart);

      const result = await cartService.addToCart(userId, productId, quantity);

      expect(Cart.create).toHaveBeenCalledWith({
        user: userId,
        items: [{ product: expect.any(mongoose.Types.ObjectId), quantity }],
      });
      expect(result).toEqual(mockNewCart);
    });

    it('should update quantity if product exists in cart', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const productId = new mongoose.Types.ObjectId().toString();
      const quantity = 1;

      const mockCart = {
        user: userId,
        items: [
          { product: new mongoose.Types.ObjectId(productId), quantity: 1 },
        ],
        save: jest.fn().mockResolvedValue(true),
      };

      (Cart.findOne as jest.Mock).mockResolvedValue(mockCart);

      const result = await cartService.addToCart(userId, productId, quantity);

      expect(mockCart.save).toHaveBeenCalled();
      expect(result).toEqual(mockCart);
      expect(mockCart.items[0].quantity).toBe(2);
    });

    it('should add a new item if product not in cart', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const productId = new mongoose.Types.ObjectId().toString();
      const quantity = 1;

      const mockCart = {
        user: userId,
        items: [],
        save: jest.fn().mockResolvedValue(true),
      };

      (Cart.findOne as jest.Mock).mockResolvedValue(mockCart);

      const result = await cartService.addToCart(userId, productId, quantity);

      expect(mockCart.items.length).toBe(1);
      expect(result).toEqual(mockCart);
    });
  });

  describe('removeFromCart', () => {
    it('should remove item from cart and return updated cart', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const cartItemId = new mongoose.Types.ObjectId().toString();

      const populatedCart = {
        user: userId,
        items: [],
      };

      const populateMock = jest.fn().mockResolvedValue(populatedCart);
      (Cart.findOneAndUpdate as jest.Mock).mockReturnValue({
        populate: populateMock,
      });

      const result = await cartService.removeFromCart(userId, cartItemId);

      expect(Cart.findOneAndUpdate).toHaveBeenCalledWith(
        { user: expect.any(mongoose.Types.ObjectId) },
        { $pull: { items: { _id: expect.any(mongoose.Types.ObjectId) } } },
        { new: true }
      );

      expect(populateMock).toHaveBeenCalledWith('items.product', 'name price');
      expect(result).toEqual(populatedCart);
    });

    it('should throw error if cart not found or item not in cart', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const cartItemId = new mongoose.Types.ObjectId().toString();

      const populateMock = jest.fn().mockResolvedValue(null);
      (Cart.findOneAndUpdate as jest.Mock).mockReturnValue({
        populate: populateMock,
      });

      // Suppress console.error
      jest.spyOn(console, 'error').mockImplementation(() => {});

      await expect(cartService.removeFromCart(userId, cartItemId)).rejects.toThrow(
        'Cart not found or item already removed'
      );
    });
  });
});
