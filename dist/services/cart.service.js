"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCartByUser = getCartByUser;
exports.addToCart = addToCart;
exports.removeFromCart = removeFromCart;
const Cart_1 = __importDefault(require("../models/Cart"));
const mongoose_1 = __importDefault(require("mongoose"));
async function getCartByUser(userId) {
    return Cart_1.default.findOne({ user: userId })
        .populate('items.product', 'name price image')
        .lean();
}
async function addToCart(userId, productId, quantity) {
    const cart = await Cart_1.default.findOne({ user: userId });
    const productObjectId = new mongoose_1.default.Types.ObjectId(productId);
    if (!cart) {
        const newCart = await Cart_1.default.create({
            user: userId,
            items: [{ product: productObjectId, quantity }],
        });
        return newCart;
    }
    const itemIndex = cart.items.findIndex((item) => item.product.toString() === productObjectId.toString());
    if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
    }
    else {
        cart.items.push({ product: productObjectId, quantity });
    }
    await cart.save();
    return cart;
}
async function removeFromCart(userId, cartItemId) {
    try {
        const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
        const cartItemObjectId = new mongoose_1.default.Types.ObjectId(cartItemId);
        const updatedCart = await Cart_1.default.findOneAndUpdate({ user: userObjectId }, { $pull: { items: { _id: cartItemObjectId } } }, { new: true }).populate('items.product', 'name price');
        if (!updatedCart) {
            throw new Error('Cart not found or item already removed');
        }
        return updatedCart;
    }
    catch (error) {
        console.error('Error removing from cart:', error);
        throw error;
    }
}
