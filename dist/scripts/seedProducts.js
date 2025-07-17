"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../models/User")); // adjust path as needed
async function seedUsers() {
    // Clear existing users to avoid duplicates (optional)
    await User_1.default.deleteMany({});
    // Create root user
    const rootUser = await User_1.default.create({
        name: 'Root User',
        email: 'root@example.com',
        password: 'hashed_password_here',
        level: 0,
        downlines: [],
    });
    // Create level 1 users
    const userLevel1A = await User_1.default.create({
        name: 'User Level 1A',
        email: 'user1a@example.com',
        password: 'hashed_password_here',
        referrer: rootUser._id,
        level: 1,
        downlines: [],
    });
    const userLevel1B = await User_1.default.create({
        name: 'User Level 1B',
        email: 'user1b@example.com',
        password: 'hashed_password_here',
        referrer: rootUser._id,
        level: 1,
        downlines: [],
    });
    // Assign downlines to rootUser with explicit casting
    rootUser.downlines = [
        userLevel1A._id,
        userLevel1B._id,
    ];
    await rootUser.save();
    // Create level 2 users
    const userLevel2A = await User_1.default.create({
        name: 'User Level 2A',
        email: 'user2a@example.com',
        password: 'hashed_password_here',
        referrer: userLevel1A._id,
        level: 2,
        downlines: [],
    });
    const userLevel2B = await User_1.default.create({
        name: 'User Level 2B',
        email: 'user2b@example.com',
        password: 'hashed_password_here',
        referrer: userLevel1A._id,
        level: 2,
        downlines: [],
    });
    const userLevel2C = await User_1.default.create({
        name: 'User Level 2C',
        email: 'user2c@example.com',
        password: 'hashed_password_here',
        referrer: userLevel1B._id,
        level: 2,
        downlines: [],
    });
    // Assign downlines to userLevel1A with casting
    userLevel1A.downlines = [
        userLevel2A._id,
        userLevel2B._id,
    ];
    await userLevel1A.save();
    // Assign downlines to userLevel1B (push with casting)
    userLevel1B.downlines.push(userLevel2C._id);
    await userLevel1B.save();
    // Create level 3 user
    const userLevel3A = await User_1.default.create({
        name: 'User Level 3A',
        email: 'user3a@example.com',
        password: 'hashed_password_here',
        referrer: userLevel2A._id,
        level: 3,
        downlines: [],
    });
    // Assign downlines to userLevel2A
    userLevel2A.downlines.push(userLevel3A._id);
    await userLevel2A.save();
    console.log('Users seeded successfully!');
}
exports.default = seedUsers;
