import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { errorHandler } from '@/middleware/errorHandler';
import { notFoundHandler } from '@/middleware/notFoundHandler';
import routes from '@/routes';
import Database from '@/config/database';
import specs, { createSpecs } from '@/config/swagger';

// Load environment variables
dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

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
    const dynamicSpecs = createSpecs(req);
    console.log('📋 Serving OpenAPI spec with', Object.keys(dynamicSpecs).length, 'root keys');
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(dynamicSpecs);
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

// Debug endpoint for checking OpenAPI spec structure
app.get('/debug/openapi', (req: any, res: any) => {
  res.json({
    hasComponents: !!specs.components,
    hasPaths: !!specs.paths,
    componentsKeys: Object.keys(specs.components || {}),
    pathsKeys: Object.keys(specs.paths || {}),
    pathsCount: Object.keys(specs.paths || {}).length,
    schemasCount: Object.keys(specs.components?.schemas || {}).length,
    availableSchemas: Object.keys(specs.components?.schemas || {}),
    samplePath: specs.paths ? Object.keys(specs.paths)[0] : 'none',
    environment: process.env.NODE_ENV,
    __dirname,
    cwd: process.cwd()
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

// Connect to database
Database.connect().catch(console.error);

// Export for Vercel (CommonJS)
module.exports = app;

// Start server (for Render, Railway, etc.)
const startServer = async () => {
  try {
    const HOST = process.env.HOST || '0.0.0.0';
    app.listen(PORT, HOST, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
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

// Start server unless it's being imported as a module (for Vercel)
if (require.main === module) {
  startServer();
}
