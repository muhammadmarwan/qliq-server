"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkout = checkout;
const axios_1 = __importDefault(require("axios"));
const Cart_1 = __importDefault(require("../models/Cart"));
const Order_1 = __importDefault(require("../models/Order"));
const User_1 = __importDefault(require("../models/User"));
async function checkout(userId, token) {
    const cart = await Cart_1.default.findOne({ user: userId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
        throw new Error('Cart is empty');
    }
    let total = 0;
    const orderItems = cart.items.map((item) => {
        const price = item.product.price;
        total += price * item.quantity;
        return {
            product: item.product._id,
            quantity: item.quantity,
            price,
        };
    });
    // Mock payment
    const PAYMENT_MOCK_API = process.env.PAYMENT_MOCK_API;
    const paymentResponse = await axios_1.default.post(PAYMENT_MOCK_API, {
        amount: total,
        method: 'card',
    }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const success = paymentResponse.data.success;
    const transactionId = paymentResponse.data.transactionId || 'N/A';
    const order = await Order_1.default.create({
        user: userId,
        items: orderItems,
        total,
        transactionId,
        paymentStatus: success ? 'paid' : 'failed',
    });
    if (success) {
        await Cart_1.default.findOneAndDelete({ user: userId });
        const user = await User_1.default.findById(userId);
        const commissionPerLevel = [0.1, 0.05, 0.02];
        let currentRef = user?.referrer;
        for (let level = 0; level < 3 && currentRef; level++) {
            const commission = total * commissionPerLevel[level];
            await User_1.default.findByIdAndUpdate(currentRef, {
                $inc: { commissionBalance: commission },
            });
            const refUser = await User_1.default.findById(currentRef);
            currentRef = refUser?.referrer;
        }
    }
    return order;
}
