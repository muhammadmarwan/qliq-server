import express from 'express';
import { validateRequest } from '../middleware/validate.middleware';
import {
  addToCartSchema,
} from '../validations/cart.validation';
import { addToCart, getCart, removeFromCart } from '../controllers/cart.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/authorize.middleware';

const router = express.Router();

router.post(
  '/add', 
  authenticateToken,
  authorizeRoles('user'),
  validateRequest(addToCartSchema),
  addToCart
);

router.get(
  '/', 
  authenticateToken,
  authorizeRoles('user'),
  getCart
);

router.delete(
  '/remove/:productId',
  authenticateToken,
  authorizeRoles('user'),
  removeFromCart
);

export default router;
