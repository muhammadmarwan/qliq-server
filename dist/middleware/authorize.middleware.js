"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = authorizeRoles;
function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
        const role = req.user ? 'user' : req.admin ? 'admin' : null;
        if (!role || !allowedRoles.includes(role)) {
            return res.status(403).json({ message: 'Access Denied' });
        }
        next();
    };
}
