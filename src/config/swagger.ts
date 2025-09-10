import swaggerJSDoc from 'swagger-jsdoc';
import SchemaManager from '@/utils/schemaManager';

// Initialize schema manager and load all schemas
const schemaManager = new SchemaManager();
const { components: mergedComponents, paths: mergedPaths, tags: mergedTags } = schemaManager.loadAllSchemas();

const options = {
  definition: {
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
        url: process.env.NODE_ENV === 'production' ? 'https://api.example.com' : `http://localhost:${process.env.PORT || 3000}`,
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
      },
    ],
    components: mergedComponents,
    paths: mergedPaths,
    tags: mergedTags,
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // Path to the API files
};

export const specs = swaggerJSDoc(options);
export default specs;
