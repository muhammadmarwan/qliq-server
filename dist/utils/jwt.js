"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signJwt = signJwt;
exports.verifyJwt = verifyJwt;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
const JWT_SECRET = config_1.config.jwtSecret;
const JWT_EXPIRES_IN = '1d';
function signJwt(payload) {
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}
function verifyJwt(token) {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        if (typeof decoded === 'string')
            return null;
        return decoded;
    }
    catch {
        return null;
    }
}
