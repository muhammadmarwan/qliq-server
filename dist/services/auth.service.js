"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.registerAdmin = registerAdmin;
exports.loginAdmin = loginAdmin;
const Admin_1 = __importDefault(require("../models/Admin"));
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("../utils/jwt");
const socket_1 = require("../socket");
function generateReferralCode(length = 6) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}
async function registerUser(data) {
    const { name, email, password, referalCode } = data;
    const existingUser = await User_1.default.findOne({ email });
    if (existingUser)
        throw new Error('Email already in use');
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    let referrer = null;
    let level = 0;
    if (referalCode) {
        referrer = await User_1.default.findOne({ referralCode: `${referalCode}` });
        if (!referrer)
            throw new Error("Referrer Code not found");
        level = Math.min(referrer.level + 1, 3);
    }
    let newReferralCode = generateReferralCode();
    while (await User_1.default.findOne({ referralCode: newReferralCode })) {
        newReferralCode = generateReferralCode();
    }
    const newUser = new User_1.default({
        name,
        email,
        password: hashedPassword,
        referralCode: newReferralCode,
        referrer: referrer ? referrer._id : null,
        level,
        downlines: [],
    });
    await newUser.save();
    if (referrer && referrer.downlines.length < 3) {
        referrer.downlines.push(newUser._id);
        await referrer.save();
    }
    // Commission distribution
    const commissionRates = [0.1, 0.05, 0.02];
    let currentReferrerId = referrer?._id || null;
    for (let i = 0; i < 3 && currentReferrerId; i++) {
        const uplineUser = await User_1.default.findById(currentReferrerId);
        if (!uplineUser)
            break;
        const commissionAmount = 100 * commissionRates[i];
        uplineUser.commissionBalance = (uplineUser.commissionBalance || 0) + commissionAmount;
        await uplineUser.save();
        currentReferrerId = uplineUser.referrer;
    }
    // Emit update to socket
    try {
        const io = (0, socket_1.getIO)();
        io.emit('userTreeUpdated');
    }
    catch (error) {
        console.warn('Socket emit failed', error);
    }
    return newUser;
}
async function loginUser(email, password) {
    const user = await User_1.default.findOne({ email });
    if (!user)
        throw new Error('Invalid email or password');
    const isMatch = await bcryptjs_1.default.compare(password, user.password);
    if (!isMatch)
        throw new Error('Invalid email or password');
    const token = (0, jwt_1.signJwt)({ id: user._id, email: user.email, role: 'user' });
    return { token };
}
async function registerAdmin(name, email, password) {
    const existing = await Admin_1.default.findOne({ email });
    if (existing)
        throw new Error('Admin already exists');
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    const admin = await Admin_1.default.create({ name, email, password: hashedPassword });
    return admin;
}
async function loginAdmin(email, password) {
    const admin = await Admin_1.default.findOne({ email });
    if (!admin)
        throw new Error('Invalid credentials');
    const isMatch = await bcryptjs_1.default.compare(password, admin.password);
    if (!isMatch)
        throw new Error('Invalid credentials');
    const token = (0, jwt_1.signJwt)({ id: admin._id, role: 'admin' });
    return {
        token,
        admin,
    };
}
