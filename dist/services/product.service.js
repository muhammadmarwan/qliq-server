"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaginatedProducts = getPaginatedProducts;
exports.createProduct = createProduct;
exports.getProducts = getProducts;
exports.updateProducts = updateProducts;
const mongoose_1 = __importDefault(require("mongoose"));
const Cart_1 = __importDefault(require("../models/Cart"));
const Product_1 = __importDefault(require("../models/Product"));
async function getPaginatedProducts(page, limit) {
    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
        Product_1.default.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        Product_1.default.countDocuments()
    ]);
    return { products, total };
}
async function createProduct(data) {
    const product = new Product_1.default(data);
    return await product.save();
}
async function getProducts(userId) {
    const [products, cart] = await Promise.all([
        Product_1.default.find().sort({ createdAt: -1 }).lean(),
        Cart_1.default.findOne({ user: new mongoose_1.default.Types.ObjectId(userId) }).lean()
    ]);
    const cartMap = new Map();
    if (cart && cart.items) {
        cart.items.forEach(item => {
            cartMap.set(item.product.toString(), item.quantity);
        });
    }
    const getProducts = products.map(product => ({
        ...product,
        cart: cartMap.get(product._id.toString()) || 0
    }));
    return getProducts;
}
async function updateProducts(productId, products) {
    const product = await Product_1.default.findById(productId);
    if (!product)
        throw new Error('Product not found');
    const productIds = product._id;
    const updatedProducts = await Product_1.default.updateMany({ _id: { $in: productIds } }, {
        $set: {
            name: products.name,
            description: products.description,
            price: products.price,
            image: products.image,
        },
    });
    return updatedProducts;
}
