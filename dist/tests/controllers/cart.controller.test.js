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
const cart_controller_1 = require("../../controllers/cart.controller");
const cartService = __importStar(require("../../services/cart.service"));
const Product_1 = __importDefault(require("../../models/Product"));
jest.mock('../../services/cart.service');
jest.mock('../../models/Product');
describe('Cart Controller', () => {
    let mockRequest = {};
    let mockStatus;
    let mockJson;
    let mockResponse;
    beforeEach(() => {
        mockJson = jest.fn();
        mockStatus = jest.fn(() => ({ json: mockJson })); // ✅ connect mockJson here
        mockResponse = {
            status: mockStatus,
            json: mockJson,
        };
        jest.clearAllMocks();
    });
    describe('getCart', () => {
        it('should return cart if found', async () => {
            const cartData = { items: [{ product: 'abc', quantity: 2 }] };
            cartService.getCartByUser.mockResolvedValue(cartData);
            mockRequest = { user: { id: 'user123' } };
            await (0, cart_controller_1.getCart)(mockRequest, mockResponse);
            expect(cartService.getCartByUser).toHaveBeenCalledWith('user123');
            expect(mockJson).toHaveBeenCalledWith(cartData);
        });
        it('should return empty cart if not found', async () => {
            cartService.getCartByUser.mockResolvedValue(null);
            mockRequest = { user: { id: 'user123' } };
            await (0, cart_controller_1.getCart)(mockRequest, mockResponse);
            expect(mockJson).toHaveBeenCalledWith({ items: [] });
        });
        it('should handle errors', async () => {
            cartService.getCartByUser.mockRejectedValue(new Error('Failed'));
            mockRequest = { user: { id: 'user123' } };
            await (0, cart_controller_1.getCart)(mockRequest, mockResponse);
            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({ message: 'Failed' });
        });
    });
    describe('addToCart', () => {
        it('should add item to cart successfully', async () => {
            Product_1.default.exists.mockResolvedValue(true);
            const mockCart = { items: [{ product: 'prod123', quantity: 1 }] };
            cartService.addToCart.mockResolvedValue(mockCart);
            mockRequest = {
                user: { id: 'user123' },
                body: { productId: 'prod123', quantity: 1 },
            };
            await (0, cart_controller_1.addToCart)(mockRequest, mockResponse);
            expect(Product_1.default.exists).toHaveBeenCalledWith({ _id: 'prod123' });
            expect(cartService.addToCart).toHaveBeenCalledWith('user123', 'prod123', 1);
            expect(mockStatus).toHaveBeenCalledWith(201);
            expect(mockJson).toHaveBeenCalledWith(mockCart);
        });
        it('should return 400 if productId or quantity invalid', async () => {
            mockRequest = {
                user: { id: 'user123' },
                body: { productId: '', quantity: 0 },
            };
            await (0, cart_controller_1.addToCart)(mockRequest, mockResponse);
            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({ message: 'Invalid product or quantity' });
        });
        it('should return 404 if product does not exist', async () => {
            Product_1.default.exists.mockResolvedValue(false);
            mockRequest = {
                user: { id: 'user123' },
                body: { productId: 'prod123', quantity: 1 },
            };
            await (0, cart_controller_1.addToCart)(mockRequest, mockResponse);
            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({ message: 'Product not found' });
        });
        it('should handle addToCart error', async () => {
            Product_1.default.exists.mockResolvedValue(true);
            cartService.addToCart.mockRejectedValue(new Error('Add failed'));
            mockRequest = {
                user: { id: 'user123' },
                body: { productId: 'prod123', quantity: 1 },
            };
            await (0, cart_controller_1.addToCart)(mockRequest, mockResponse);
            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({ message: 'Add failed' });
        });
    });
    describe('removeFromCart', () => {
        it('should remove item from cart successfully', async () => {
            const updatedCart = { items: [] };
            cartService.removeFromCart.mockResolvedValue(updatedCart);
            mockRequest = {
                user: { id: 'user123' },
                params: { productId: 'prod123' },
            };
            await (0, cart_controller_1.removeFromCart)(mockRequest, mockResponse);
            expect(cartService.removeFromCart).toHaveBeenCalledWith('user123', 'prod123');
            expect(mockJson).toHaveBeenCalledWith(updatedCart);
        });
        it('should return 400 if productId missing', async () => {
            mockRequest = {
                user: { id: 'user123' },
                params: {},
            };
            await (0, cart_controller_1.removeFromCart)(mockRequest, mockResponse);
            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({ message: 'Product ID is required' });
        });
        it('should handle removeFromCart error', async () => {
            cartService.removeFromCart.mockRejectedValue(new Error('Remove failed'));
            mockRequest = {
                user: { id: 'user123' },
                params: { productId: 'prod123' },
            };
            await (0, cart_controller_1.removeFromCart)(mockRequest, mockResponse);
            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({ message: 'Remove failed' });
        });
    });
});
