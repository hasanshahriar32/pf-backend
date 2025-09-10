import SchemaManager from '@/utils/schemaManager';

// Initialize schema manager and load all schemas
const schemaManager = new SchemaManager();
const { components: mergedComponents, paths: mergedPaths, tags: mergedTags } = schemaManager.loadAllSchemas();

// Create OpenAPI specification directly
const specs = {
  openapi: '3.0.0',
  info: {
    title: 'Express TypeScript Backend API',
    version: '1.0.0',
    description: 'A modular Express.js backend with TypeScript, Prisma, MongoDB, and JWT authentication',
    contact: {
      name: 'API Support',
      email: 'support@example.com',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: process.env.NODE_ENV === 'production' 
        ? (process.env.PRODUCTION_URL || 'https://your-app.onrender.com')
        : `http://localhost:${process.env.PORT || 3000}`,
      description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
    },
  ],
  components: mergedComponents,
  paths: mergedPaths,
  tags: mergedTags,
};

console.log('Swagger: Generated OpenAPI spec with', Object.keys(specs.components?.schemas || {}).length, 'schemas');
console.log('Swagger: Available schemas:', Object.keys(specs.components?.schemas || {}));

export default specs;
