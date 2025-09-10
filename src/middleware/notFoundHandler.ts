import { Request, Response } from 'express';
import { createErrorResponse } from '@/utils/response';

export const notFoundHandler = (req: Request, res: Response): void => {
  const errorResponse = createErrorResponse(
    'Route not found',
    `The requested endpoint ${req.method} ${req.path} does not exist`
  );
  
  res.status(404).json(errorResponse);
};
