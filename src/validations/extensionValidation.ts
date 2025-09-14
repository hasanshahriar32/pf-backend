import { z } from 'zod';

// Extension validation schemas
export const createExtensionSchema = z.object({
  buildNumber: z.string().min(1, 'Build number is required'),
  buildDescription: z.string().min(1, 'Build description is required'),
  author: z.string().min(1, 'Author is required'),
  commitId: z.string().min(1, 'Commit ID is required'),
  packedExtensionUrl: z.string().url('Invalid packed extension URL'),
  unpackedExtensionUrl: z.string().url('Invalid unpacked extension URL'),
});

// Secret authentication schema
export const secretAuthSchema = z.object({
  secret: z.string().min(1, 'Secret is required'),
});

// Query parameter schemas
export const paginationSchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val, 10) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val, 10) : 10),
});

export const extensionIdSchema = z.object({
  id: z.string().min(1, 'Extension ID is required'),
});

// Type exports
export type CreateExtensionInput = z.infer<typeof createExtensionSchema>;
export type SecretAuthInput = z.infer<typeof secretAuthSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type ExtensionIdInput = z.infer<typeof extensionIdSchema>;