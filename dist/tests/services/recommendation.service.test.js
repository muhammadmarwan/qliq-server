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
// src/tests/services/recommendation.service.test.ts
const openai_1 = require("openai");
const recommendationService = __importStar(require("../../services/recommendation.service"));
const Order_1 = __importDefault(require("../../models/Order"));
const Product_1 = __importDefault(require("../../models/Product"));
// Mock OpenAI with a shared create mock function
jest.mock('openai', () => {
    const createMock = jest.fn();
    return {
        OpenAI: jest.fn().mockImplementation(() => ({
            chat: {
                completions: {
                    create: createMock,
                },
            },
            // expose createMock so tests can access it
            __createMock: createMock,
        })),
    };
});
jest.mock('../../models/Order');
jest.mock('../../models/Product');
describe('recommendation service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('generateProductRecommendations', () => {
        it('should return parsed recommended product names from OpenAI', async () => {
            const openaiInstance = new openai_1.OpenAI();
            const mockCreate = openaiInstance.__createMock;
            mockCreate.mockResolvedValue({
                choices: [
                    {
                        message: {
                            content: '["Product C", "Product D", "Product E"]',
                        },
                    },
                ],
            });
            const purchases = [
                { name: 'Product A', description: 'Desc A', price: 10 },
            ];
            const catalog = [
                { name: 'Product B', description: 'Desc B', price: 20 },
            ];
            const recommended = await recommendationService.generateProductRecommendations(purchases, catalog);
            expect(Array.isArray(recommended)).toBe(true);
            expect(recommended).toEqual(['Product C', 'Product D', 'Product E']);
        });
        it('should return empty array on OpenAI error', async () => {
            const openaiInstance = new openai_1.OpenAI();
            const mockCreate = openaiInstance.__createMock;
            mockCreate.mockRejectedValue(new Error('Failed'));
            // Silence console.error to keep test output clean
            const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => { });
            const recommended = await recommendationService.generateProductRecommendations([], []);
            expect(recommended).toEqual([]);
            consoleErrorMock.mockRestore();
        });
    });
    describe('getSmartRecommendations', () => {
        it('should return recommended product docs', async () => {
            const userId = 'user123';
            const mockOrders = [
                {
                    items: [
                        {
                            product: { name: 'Prod1', description: 'Desc1', price: 10, _id: 'p1' },
                            quantity: 1,
                        },
                    ],
                },
            ];
            const mockFullCatalog = [
                { name: 'Prod1', description: 'Desc1', price: 10 },
                { name: 'Prod2', description: 'Desc2', price: 20 },
                { name: 'Prod3', description: 'Desc3', price: 30 },
                { name: 'Prod4', description: 'Desc4', price: 40 },
            ];
            const mockRecommendedNames = ['Prod3', 'Prod4'];
            // Mock Order.find().populate()
            Order_1.default.find.mockReturnValue({
                populate: jest.fn().mockResolvedValue(mockOrders),
            });
            // Mock Product.find() twice: first full catalog, then filtered recommended
            Product_1.default.find
                .mockResolvedValueOnce(mockFullCatalog) // full catalog
                .mockResolvedValueOnce(mockFullCatalog.filter(p => mockRecommendedNames.includes(p.name))); // filtered recommended
            const openaiInstance = new openai_1.OpenAI();
            const mockCreate = openaiInstance.__createMock;
            mockCreate.mockResolvedValue({
                choices: [
                    {
                        message: {
                            content: JSON.stringify(mockRecommendedNames),
                        },
                    },
                ],
            });
            const results = await recommendationService.getSmartRecommendations(userId);
            expect(Order_1.default.find).toHaveBeenCalledWith({ user: userId });
            expect(Product_1.default.find).toHaveBeenCalledTimes(2);
            expect(results).toEqual(mockFullCatalog.filter(p => mockRecommendedNames.includes(p.name)));
        });
    });
});
