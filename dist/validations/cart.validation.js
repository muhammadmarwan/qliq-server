"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addToCartSchema = void 0;
const zod_1 = require("zod");
exports.addToCartSchema = zod_1.z.object({
    productId: zod_1.z.string().nonempty('Product ID is required'),
    quantity: zod_1.z.number().int().positive('Quantity must be a positive integer'),
});
