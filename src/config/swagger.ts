import SchemaManager from '@/utils/schemaManager';

// Initialize schema manager and load all schemas
const schemaManager = new SchemaManager();
const { components: mergedComponents, paths: mergedPaths, tags: mergedTags } = schemaManager.loadAllSchemas();

// Function to create specs with dynamic server URL
const createSpecs = (req?: any) => ({
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
      url: req ? `${req.protocol}://${req.get('host')}` : 'http://localhost:3000',
      description: 'Current server',
    },
  ],
  components: mergedComponents,
  paths: mergedPaths,
  tags: mergedTags,
});

// Default specs for backward compatibility
const specs = createSpecs();

// Add debug route for production
if (process.env.NODE_ENV === 'production') {
  console.log('Swagger: PRODUCTION - Full paths object:', JSON.stringify(specs.paths, null, 2));
}

export { createSpecs };
export default specs;
