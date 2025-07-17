"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = authenticateToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const Admin_1 = __importDefault(require("../models/Admin"));
async function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Missing or invalid token' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (decoded.role === 'user') {
            const user = await User_1.default.findById(decoded.id);
            if (!user)
                return res.status(401).json({ message: 'User not found' });
            req.user = user;
        }
        else if (decoded.role === 'admin') {
            const admin = await Admin_1.default.findById(decoded.id);
            if (!admin)
                return res.status(401).json({ message: 'Admin not found' });
            req.admin = admin;
        }
        else {
            return res.status(403).json({ message: 'Invalid role' });
        }
        next();
    }
    catch {
        return res.status(401).json({ message: 'Invalid token' });
    }
}
