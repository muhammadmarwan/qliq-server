"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// index.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const http_1 = __importDefault(require("http"));
const config_1 = require("./utils/config");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const cart_routes_1 = __importDefault(require("./routes/cart.routes"));
const checkout_routes_1 = __importDefault(require("./routes/checkout.routes"));
const payment_routes_1 = __importDefault(require("./routes/payment.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const socket_1 = require("./socket");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const server = http_1.default.createServer(app);
(0, socket_1.initSocket)(server);
mongoose_1.default
    .connect(config_1.config.mongoUri)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch((err) => console.error('❌ MongoDB Error:', err));
app.use('/api/auth', auth_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use('/api/products', product_routes_1.default);
app.use('/api/cart', cart_routes_1.default);
app.use('/api/checkout', checkout_routes_1.default);
app.use('/api/payment', payment_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
app.use('/api/orders', order_routes_1.default);
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`🚀 Server running with Socket.IO on http://localhost:${PORT}`);
});
