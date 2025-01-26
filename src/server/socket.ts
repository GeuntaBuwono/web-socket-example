import { Server } from 'socket.io';
import type { Server as HTTPServer } from 'http';

export const initSocket = (httpServer: HTTPServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('message', (data) => {
      // Broadcast the message to all clients except sender
      socket.broadcast.emit('message', data);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  return io;
};
