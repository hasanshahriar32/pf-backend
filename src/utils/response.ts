import { ApiResponse, PaginatedResponse } from '@/types';

export const createSuccessResponse = <T>(
  message: string,
  data?: T
): ApiResponse<T> => ({
  success: true,
  message,
  data,
});

export const createErrorResponse = (
  message: string,
  error?: string
): ApiResponse => ({
  success: false,
  message,
  error,
});

export const createPaginatedResponse = <T>(
  message: string,
  data: T[],
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  }
): PaginatedResponse<T> => ({
  success: true,
  message,
  data,
  pagination,
});

export const calculatePagination = (total: number, page: number, limit: number) => ({
  page,
  limit,
  total,
  pages: Math.ceil(total / limit),
});
