import express from 'express';
import { checkout } from '../controllers/checkout.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/', authenticateToken, checkout);

export default router;
