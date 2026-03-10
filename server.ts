import express from 'express';
import { createServer as createViteServer } from 'vite';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import apiRoutes from './src/server/routes/api.js';

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
    },
  });
  const PORT = 3000;

  app.use(express.json());

  // Connect to MongoDB if URI is provided, otherwise log warning
  const MONGODB_URI = process.env.MONGODB_URI;
  if (MONGODB_URI) {
    try {
      await mongoose.connect(MONGODB_URI);
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('MongoDB connection error:', error);
    }
  } else {
    console.warn('MONGODB_URI not set. Using in-memory mock data for API routes.');
  }

  // Socket.io for real-time GPS tracking
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('driver:location_update', (data) => {
      // Broadcast to all clients listening for this bus or all buses
      io.emit('passenger:bus_location', data);
      
      // Also emit to a specific route room if needed
      if (data.route_id) {
        io.to(`route_${data.route_id}`).emit('passenger:bus_location', data);
      }
    });

    socket.on('passenger:join_route', (routeId) => {
      socket.join(`route_${routeId}`);
    });

    socket.on('passenger:leave_route', (routeId) => {
      socket.leave(`route_${routeId}`);
    });

    socket.on('admin:broadcast_announcement', (data) => {
      io.emit('passenger:announcement', data);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  // API Routes
  app.use('/api', apiRoutes);

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
