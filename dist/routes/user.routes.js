"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const authorize_middleware_1 = require("../middleware/authorize.middleware");
const router = express_1.default.Router();
router.get('/me', auth_middleware_1.authenticateToken, (0, authorize_middleware_1.authorizeRoles)('user'), user_controller_1.getUserDetails);
router.get('/mlm-tree-user', auth_middleware_1.authenticateToken, (0, authorize_middleware_1.authorizeRoles)('user'), user_controller_1.getMLMUserTree);
router.get('/mlm-tree', auth_middleware_1.authenticateToken, (0, authorize_middleware_1.authorizeRoles)('admin'), user_controller_1.getMLMTree);
exports.default = router;
