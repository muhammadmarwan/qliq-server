"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validate_middleware_1 = require("../middleware/validate.middleware");
const cart_validation_1 = require("../validations/cart.validation");
const cart_controller_1 = require("../controllers/cart.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const authorize_middleware_1 = require("../middleware/authorize.middleware");
const router = express_1.default.Router();
router.post('/add', auth_middleware_1.authenticateToken, (0, authorize_middleware_1.authorizeRoles)('user'), (0, validate_middleware_1.validateRequest)(cart_validation_1.addToCartSchema), cart_controller_1.addToCart);
router.get('/', auth_middleware_1.authenticateToken, (0, authorize_middleware_1.authorizeRoles)('user'), cart_controller_1.getCart);
router.delete('/remove/:productId', auth_middleware_1.authenticateToken, (0, authorize_middleware_1.authorizeRoles)('user'), cart_controller_1.removeFromCart);
exports.default = router;
