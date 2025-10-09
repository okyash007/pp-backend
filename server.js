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
import { specs, swaggerUi } from './src/config/swagger.js';
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
/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns the current status and uptime of the server
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 *             example:
 *               status: "OK"
 *               uptime: 1234.567
 *               timestamp: "2023-12-01T10:30:00.000Z"
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Serve the raw JSON spec first (before the catch-all /api-docs route)
app.get('/api-docs/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(specs);
});

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'PP Backend API Documentation',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    docExpansion: 'none',
    filter: true,
    showExtensions: true,
    showCommonExtensions: true,
    tryItOutEnabled: true
  }
}));

// Routes
app.use('/', indexRouter);

// Error handling middleware
app.use(errorMiddleWare);

// Start server
app.listen(PORT, () => {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? (process.env.API_BASE_URL || `http://localhost:${PORT}`)
    : `http://localhost:${PORT}`;
    
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Base URL: ${baseUrl}`);
  console.log(`🔗 Health check: ${baseUrl}/health`);
  console.log(`📚 API Documentation: ${baseUrl}/api-docs`);
});

export default app;
