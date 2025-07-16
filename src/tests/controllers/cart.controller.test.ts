import { getCart, addToCart, removeFromCart } from '../../controllers/cart.controller';
import * as cartService from '../../services/cart.service';
import Product from '../../models/Product';
import { Request, Response } from 'express';

jest.mock('../../services/cart.service');
jest.mock('../../models/Product');

describe('Cart Controller', () => {
  let mockRequest = {} as Request;
  let mockStatus: jest.Mock;
  let mockJson: jest.Mock;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn(() => ({ json: mockJson })); // ✅ connect mockJson here
    mockResponse = {
      status: mockStatus,
      json: mockJson,
    };
    jest.clearAllMocks();
  });

  describe('getCart', () => {
    it('should return cart if found', async () => {
      const cartData = { items: [{ product: 'abc', quantity: 2 }] };
      (cartService.getCartByUser as jest.Mock).mockResolvedValue(cartData);

      mockRequest = { user: { id: 'user123' } } as any;
      await getCart(mockRequest, mockResponse as Response);

      expect(cartService.getCartByUser).toHaveBeenCalledWith('user123');
      expect(mockJson).toHaveBeenCalledWith(cartData);
    });

    it('should return empty cart if not found', async () => {
      (cartService.getCartByUser as jest.Mock).mockResolvedValue(null);

      mockRequest = { user: { id: 'user123' } } as any;
      await getCart(mockRequest, mockResponse as Response);

      expect(mockJson).toHaveBeenCalledWith({ items: [] });
    });

    it('should handle errors', async () => {
      (cartService.getCartByUser as jest.Mock).mockRejectedValue(new Error('Failed'));

      mockRequest = { user: { id: 'user123' } } as any;
      await getCart(mockRequest, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Failed' });
    });
  });

  describe('addToCart', () => {
    it('should add item to cart successfully', async () => {
      (Product.exists as jest.Mock).mockResolvedValue(true);
      const mockCart = { items: [{ product: 'prod123', quantity: 1 }] };
      (cartService.addToCart as jest.Mock).mockResolvedValue(mockCart);

      mockRequest = {
        user: { id: 'user123' },
        body: { productId: 'prod123', quantity: 1 },
      } as any;

      await addToCart(mockRequest, mockResponse as Response);

      expect(Product.exists).toHaveBeenCalledWith({ _id: 'prod123' });
      expect(cartService.addToCart).toHaveBeenCalledWith('user123', 'prod123', 1);
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(mockCart);
    });

    it('should return 400 if productId or quantity invalid', async () => {
      mockRequest = {
        user: { id: 'user123' },
        body: { productId: '', quantity: 0 },
      } as any;

      await addToCart(mockRequest, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Invalid product or quantity' });
    });

    it('should return 404 if product does not exist', async () => {
      (Product.exists as jest.Mock).mockResolvedValue(false);

      mockRequest = {
        user: { id: 'user123' },
        body: { productId: 'prod123', quantity: 1 },
      } as any;

      await addToCart(mockRequest, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Product not found' });
    });

    it('should handle addToCart error', async () => {
      (Product.exists as jest.Mock).mockResolvedValue(true);
      (cartService.addToCart as jest.Mock).mockRejectedValue(new Error('Add failed'));

      mockRequest = {
        user: { id: 'user123' },
        body: { productId: 'prod123', quantity: 1 },
      } as any;

      await addToCart(mockRequest, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Add failed' });
    });
  });

  describe('removeFromCart', () => {
    it('should remove item from cart successfully', async () => {
      const updatedCart = { items: [] };
      (cartService.removeFromCart as jest.Mock).mockResolvedValue(updatedCart);

      mockRequest = {
        user: { id: 'user123' },
        params: { productId: 'prod123' },
      } as any;

      await removeFromCart(mockRequest, mockResponse as Response);

      expect(cartService.removeFromCart).toHaveBeenCalledWith('user123', 'prod123');
      expect(mockJson).toHaveBeenCalledWith(updatedCart);
    });

    it('should return 400 if productId missing', async () => {
      mockRequest = {
        user: { id: 'user123' },
        params: {},
      } as any;

      await removeFromCart(mockRequest, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Product ID is required' });
    });

    it('should handle removeFromCart error', async () => {
      (cartService.removeFromCart as jest.Mock).mockRejectedValue(new Error('Remove failed'));

      mockRequest = {
        user: { id: 'user123' },
        params: { productId: 'prod123' },
      } as any;

      await removeFromCart(mockRequest, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Remove failed' });
    });
  });
});
