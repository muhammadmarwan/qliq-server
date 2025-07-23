import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/authorize.middleware';
import { getDashoardStats, getMyIP } from '../controllers/admin.controller';

const router = express.Router();

router.get(
    '/dashboard/stats', 
    authenticateToken, 
    authorizeRoles('admin'),
    getDashoardStats
);

router.get(
    '/get-my-ip', 
    getMyIP
);

export default router;
