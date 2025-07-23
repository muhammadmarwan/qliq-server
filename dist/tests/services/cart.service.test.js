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
const mongoose_1 = __importDefault(require("mongoose"));
const cartService = __importStar(require("../../services/cart.service"));
const Cart_1 = __importDefault(require("../../models/Cart"));
jest.mock('../../models/Cart');
describe('Cart Service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('getCartByUser', () => {
        it('should return populated cart', async () => {
            const userId = new mongoose_1.default.Types.ObjectId().toString();
            const mockCart = { user: userId, items: [] };
            const populateMock = jest.fn().mockReturnThis();
            const leanMock = jest.fn().mockResolvedValue(mockCart);
            Cart_1.default.findOne.mockReturnValue({
                populate: populateMock,
                lean: leanMock,
            });
            const result = await cartService.getCartByUser(userId);
            expect(Cart_1.default.findOne).toHaveBeenCalledWith({ user: userId });
            expect(populateMock).toHaveBeenCalledWith('items.product', 'name price image');
            expect(leanMock).toHaveBeenCalled();
            expect(result).toEqual(mockCart);
        });
    });
    describe('addToCart', () => {
        it('should create a new cart if none exists', async () => {
            const userId = new mongoose_1.default.Types.ObjectId().toString();
            const productId = new mongoose_1.default.Types.ObjectId().toString();
            const quantity = 2;
            Cart_1.default.findOne.mockResolvedValue(null);
            const mockNewCart = { user: userId, items: [{ product: productId, quantity }] };
            Cart_1.default.create.mockResolvedValue(mockNewCart);
            const result = await cartService.addToCart(userId, productId, quantity);
            expect(Cart_1.default.create).toHaveBeenCalledWith({
                user: userId,
                items: [{ product: expect.any(mongoose_1.default.Types.ObjectId), quantity }],
            });
            expect(result).toEqual(mockNewCart);
        });
        it('should update quantity if product exists in cart', async () => {
            const userId = new mongoose_1.default.Types.ObjectId().toString();
            const productId = new mongoose_1.default.Types.ObjectId().toString();
            const quantity = 1;
            const mockCart = {
                user: userId,
                items: [
                    { product: new mongoose_1.default.Types.ObjectId(productId), quantity: 1 },
                ],
                save: jest.fn().mockResolvedValue(true),
            };
            Cart_1.default.findOne.mockResolvedValue(mockCart);
            const result = await cartService.addToCart(userId, productId, quantity);
            expect(mockCart.save).toHaveBeenCalled();
            expect(result).toEqual(mockCart);
            expect(mockCart.items[0].quantity).toBe(2);
        });
        it('should add a new item if product not in cart', async () => {
            const userId = new mongoose_1.default.Types.ObjectId().toString();
            const productId = new mongoose_1.default.Types.ObjectId().toString();
            const quantity = 1;
            const mockCart = {
                user: userId,
                items: [],
                save: jest.fn().mockResolvedValue(true),
            };
            Cart_1.default.findOne.mockResolvedValue(mockCart);
            const result = await cartService.addToCart(userId, productId, quantity);
            expect(mockCart.items.length).toBe(1);
            expect(result).toEqual(mockCart);
        });
    });
    describe('removeFromCart', () => {
        it('should remove item from cart and return updated cart', async () => {
            const userId = new mongoose_1.default.Types.ObjectId().toString();
            const cartItemId = new mongoose_1.default.Types.ObjectId().toString();
            const populatedCart = {
                user: userId,
                items: [],
            };
            const populateMock = jest.fn().mockResolvedValue(populatedCart);
            Cart_1.default.findOneAndUpdate.mockReturnValue({
                populate: populateMock,
            });
            const result = await cartService.removeFromCart(userId, cartItemId);
            expect(Cart_1.default.findOneAndUpdate).toHaveBeenCalledWith({ user: expect.any(mongoose_1.default.Types.ObjectId) }, { $pull: { items: { _id: expect.any(mongoose_1.default.Types.ObjectId) } } }, { new: true });
            expect(populateMock).toHaveBeenCalledWith('items.product', 'name price');
            expect(result).toEqual(populatedCart);
        });
        it('should throw error if cart not found or item not in cart', async () => {
            const userId = new mongoose_1.default.Types.ObjectId().toString();
            const cartItemId = new mongoose_1.default.Types.ObjectId().toString();
            const populateMock = jest.fn().mockResolvedValue(null);
            Cart_1.default.findOneAndUpdate.mockReturnValue({
                populate: populateMock,
            });
            // Suppress console.error
            jest.spyOn(console, 'error').mockImplementation(() => { });
            await expect(cartService.removeFromCart(userId, cartItemId)).rejects.toThrow('Cart not found or item already removed');
        });
    });
});
