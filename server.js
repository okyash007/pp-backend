// External dependencies
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import indexRouter from './src/routes/index.js';

// Environment configuration
import dotenv from 'dotenv';
import { connectToMongoDB } from './src/config/connectMongoDb.js'; 
import { errorMiddleWare } from './src/middleware/error.middleware.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Connect to MongoDB
connectToMongoDB();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('combined')); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/', indexRouter);

// Error handling middleware
app.use(errorMiddleWare);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

export default app;
