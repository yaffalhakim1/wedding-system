import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import weddingRoutes from './routes/wedding.js';
import rsvpRoutes from './routes/rsvp.js';
import adminRoutes from './routes/admin.js';
import messageRoutes from './routes/message.js';
import photoRoutes from './routes/photo.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

// Import database
import db from './models/index.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'http://localhost:3000', // For local development
      'http://localhost:3001', // Alternative local port
      'https://dapurenakeco.com', // Your production domain
      'http://dapurenakeco.com', // In case you're not using HTTPS
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-CSRF-Token',
      'CSRF-Token',
    ],
  })
);
// Logging middleware
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Static files for uploaded photos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    message: 'Wedding Invitation Backend is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// API Routes (to be implemented)
app.get('/api', (req: Request, res: Response) => {
  res.json({
    message: 'Wedding Invitation API',
    version: '1.0.0',
    endpoints: {
      wedding: '/api/wedding',
      rsvp: '/api/rsvp',
      messages: '/api/messages',
      photos: '/api/photos',
      admin: '/api/admin',
    },
  });
});

// API route handlers
app.use('/api/wedding', weddingRoutes);
app.use('/api/rsvp', rsvpRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
  });
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === 'production'
      ? 'Internal Server Error'
      : err.message;

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
});

// Helper functions for server startup
const testConnection = async () => {
  await db.sequelize.authenticate();
};

const setupAssociations = () => {
  // Setup model associations if they exist
  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });
};

const syncModels = async () => {
  // Sync database (in development only)
  if (process.env.NODE_ENV === 'development') {
    await db.sequelize.sync();
  }
};

// Database connection and server startup
const startServer = async () => {
  try {
    // Test database connection FIRST
    await testConnection();
    console.log('✅ Database connection established successfully');

    // Models are already imported via require('./models')
    console.log('✅ Models imported successfully');

    // Setup model associations
    setupAssociations();
    console.log('✅ Model associations set up successfully');

    // Sync models (create tables if they don't exist)
    await syncModels();
    console.log('✅ Database models synchronized successfully');

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📋 Health check: http://localhost:${PORT}/health`);
      console.log(`🔗 API docs: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await db.sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await db.sequelize.close();
  process.exit(0);
});

// Start the server
startServer();
