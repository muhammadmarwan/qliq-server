import { simulatePayment } from '../../controllers/payment.controller';
import { Request, Response } from 'express';

describe('simulatePayment', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    statusMock = jest.fn().mockReturnThis(); 
    jsonMock = jest.fn();
    res = {
      status: statusMock,
      json: jsonMock,
    };
  });

  it('should return success for valid payment data', async () => {
    req = {
      body: { amount: 100, method: 'card' },
    };

    await simulatePayment(req as Request, res as Response);

    expect(statusMock).not.toHaveBeenCalled();
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        transactionId: expect.stringMatching(/^MOCK-/),
        message: 'Mock payment successful',
      }),
    );
  });

  it('should return 400 if amount is missing or less than 1', async () => {
    req = { body: { amount: 0, method: 'card' } };
    await simulatePayment(req as Request, res as Response);
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({ success: false, message: 'Invalid payment data' });

    req = { body: { method: 'card' } };
    await simulatePayment(req as Request, res as Response);
    expect(statusMock).toHaveBeenCalledWith(400);
  });

  it('should return 400 if method is invalid', async () => {
    req = { body: { amount: 10, method: 'cash' } };
    await simulatePayment(req as Request, res as Response);
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({ success: false, message: 'Invalid payment data' });
  });
});
