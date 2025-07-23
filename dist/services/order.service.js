"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaginatedOrders = getPaginatedOrders;
exports.getAllOrders = getAllOrders;
const Order_1 = __importDefault(require("../models/Order"));
async function getPaginatedOrders(page, limit) {
    const skip = (page - 1) * limit;
    const total = await Order_1.default.countDocuments();
    const orders = await Order_1.default.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    return { orders, total };
}
async function getAllOrders(userId) {
    const orders = await Order_1.default.find({ user: userId })
        .sort({ createdAt: -1 })
        .populate('items.product', 'name image price')
        .lean();
    return orders;
}
