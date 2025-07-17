"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProductSchema = void 0;
const zod_1 = require("zod");
exports.createProductSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Product name is required'),
    description: zod_1.z.string().optional(),
    price: zod_1.z.number().positive('Price must be greater than 0'),
    image: zod_1.z.string().url('Image must be a valid URL').optional(),
});
