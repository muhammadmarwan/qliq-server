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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaginatedProducts = getPaginatedProducts;
exports.getProducts = getProducts;
exports.createProduct = createProduct;
exports.updateProducts = updateProducts;
exports.getAIRecommendations = getAIRecommendations;
const productService = __importStar(require("../services/product.service"));
const recommendationService = __importStar(require("../services/recommendation.service"));
async function getPaginatedProducts(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const { products, total } = await productService.getPaginatedProducts(page, limit);
        res.json({ data: products, total });
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Failed to fetch products' });
    }
}
async function getProducts(req, res) {
    try {
        const userId = req.user.id;
        const products = await productService.getProducts(userId);
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Failed to fetch products' });
    }
}
async function createProduct(req, res) {
    try {
        const { name, description, price, image } = req.body;
        if (!name || !price) {
            return res.status(400).json({ message: 'Name and price are required' });
        }
        const product = await productService.createProduct({ name, description, price, image });
        res.status(201).json(product);
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Failed to create product' });
    }
}
async function updateProducts(req, res) {
    try {
        const { productId } = req.params;
        const updatedProducts = await productService.updateProducts(productId, req.body);
        res.json(updatedProducts);
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Failed to update products' });
    }
}
async function getAIRecommendations(req, res) {
    try {
        const userId = req.user.id;
        const products = await recommendationService.getSmartRecommendations(userId);
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Failed to get recommendations' });
    }
}
