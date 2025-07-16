import express from 'express';
import { getOrdersList, getOrdersPaginated } from '../controllers/order.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/authorize.middleware';

const router = express.Router();

router.get(
    '/',
    authenticateToken,
    authorizeRoles('admin'),
    getOrdersPaginated
);

router.get(
    '/get-all-orders',
    authenticateToken,
    authorizeRoles('user'),
    getOrdersList
);

export default router;
