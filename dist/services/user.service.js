"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserTree = getUserTree;
exports.getUserDetails = getUserDetails;
exports.getUserTreeByUserId = getUserTreeByUserId;
const User_1 = __importDefault(require("../models/User"));
async function getDownlines(userId, maxLevel, currentLevel = 1) {
    if (currentLevel > maxLevel)
        return [];
    const downlineUsers = await User_1.default.find({ referrer: userId }).lean();
    const downlines = await Promise.all(downlineUsers.map(async (downline) => {
        const children = await getDownlines(downline._id.toString(), maxLevel, currentLevel + 1);
        return {
            _id: downline._id.toString(),
            name: downline.name,
            email: downline.email,
            level: downline.level,
            downlines: children,
            commissionBalance: downline.commissionBalance,
        };
    }));
    return downlines;
}
async function getUserTree(maxLevel = 5) {
    const rootUsers = await User_1.default.find({ referrer: null }).lean();
    const tree = await Promise.all(rootUsers.map(async (user) => {
        const downlines = await getDownlines(user._id.toString(), maxLevel);
        return {
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            level: user.level,
            downlines,
        };
    }));
    return tree;
}
async function getUserDetails(userId) {
    const user = await User_1.default.findById(userId).lean();
    return user;
}
async function getUserTreeByUserId(userId, maxLevel = 3) {
    const user = await User_1.default.findById(userId).lean();
    if (!user)
        return null;
    const downlines = await getDownlines(userId, maxLevel, 1);
    return {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        level: user.level,
        downlines,
        commissionBalance: user.commissionBalance,
    };
}
