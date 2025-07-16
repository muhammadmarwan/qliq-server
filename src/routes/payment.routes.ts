import express from 'express';
import { simulatePayment } from '../controllers/payment.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { mockPaymentSchema } from '../validations/payment.validation';
const router = express.Router();

router.post(
    '/mock', 
    authenticateToken,
    validateRequest(mockPaymentSchema),
    simulatePayment);

export default router;
