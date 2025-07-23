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
const auth_controller_1 = require("../../controllers/auth.controller");
const authService = __importStar(require("../../services/auth.service"));
describe('Auth Controller', () => {
    let mockRequest = {};
    let mockJson;
    let mockStatus;
    let mockResponse;
    beforeEach(() => {
        mockJson = jest.fn();
        mockStatus = jest.fn(() => ({ json: mockJson }));
        mockResponse = {
            status: mockStatus,
            json: mockJson
        };
        jest.clearAllMocks();
    });
    describe('registerUser', () => {
        it('should register user and return 201', async () => {
            const mockUser = { _id: 'user123' };
            jest.spyOn(authService, 'registerUser').mockResolvedValue(mockUser);
            mockRequest = { body: { email: 'test@mail.com', password: '123456' } };
            await (0, auth_controller_1.registerUser)(mockRequest, mockResponse);
            expect(authService.registerUser).toHaveBeenCalledWith(mockRequest.body);
            expect(mockStatus).toHaveBeenCalledWith(201);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'User registered successfully',
                userId: mockUser._id
            });
        });
        it('should return 400 on error', async () => {
            jest.spyOn(authService, 'registerUser').mockRejectedValue(new Error('Failed'));
            mockRequest = { body: {} };
            await (0, auth_controller_1.registerUser)(mockRequest, mockResponse);
            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({ message: 'Failed' });
        });
    });
    describe('loginUser', () => {
        it('should login and return token', async () => {
            jest.spyOn(authService, 'loginUser').mockResolvedValue({ token: 'abc123' });
            mockRequest = { body: { email: 'test@mail.com', password: 'pass' } };
            await (0, auth_controller_1.loginUser)(mockRequest, mockResponse);
            expect(authService.loginUser).toHaveBeenCalledWith('test@mail.com', 'pass');
            expect(mockJson).toHaveBeenCalledWith({ token: 'abc123' });
        });
        it('should return 400 if email or password missing', async () => {
            mockRequest = { body: { email: '' } };
            await (0, auth_controller_1.loginUser)(mockRequest, mockResponse);
            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({ message: 'Email and password required' });
        });
        it('should return 400 on login error', async () => {
            jest.spyOn(authService, 'loginUser').mockRejectedValue(new Error('Invalid credentials'));
            mockRequest = { body: { email: 'test@mail.com', password: 'wrong' } };
            await (0, auth_controller_1.loginUser)(mockRequest, mockResponse);
            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({ message: 'Invalid credentials' });
        });
    });
    describe('registerAdmin', () => {
        it('should create admin and return 201', async () => {
            const admin = { _id: 'admin123' };
            jest.spyOn(authService, 'registerAdmin').mockResolvedValue(admin);
            mockRequest = { body: { name: 'Admin', email: 'admin@mail.com', password: 'admin123' } };
            await (0, auth_controller_1.registerAdmin)(mockRequest, mockResponse);
            expect(authService.registerAdmin).toHaveBeenCalledWith('Admin', 'admin@mail.com', 'admin123');
            expect(mockStatus).toHaveBeenCalledWith(201);
            expect(mockJson).toHaveBeenCalledWith({ message: 'Admin created successfully', id: admin._id });
        });
        it('should return 400 on error', async () => {
            jest.spyOn(authService, 'registerAdmin').mockRejectedValue(new Error('Create failed'));
            mockRequest = { body: {} };
            await (0, auth_controller_1.registerAdmin)(mockRequest, mockResponse);
            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({ message: 'Create failed' });
        });
    });
    describe('loginAdmin', () => {
        it('should login admin and return token and admin object', async () => {
            const result = {
                token: 'admin-token',
                admin: { _id: 'admin1', name: 'Admin' }
            };
            jest.spyOn(authService, 'loginAdmin').mockResolvedValue(result);
            mockRequest = { body: { email: 'admin@mail.com', password: 'admin123' } };
            await (0, auth_controller_1.loginAdmin)(mockRequest, mockResponse);
            expect(authService.loginAdmin).toHaveBeenCalledWith('admin@mail.com', 'admin123');
            expect(mockJson).toHaveBeenCalledWith(result);
        });
        it('should return 401 on login error', async () => {
            jest.spyOn(authService, 'loginAdmin').mockRejectedValue(new Error('Unauthorized'));
            mockRequest = { body: { email: 'admin@mail.com', password: 'wrong' } };
            await (0, auth_controller_1.loginAdmin)(mockRequest, mockResponse);
            expect(mockStatus).toHaveBeenCalledWith(401);
            expect(mockJson).toHaveBeenCalledWith({ message: 'Unauthorized' });
        });
    });
});
