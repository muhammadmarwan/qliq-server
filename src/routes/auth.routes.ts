import express from 'express';
import { validateRequest } from '../middleware/validate.middleware';
import { loginSchema, registerSchema } from '../validations/user.validation';
import { loginAdmin, loginUser, registerAdmin, registerUser } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/authorize.middleware';

const router = express.Router();

router.post(
    '/user/register', 
    validateRequest(registerSchema), 
    registerUser);
    
router.post(
    '/user/login', 
    validateRequest(loginSchema), 
    loginUser);

router.post(
    '/admin/register', 
    authenticateToken,
    authorizeRoles('admin'),
    registerAdmin,
); 

router.post(
    '/admin/login', 
    loginAdmin
);


export default router;
