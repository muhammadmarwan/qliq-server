"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCart = getCart;
exports.addToCart = addToCart;
exports.removeFromCart = removeFromCart;
const cartService = __importStar(require("../services/cart.service"));
const Product_1 = __importDefault(require("../models/Product"));
async function getCart(req, res) {
    try {
        const userId = req.user.id;
        const cart = await cartService.getCartByUser(userId);
        res.json(cart || { items: [] });
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Failed to get cart' });
    }
}
async function addToCart(req, res) {
    try {
        const userId = req.user.id;
        const { productId, quantity } = req.body;
        if (!productId || !quantity || quantity < 1) {
            return res.status(400).json({ message: 'Invalid product or quantity' });
        }
        // Check if product exists
        const productExists = await Product_1.default.exists({ _id: productId });
        if (!productExists) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const cart = await cartService.addToCart(userId, productId, quantity);
        res.status(201).json(cart);
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Failed to add to cart' });
    }
}
async function removeFromCart(req, res) {
    try {
        console.log(req.params);
        const userId = req.user.id;
        const { productId } = req.params;
        if (!productId)
            return res.status(400).json({ message: 'Product ID is required' });
        const updatedCart = await cartService.removeFromCart(userId, productId);
        res.json(updatedCart);
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Failed to remove item from cart' });
    }
}
