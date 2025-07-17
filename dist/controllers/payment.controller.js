"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simulatePayment = simulatePayment;
async function simulatePayment(req, res) {
    const { amount, method } = req.body;
    if (!amount || amount < 1 || !['card', 'wallet', 'upi'].includes(method)) {
        return res.status(400).json({ success: false, message: 'Invalid payment data' });
    }
    await new Promise((res) => setTimeout(res, 1000));
    res.json({
        success: true,
        transactionId: `MOCK-${Date.now()}`,
        message: 'Mock payment successful',
    });
}
