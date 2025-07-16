import { checkout } from '../../controllers/checkout.controller';
import * as checkoutService from '../../services/checkout.service';
import { Request, Response } from 'express';

jest.mock('../../services/checkout.service');

// Extend Request to include user property
interface AuthenticatedRequest extends Request {
  user: { id: string };
}

describe('Checkout Controller', () => {
  let mockRequest: Partial<AuthenticatedRequest>;
  let mockResponse: Partial<Response>;
  let mockStatus: jest.Mock;
  let mockJson: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn(() => ({ json: mockJson })) as any;
    mockResponse = {
      status: mockStatus,
      json: mockJson,
    };
    jest.clearAllMocks();
  });

  it('should perform checkout and return order', async () => {
    const mockOrder = { id: 'order123', total: 99 };
    (checkoutService.checkout as jest.Mock).mockResolvedValue(mockOrder);

    mockRequest = {
      headers: { authorization: 'Bearer test-token' },
      user: { id: 'user123' },
    };

    await checkout(mockRequest as Request, mockResponse as Response);

    expect(checkoutService.checkout).toHaveBeenCalledWith('user123', 'test-token');
    expect(mockStatus).toHaveBeenCalledWith(201);
    expect(mockJson).toHaveBeenCalledWith({
      message: 'Checkout successful',
      order: mockOrder,
    });
  });

  it('should return 400 if checkout service fails', async () => {
    (checkoutService.checkout as jest.Mock).mockRejectedValue(new Error('Something went wrong'));

    mockRequest = {
      headers: { authorization: 'Bearer token123' },
      user: { id: 'user123' },
    };

    await checkout(mockRequest as Request, mockResponse as Response);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({ message: 'Something went wrong' });
  });

  it('should handle missing token gracefully', async () => {
    const mockOrder = { id: 'order456', total: 45 };
    (checkoutService.checkout as jest.Mock).mockResolvedValue(mockOrder);

    mockRequest = {
      headers: {},
      user: { id: 'user456' },
    };

    await checkout(mockRequest as Request, mockResponse as Response);

    expect(checkoutService.checkout).toHaveBeenCalledWith('user456', '');
    expect(mockStatus).toHaveBeenCalledWith(201);
    expect(mockJson).toHaveBeenCalledWith({
      message: 'Checkout successful',
      order: mockOrder,
    });
  });
});
