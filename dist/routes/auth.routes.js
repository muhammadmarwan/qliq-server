"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validate_middleware_1 = require("../middleware/validate.middleware");
const user_validation_1 = require("../validations/user.validation");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const authorize_middleware_1 = require("../middleware/authorize.middleware");
const router = express_1.default.Router();
router.post('/user/register', (0, validate_middleware_1.validateRequest)(user_validation_1.registerSchema), auth_controller_1.registerUser);
router.post('/user/login', (0, validate_middleware_1.validateRequest)(user_validation_1.loginSchema), auth_controller_1.loginUser);
router.post('/admin/register', auth_middleware_1.authenticateToken, (0, authorize_middleware_1.authorizeRoles)('admin'), auth_controller_1.registerAdmin);
router.post('/admin/login', auth_controller_1.loginAdmin);
exports.default = router;
