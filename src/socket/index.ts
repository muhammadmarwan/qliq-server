import { Server as IOServer } from 'socket.io';

let io: IOServer;

export function initSocket(server: any) {
  io = new IOServer(server, {
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

export function getIO() {
  if (!io) throw new Error('Socket.io not initialized!');
  return io;
}
