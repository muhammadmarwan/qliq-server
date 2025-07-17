"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const payment_controller_1 = require("../../controllers/payment.controller");
describe('simulatePayment', () => {
    let req;
    let res;
    let statusMock;
    let jsonMock;
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
        await (0, payment_controller_1.simulatePayment)(req, res);
        expect(statusMock).not.toHaveBeenCalled();
        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({
            success: true,
            transactionId: expect.stringMatching(/^MOCK-/),
            message: 'Mock payment successful',
        }));
    });
    it('should return 400 if amount is missing or less than 1', async () => {
        req = { body: { amount: 0, method: 'card' } };
        await (0, payment_controller_1.simulatePayment)(req, res);
        expect(statusMock).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith({ success: false, message: 'Invalid payment data' });
        req = { body: { method: 'card' } };
        await (0, payment_controller_1.simulatePayment)(req, res);
        expect(statusMock).toHaveBeenCalledWith(400);
    });
    it('should return 400 if method is invalid', async () => {
        req = { body: { amount: 10, method: 'cash' } };
        await (0, payment_controller_1.simulatePayment)(req, res);
        expect(statusMock).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith({ success: false, message: 'Invalid payment data' });
    });
});
