"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("../controllers/order.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const authorize_middleware_1 = require("../middleware/authorize.middleware");
const router = express_1.default.Router();
router.get('/', auth_middleware_1.authenticateToken, (0, authorize_middleware_1.authorizeRoles)('admin'), order_controller_1.getOrdersPaginated);
router.get('/get-all-orders', auth_middleware_1.authenticateToken, (0, authorize_middleware_1.authorizeRoles)('user'), order_controller_1.getOrdersList);
exports.default = router;
