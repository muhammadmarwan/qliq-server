"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminDashboardStats = getAdminDashboardStats;
const User_1 = __importDefault(require("../models/User"));
const Order_1 = __importDefault(require("../models/Order"));
const Product_1 = __importDefault(require("../models/Product"));
async function getAdminDashboardStats() {
    try {
        const [totalUsers, totalOrders, totalProducts] = await Promise.all([
            User_1.default.countDocuments(),
            Order_1.default.countDocuments(),
            Product_1.default.countDocuments(),
        ]);
        const totalSalesAgg = await Order_1.default.aggregate([
            { $match: { paymentStatus: 'paid' } },
            { $group: { _id: null, total: { $sum: '$total' } } }
        ]);
        const totalCommissionAgg = await User_1.default.aggregate([
            { $group: { _id: null, total: { $sum: '$commissionBalance' } } }
        ]);
        const recentOrders = await Order_1.default.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('user', 'name email');
        const topUsersByOrders = await Order_1.default.aggregate([
            { $group: { _id: '$user', orderCount: { $sum: 1 }, totalSpent: { $sum: '$total' } } },
            { $sort: { orderCount: -1 } },
            { $limit: 5 },
        ]);
        return {
            totalUsers,
            totalOrders,
            totalProducts,
            totalSales: totalSalesAgg[0]?.total || 0,
            totalCommission: totalCommissionAgg[0]?.total || 0,
            recentOrders,
            topUsersByOrders,
        };
    }
    catch (error) {
        throw new Error('Failed to load admin stats: ' + error.message);
    }
}
