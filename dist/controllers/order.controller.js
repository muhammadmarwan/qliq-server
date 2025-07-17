"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrdersPaginated = getOrdersPaginated;
exports.getOrdersList = getOrdersList;
const order_service_1 = require("../services/order.service");
async function getOrdersPaginated(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const { orders, total } = await (0, order_service_1.getPaginatedOrders)(page, limit);
        res.json({
            data: orders,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        });
    }
    catch (error) {
        console.error('Error fetching paginated orders:', error);
        res.status(500).json({ message: error.message || 'Failed to fetch orders' });
    }
}
async function getOrdersList(req, res) {
    try {
        const userId = req.user.id;
        const orders = await (0, order_service_1.getAllOrders)(userId);
        res.json(orders);
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Failed to fetch orders' });
    }
}
