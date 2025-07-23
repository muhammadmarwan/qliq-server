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
const admin_controller_1 = require("../../controllers/admin.controller");
const adminService = __importStar(require("../../services/admin.service"));
describe('Admin Controller - getDashboardStats', () => {
    const mockRequest = {};
    let mockJson;
    let mockStatus;
    let mockResponse;
    beforeEach(() => {
        mockJson = jest.fn();
        mockStatus = jest.fn(() => ({ json: mockJson }));
        mockResponse = {
            json: mockJson,
            status: mockStatus,
        };
        jest.clearAllMocks();
    });
    it('should return dashboard stats on success', async () => {
        const fakeStats = {
            totalUsers: 100,
            totalOrders: 200,
            totalRevenue: 5000,
        };
        jest.spyOn(adminService, 'getAdminDashboardStats').mockResolvedValue(fakeStats);
        await (0, admin_controller_1.getDashoardStats)(mockRequest, mockResponse);
        expect(adminService.getAdminDashboardStats).toHaveBeenCalledTimes(1);
        expect(mockJson).toHaveBeenCalledWith(fakeStats);
    });
    it('should return error response on failure', async () => {
        const fakeError = new Error('Something went wrong');
        jest.spyOn(adminService, 'getAdminDashboardStats').mockRejectedValue(fakeError);
        await (0, admin_controller_1.getDashoardStats)(mockRequest, mockResponse);
        expect(adminService.getAdminDashboardStats).toHaveBeenCalledTimes(1);
        expect(mockStatus).toHaveBeenCalledWith(400);
        expect(mockJson).toHaveBeenCalledWith({ message: 'Something went wrong' });
    });
});
