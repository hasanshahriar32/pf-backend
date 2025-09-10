import { Request, Response, NextFunction } from 'express';
import { createErrorResponse } from '@/utils/response';

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', error);

  // Default error status and message
  let status = 500;
  let message = 'Internal server error';

  // Handle specific error types
  if (error.name === 'ValidationError') {
    status = 400;
    message = 'Validation error';
  } else if (error.name === 'UnauthorizedError' || error.message === 'Invalid or expired token') {
    status = 401;
    message = 'Unauthorized';
  } else if (error.name === 'NotFoundError') {
    status = 404;
    message = 'Resource not found';
  } else if (error.name === 'ConflictError') {
    status = 409;
    message = 'Conflict';
  }

  // Prisma errors
  if (error.code === 'P2002') {
    status = 409;
    message = 'Duplicate entry';
  } else if (error.code === 'P2025') {
    status = 404;
    message = 'Record not found';
  }

  const errorResponse = createErrorResponse(
    message,
    process.env.NODE_ENV === 'development' ? error.message : undefined
  );

  res.status(status).json(errorResponse);
};
