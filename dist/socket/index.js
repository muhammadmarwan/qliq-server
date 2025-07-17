"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocket = initSocket;
exports.getIO = getIO;
const socket_io_1 = require("socket.io");
let io;
function initSocket(server) {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: 'http://localhost:3000',
            methods: ['GET', 'POST'],
        },
    });
    io.on('connection', (socket) => {
        console.log('✅ New client connected:', socket.id);
        socket.on('disconnect', () => {
            console.log('❌ Client disconnected:', socket.id);
        });
    });
    return io;
}
function getIO() {
    if (!io)
        throw new Error('Socket.io not initialized!');
    return io;
}
