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
const axios_1 = __importDefault(require("axios"));
const checkoutService = __importStar(require("../../services/checkout.service"));
const Cart_1 = __importDefault(require("../../models/Cart"));
const Order_1 = __importDefault(require("../../models/Order"));
const User_1 = __importDefault(require("../../models/User"));
jest.mock('axios');
jest.mock('../../models/Cart');
jest.mock('../../models/Order');
jest.mock('../../models/User');
describe('checkout service', () => {
    const userId = 'user123';
    const token = 'test-token';
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should throw error if cart is empty', async () => {
        const mockPopulate = jest.fn().mockResolvedValue(null);
        Cart_1.default.findOne.mockReturnValue({ populate: mockPopulate });
        await expect(checkoutService.checkout(userId, token)).rejects.toThrow('Cart is empty');
    });
    it('should process checkout and distribute commission on success', async () => {
        const mockCart = {
            items: [
                {
                    product: { _id: 'prod1', price: 100 },
                    quantity: 2,
                },
            ],
        };
        const mockUser = {
            _id: userId,
            referrer: 'ref1',
        };
        const mockRef1 = {
            _id: 'ref1',
            referrer: 'ref2',
        };
        const mockRef2 = {
            _id: 'ref2',
            referrer: 'ref3',
        };
        const mockRef3 = {
            _id: 'ref3',
            referrer: null,
        };
        const mockPopulate = jest.fn().mockResolvedValue(mockCart);
        Cart_1.default.findOne.mockReturnValue({ populate: mockPopulate });
        axios_1.default.post.mockResolvedValue({
            data: {
                success: true,
                transactionId: 'txn-123',
            },
        });
        Order_1.default.create.mockResolvedValue({ id: 'order1' });
        User_1.default.findById
            .mockResolvedValueOnce(mockUser)
            .mockResolvedValueOnce(mockRef1)
            .mockResolvedValueOnce(mockRef2)
            .mockResolvedValueOnce(mockRef3);
        User_1.default.findByIdAndUpdate.mockResolvedValue({});
        Cart_1.default.findOneAndDelete.mockResolvedValue(true);
        const order = await checkoutService.checkout(userId, token);
        expect(Cart_1.default.findOne).toHaveBeenCalledWith({ user: userId });
        expect(axios_1.default.post).toHaveBeenCalled();
        expect(Order_1.default.create).toHaveBeenCalled();
        expect(Cart_1.default.findOneAndDelete).toHaveBeenCalledWith({ user: userId });
        expect(User_1.default.findByIdAndUpdate).toHaveBeenCalledTimes(3);
        expect(order).toEqual({ id: 'order1' });
    });
});
