"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_controller_1 = require("../controllers/product.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const authorize_middleware_1 = require("../middleware/authorize.middleware");
const router = express_1.default.Router();
router.get('/', auth_middleware_1.authenticateToken, (0, authorize_middleware_1.authorizeRoles)('admin'), product_controller_1.getPaginatedProducts);
router.get('/products-list', auth_middleware_1.authenticateToken, (0, authorize_middleware_1.authorizeRoles)('user'), product_controller_1.getProducts);
router.post('/', auth_middleware_1.authenticateToken, (0, authorize_middleware_1.authorizeRoles)('admin'), product_controller_1.createProduct);
router.put('/:productId', auth_middleware_1.authenticateToken, (0, authorize_middleware_1.authorizeRoles)('admin'), product_controller_1.updateProducts);
router.get('/recommendations-ai', auth_middleware_1.authenticateToken, (0, authorize_middleware_1.authorizeRoles)('user'), product_controller_1.getAIRecommendations);
exports.default = router;
