import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';

/**
 * Schema Manager Utility
 * This utility helps manage YAML schema files for API documentation
 */

export class SchemaManager {
  private schemasDir: string;

  constructor(schemasDirectory?: string) {
    this.schemasDir = schemasDirectory || path.join(__dirname, '../schemas');
  }

  /**
   * Load and parse a YAML schema file
   */
  loadSchemaFile(filename: string): any {
    try {
      const filePath = path.join(this.schemasDir, filename);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      return yaml.load(fileContent);
    } catch (error) {
      console.error(`Error loading schema file ${filename}:`, error);
      return {};
    }
  }

  /**
   * Get all available schema files
   */
  getAvailableSchemas(): string[] {
    try {
      return fs.readdirSync(this.schemasDir)
        .filter(file => file.endsWith('.yml') || file.endsWith('.yaml'));
    } catch (error) {
      console.error('Error reading schemas directory:', error);
      return [];
    }
  }

  /**
   * Load all schema files and merge them
   */
  loadAllSchemas(): {
    components: any;
    paths: any;
    tags: any[];
  } {
    const schemaFiles = this.getAvailableSchemas();
    
    let mergedComponents: any = { schemas: {}, securitySchemes: {}, responses: {} };
    let mergedPaths: any = {};
    let mergedTags: any[] = [];

    schemaFiles.forEach(filename => {
      const schema = this.loadSchemaFile(filename);
      
      // Merge components
      if (schema.components) {
        if (schema.components.schemas) {
          mergedComponents.schemas = { ...mergedComponents.schemas, ...schema.components.schemas };
        }
        if (schema.components.securitySchemes) {
          mergedComponents.securitySchemes = { ...mergedComponents.securitySchemes, ...schema.components.securitySchemes };
        }
        if (schema.components.responses) {
          mergedComponents.responses = { ...mergedComponents.responses, ...schema.components.responses };
        }
      }

      // Merge paths
      if (schema.paths) {
        mergedPaths = { ...mergedPaths, ...schema.paths };
      }

      // Merge tags
      if (schema.tags) {
        mergedTags = [...mergedTags, ...schema.tags];
      }
    });

    return {
      components: mergedComponents,
      paths: mergedPaths,
      tags: mergedTags
    };
  }

  /**
   * Validate that a schema file has proper structure
   */
  validateSchemaFile(filename: string): boolean {
    const schema = this.loadSchemaFile(filename);
    
    // Check if it has at least one of the required sections
    return !!(schema.components || schema.paths || schema.tags);
  }

  /**
   * Create a new schema file template
   */
  createSchemaTemplate(resourceName: string): string {
    const template = `# ${resourceName.charAt(0).toUpperCase() + resourceName.slice(1)} API Documentation
# This file contains all ${resourceName}-related schemas and paths

components:
  schemas:
    ${resourceName.charAt(0).toUpperCase() + resourceName.slice(1)}:
      type: object
      required:
        - id
        - createdAt
        - updatedAt
      properties:
        id:
          type: string
          description: Unique identifier for the ${resourceName}
          example: "64f8a1b2c3d4e5f6g7h8i9j0"
        createdAt:
          type: string
          format: date-time
          description: Creation timestamp
          example: "2023-01-01T00:00:00.000Z"
        updatedAt:
          type: string
          format: date-time
          description: Last update timestamp
          example: "2023-01-01T00:00:00.000Z"

    ${resourceName.charAt(0).toUpperCase() + resourceName.slice(1)}Create:
      type: object
      required:
        - name
      properties:
        name:
          type: string
          description: ${resourceName.charAt(0).toUpperCase() + resourceName.slice(1)} name
          example: "Example ${resourceName}"

    ${resourceName.charAt(0).toUpperCase() + resourceName.slice(1)}Update:
      type: object
      properties:
        name:
          type: string
          description: ${resourceName.charAt(0).toUpperCase() + resourceName.slice(1)} name
          example: "Updated ${resourceName}"

# Uncomment and customize these paths when implementing the ${resourceName} API
# paths:
#   /api/v1/${resourceName}s:
#     get:
#       tags:
#         - ${resourceName.charAt(0).toUpperCase() + resourceName.slice(1)}s
#       summary: Get all ${resourceName}s
#       description: Retrieve a paginated list of all ${resourceName}s
#       responses:
#         '200':
#           description: ${resourceName.charAt(0).toUpperCase() + resourceName.slice(1)}s retrieved successfully
#           content:
#             application/json:
#               schema:
#                 $ref: '#/components/schemas/PaginatedResponse'

tags:
  - name: ${resourceName.charAt(0).toUpperCase() + resourceName.slice(1)}s
    description: ${resourceName.charAt(0).toUpperCase() + resourceName.slice(1)} management operations
`;

    return template;
  }
}

export default SchemaManager;
