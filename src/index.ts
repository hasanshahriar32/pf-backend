import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { errorHandler } from '@/middleware/errorHandler';
import { notFoundHandler } from '@/middleware/notFoundHandler';
import routes from '@/routes';
import Database from '@/config/database';
import specs from '@/config/swagger';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Swagger UI Documentation
const swaggerOptions = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Express TypeScript Backend API',
  customfavIcon: '/favicon.ico'
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerOptions));

// Raw OpenAPI spec endpoint
app.get('/openapi.json', (req: any, res: any) => {
  try {
    console.log('📋 Serving OpenAPI spec with', Object.keys(specs).length, 'root keys');
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(specs);
  } catch (error) {
    console.error('Error serving OpenAPI spec:', error);
    res.status(500).json({ error: 'Failed to generate OpenAPI spec' });
  }
});

app.get('/health', (req: any, res: any) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    documentation: `${req.protocol}://${req.get('host')}/api-docs`,
  });
});

app.get('/', (req: any, res: any) => {
  res.status(200).json({
    success: true,
    message: 'Express TypeScript Backend API',
    version: '1.0.0',
    description: 'A modular Express.js backend with TypeScript, Prisma, MongoDB, and JWT authentication',
    endpoints: {
      health: `${req.protocol}://${req.get('host')}/health`,
      api: `${req.protocol}://${req.get('host')}/api/v1`,
      documentation: `${req.protocol}://${req.get('host')}/api-docs`,
      openapi: `${req.protocol}://${req.get('host')}/openapi.json`,
    },
  });
});

// API routes
app.use('/api/v1', routes);

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
  try {
    // Connect to database
    await Database.connect();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📊 Health check available at http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await Database.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...');
  await Database.disconnect();
  process.exit(0);
});

startServer();
