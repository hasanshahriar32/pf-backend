import SchemaManager from '@/utils/schemaManager';

// Initialize schema manager and load all schemas
const schemaManager = new SchemaManager();
const { components: mergedComponents, paths: mergedPaths, tags: mergedTags } = schemaManager.loadAllSchemas();

// Create OpenAPI specification directly
const specs = {
  openapi: "3.0.0",
  info: {
    title: "Express TypeScript Backend API",
    version: "1.0.0",
    description:
      "A modular Express.js backend with TypeScript, Prisma, MongoDB, and JWT authentication",
    contact: {
      name: "API Support",
      email: "support@example.com",
    },
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT",
    },
  },
  servers: [
    {
      url:
        process.env.NODE_ENV === "production"
          ? process.env.PRODUCTION_URL ||
            "https://pf-backend-x6xf.onrender.com"
          : `http://localhost:${process.env.PORT || 3000}`,
      description:
        process.env.NODE_ENV === "production"
          ? "Production server"
          : "Development server",
    },
  ],
  components: mergedComponents,
  paths: mergedPaths,
  tags: mergedTags,
};

// Add debug route for production
if (process.env.NODE_ENV === 'production') {
  console.log('Swagger: PRODUCTION - Full paths object:', JSON.stringify(specs.paths, null, 2));
}

export default specs;
