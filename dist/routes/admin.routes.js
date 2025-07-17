"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const authorize_middleware_1 = require("../middleware/authorize.middleware");
const admin_controller_1 = require("../controllers/admin.controller");
const router = express_1.default.Router();
router.get('/dashboard/stats', auth_middleware_1.authenticateToken, (0, authorize_middleware_1.authorizeRoles)('admin'), admin_controller_1.getDashoardStats);
exports.default = router;
