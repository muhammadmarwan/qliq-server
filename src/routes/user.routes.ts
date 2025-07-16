import express from 'express';
import { getMLMTree, getMLMUserTree, getUserDetails } from '../controllers/user.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/authorize.middleware';

const router = express.Router();

router.get(
    '/me', 
    authenticateToken, 
    authorizeRoles('user'),
    getUserDetails
);

router.get(
    '/mlm-tree-user',
    authenticateToken, 
    authorizeRoles('user'),
    getMLMUserTree
);

router.get(
    '/mlm-tree', 
    authenticateToken, 
    authorizeRoles('admin'),
    getMLMTree
);

export default router;
