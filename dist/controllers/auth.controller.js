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
exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.registerAdmin = registerAdmin;
exports.loginAdmin = loginAdmin;
const authService = __importStar(require("../services/auth.service"));
async function registerUser(req, res) {
    try {
        const newUser = await authService.registerUser(req.body);
        res.status(201).json({ message: 'User registered successfully', userId: newUser._id });
    }
    catch (error) {
        res.status(400).json({ message: error.message || 'Registration failed' });
    }
}
async function loginUser(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ message: 'Email and password required' });
        const { token } = await authService.loginUser(email, password);
        res.json({ token });
    }
    catch (error) {
        res.status(400).json({ message: error.message || 'Login failed' });
    }
}
async function registerAdmin(req, res) {
    try {
        const { name, email, password } = req.body;
        const admin = await authService.registerAdmin(name, email, password);
        res.status(201).json({ message: 'Admin created successfully', id: admin._id });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}
async function loginAdmin(req, res) {
    try {
        const { email, password } = req.body;
        const { token, admin } = await authService.loginAdmin(email, password);
        res.json({ token, admin });
    }
    catch (error) {
        res.status(401).json({ message: error.message });
    }
}
