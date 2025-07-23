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
const orderService = __importStar(require("../../services/order.service"));
const Order_1 = __importDefault(require("../../models/Order"));
jest.mock('../../models/Order');
describe('Order Service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('getAllOrders', () => {
        it('should return all orders for a user with populated products', async () => {
            const userId = 'user123';
            const mockOrders = [
                {
                    _id: 'order1',
                    items: [
                        { product: { name: 'Product 1', image: 'img1.jpg', price: 10 } },
                    ],
                },
            ];
            // Chain mocks for find().sort().populate().lean()
            const mockLean = jest.fn().mockResolvedValue(mockOrders);
            const mockPopulate = jest.fn(() => ({ lean: mockLean }));
            const mockSort = jest.fn(() => ({ populate: mockPopulate }));
            Order_1.default.find.mockReturnValue({ sort: mockSort });
            const result = await orderService.getAllOrders(userId);
            expect(Order_1.default.find).toHaveBeenCalledWith({ user: userId });
            expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
            expect(mockPopulate).toHaveBeenCalledWith('items.product', 'name image price');
            expect(mockLean).toHaveBeenCalled();
            expect(result).toEqual(mockOrders);
        });
    });
});
