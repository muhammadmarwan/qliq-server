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
const checkout_controller_1 = require("../../controllers/checkout.controller");
const checkoutService = __importStar(require("../../services/checkout.service"));
jest.mock('../../services/checkout.service');
describe('Checkout Controller', () => {
    let mockRequest;
    let mockResponse;
    let mockStatus;
    let mockJson;
    beforeEach(() => {
        mockJson = jest.fn();
        mockStatus = jest.fn(() => ({ json: mockJson }));
        mockResponse = {
            status: mockStatus,
            json: mockJson,
        };
        jest.clearAllMocks();
    });
    it('should perform checkout and return order', async () => {
        const mockOrder = { id: 'order123', total: 99 };
        checkoutService.checkout.mockResolvedValue(mockOrder);
        mockRequest = {
            headers: { authorization: 'Bearer test-token' },
            user: { id: 'user123' },
        };
        await (0, checkout_controller_1.checkout)(mockRequest, mockResponse);
        expect(checkoutService.checkout).toHaveBeenCalledWith('user123', 'test-token');
        expect(mockStatus).toHaveBeenCalledWith(201);
        expect(mockJson).toHaveBeenCalledWith({
            message: 'Checkout successful',
            order: mockOrder,
        });
    });
    it('should return 400 if checkout service fails', async () => {
        checkoutService.checkout.mockRejectedValue(new Error('Something went wrong'));
        mockRequest = {
            headers: { authorization: 'Bearer token123' },
            user: { id: 'user123' },
        };
        await (0, checkout_controller_1.checkout)(mockRequest, mockResponse);
        expect(mockStatus).toHaveBeenCalledWith(400);
        expect(mockJson).toHaveBeenCalledWith({ message: 'Something went wrong' });
    });
    it('should handle missing token gracefully', async () => {
        const mockOrder = { id: 'order456', total: 45 };
        checkoutService.checkout.mockResolvedValue(mockOrder);
        mockRequest = {
            headers: {},
            user: { id: 'user456' },
        };
        await (0, checkout_controller_1.checkout)(mockRequest, mockResponse);
        expect(checkoutService.checkout).toHaveBeenCalledWith('user456', '');
        expect(mockStatus).toHaveBeenCalledWith(201);
        expect(mockJson).toHaveBeenCalledWith({
            message: 'Checkout successful',
            order: mockOrder,
        });
    });
});
