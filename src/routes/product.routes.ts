import express from 'express';
import { createProduct, getAIRecommendations, getPaginatedProducts, getProducts, updateProducts } from '../controllers/product.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/authorize.middleware';

const router = express.Router();

router.get(
    '/', 
    authenticateToken, 
    authorizeRoles('admin'),
    getPaginatedProducts
);

router.get(
    '/products-list',
    authenticateToken,
    authorizeRoles('user'),
    getProducts
)

router.post(
    '/',
    authenticateToken,
    authorizeRoles('admin'),
    createProduct
)

router.put(
    '/:productId',
    authenticateToken,
    authorizeRoles('admin'),
    updateProducts
)

router.get(
    '/recommendations-ai', 
    authenticateToken, 
    authorizeRoles('user'),
    getAIRecommendations
);



export default router;
