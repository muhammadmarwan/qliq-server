"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const payment_controller_1 = require("../controllers/payment.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const payment_validation_1 = require("../validations/payment.validation");
const router = express_1.default.Router();
router.post('/mock', auth_middleware_1.authenticateToken, (0, validate_middleware_1.validateRequest)(payment_validation_1.mockPaymentSchema), payment_controller_1.simulatePayment);
exports.default = router;
