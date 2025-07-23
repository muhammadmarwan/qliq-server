"use strict";
// tests/services/adminDashboard.service.test.ts
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
const adminService = __importStar(require("../../services/admin.service"));
const User_1 = __importDefault(require("../../models/User"));
const Order_1 = __importDefault(require("../../models/Order"));
const Product_1 = __importDefault(require("../../models/Product"));
jest.mock('../../models/User');
jest.mock('../../models/Order');
jest.mock('../../models/Product');
describe('Admin Dashboard Service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('getAdminDashboardStats', () => {
        it('should return aggregated admin stats', async () => {
            // Mock countDocuments
            User_1.default.countDocuments.mockResolvedValue(100);
            Order_1.default.countDocuments.mockResolvedValue(50);
            Product_1.default.countDocuments.mockResolvedValue(200);
            // Mock aggregate for totalSalesAgg
            Order_1.default.aggregate.mockImplementationOnce(() => Promise.resolve([{ total: 12345 }]));
            // Mock aggregate for totalCommissionAgg
            User_1.default.aggregate.mockImplementationOnce(() => Promise.resolve([{ total: 6789 }]));
            // Mock recentOrders query with chaining
            const mockPopulate = jest.fn().mockResolvedValue([
                { _id: 'order1', user: { name: 'User1', email: 'user1@example.com' } },
                { _id: 'order2', user: { name: 'User2', email: 'user2@example.com' } },
            ]);
            const mockLimit = jest.fn(() => ({ populate: mockPopulate }));
            const mockSort = jest.fn(() => ({ limit: mockLimit }));
            Order_1.default.find.mockReturnValue({ sort: mockSort });
            // Mock aggregate for topUsersByOrders
            Order_1.default.aggregate.mockImplementationOnce(() => Promise.resolve([
                { _id: 'user1', orderCount: 10, totalSpent: 5000 },
                { _id: 'user2', orderCount: 8, totalSpent: 4000 },
            ]));
            const result = await adminService.getAdminDashboardStats();
            expect(User_1.default.countDocuments).toHaveBeenCalled();
            expect(Order_1.default.countDocuments).toHaveBeenCalled();
            expect(Product_1.default.countDocuments).toHaveBeenCalled();
            expect(Order_1.default.aggregate).toHaveBeenCalledTimes(2);
            expect(User_1.default.aggregate).toHaveBeenCalledTimes(1);
            expect(Order_1.default.find).toHaveBeenCalled();
            expect(result).toEqual({
                totalUsers: 100,
                totalOrders: 50,
                totalProducts: 200,
                totalSales: 12345,
                totalCommission: 6789,
                recentOrders: [
                    { _id: 'order1', user: { name: 'User1', email: 'user1@example.com' } },
                    { _id: 'order2', user: { name: 'User2', email: 'user2@example.com' } },
                ],
                topUsersByOrders: [
                    { _id: 'user1', orderCount: 10, totalSpent: 5000 },
                    { _id: 'user2', orderCount: 8, totalSpent: 4000 },
                ],
            });
        });
        it('should throw an error if something goes wrong', async () => {
            User_1.default.countDocuments.mockRejectedValue(new Error('DB error'));
            await expect(adminService.getAdminDashboardStats()).rejects.toThrow('Failed to load admin stats: DB error');
        });
    });
});
