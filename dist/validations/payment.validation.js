"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockPaymentSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.mockPaymentSchema = zod_1.default.object({
    amount: zod_1.default.number().positive(),
    method: zod_1.default.enum(['card', 'wallet', 'upi']),
});
