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
const authService = __importStar(require("../../services/auth.service"));
const User_1 = __importDefault(require("../../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("../../utils/jwt");
jest.mock('../../models/User');
jest.mock('bcryptjs');
jest.mock('../../utils/jwt');
describe('Auth Service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('registerUser', () => {
        it('should register user without referrer', async () => {
            User_1.default.findOne.mockResolvedValueOnce(null); // email check
            User_1.default.findOne.mockResolvedValueOnce(null); // referralCode unique
            bcryptjs_1.default.hash.mockResolvedValue('hashedpass');
            const newUserSaveMock = jest.fn().mockResolvedValue(true);
            User_1.default.mockImplementation(() => ({
                save: newUserSaveMock,
                _id: 'newid',
            }));
            const result = await authService.registerUser({
                name: 'Test',
                email: 'test@example.com',
                password: 'password123',
            });
            expect(User_1.default.findOne).toHaveBeenCalledTimes(2);
            expect(bcryptjs_1.default.hash).toHaveBeenCalledWith('password123', 10);
            expect(newUserSaveMock).toHaveBeenCalled();
            expect(result).toBeDefined();
        });
        it('should register user with valid referrer and distribute commission', async () => {
            const referrer = {
                _id: 'referrerid',
                level: 1,
                downlines: [],
                save: jest.fn().mockResolvedValue(true),
            };
            User_1.default.findOne
                .mockResolvedValueOnce(null) // email check
                .mockResolvedValueOnce(referrer) // referrer found
                .mockResolvedValueOnce(null); // referralCode unique
            bcryptjs_1.default.hash.mockResolvedValue('hashedpass');
            const newUserSaveMock = jest.fn().mockResolvedValue(true);
            User_1.default.mockImplementation(() => ({
                save: newUserSaveMock,
                _id: 'newid',
            }));
            User_1.default.findById
                .mockResolvedValueOnce(referrer) // 1st upline
                .mockResolvedValueOnce(null); // 2nd upline
            const result = await authService.registerUser({
                name: 'Test',
                email: 'test@example.com',
                password: 'password123',
                referalCode: 'ABC123',
            });
            expect(User_1.default.findOne).toHaveBeenCalledTimes(3);
            expect(referrer.save).toHaveBeenCalled();
            expect(result).toBeDefined();
        });
    });
    describe('loginUser', () => {
        it('should login user and return token', async () => {
            const user = {
                _id: 'userid',
                email: 'test@example.com',
                password: 'hashedpass',
            };
            User_1.default.findOne.mockResolvedValue(user);
            bcryptjs_1.default.compare.mockResolvedValue(true);
            jwt_1.signJwt.mockReturnValue('jwt-token');
            const result = await authService.loginUser('test@example.com', 'password');
            expect(User_1.default.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
            expect(bcryptjs_1.default.compare).toHaveBeenCalledWith('password', 'hashedpass');
            expect(jwt_1.signJwt).toHaveBeenCalledWith({ id: 'userid', email: 'test@example.com', role: 'user' });
            expect(result).toEqual({ token: 'jwt-token' });
        });
        it('should throw error for invalid credentials', async () => {
            User_1.default.findOne.mockResolvedValue(null);
            await expect(authService.loginUser('wrong@example.com', 'password'))
                .rejects
                .toThrow('Invalid email or password');
        });
        it('should throw error for wrong password', async () => {
            const user = {
                _id: 'userid',
                email: 'test@example.com',
                password: 'hashedpass',
            };
            User_1.default.findOne.mockResolvedValue(user);
            bcryptjs_1.default.compare.mockResolvedValue(false);
            await expect(authService.loginUser('test@example.com', 'wrongpass'))
                .rejects
                .toThrow('Invalid email or password');
        });
    });
});
