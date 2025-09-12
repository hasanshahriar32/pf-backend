import { z } from 'zod';

// User role enum
export const UserRoleEnum = z.enum(['USER', 'ADMIN']);

// User validation schemas
export const createUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(20, 'Username must not exceed 20 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export const updateUserSchema = z.object({
  email: z.string().email('Invalid email format').optional(),
  username: z.string().min(3, 'Username must be at least 3 characters').max(20, 'Username must not exceed 20 characters').optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export const assignAdminSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  role: UserRoleEnum,
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});

// Query parameter schemas
export const paginationSchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val, 10) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val, 10) : 10),
});

export const userIdSchema = z.object({
  id: z.string().min(1, 'User ID is required'),
});

// Type exports
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type UserIdInput = z.infer<typeof userIdSchema>;
export type AssignAdminInput = z.infer<typeof assignAdminSchema>;
