import { Request, Response, NextFunction } from 'express';
import { createErrorResponse } from '@/utils/response';

export const authenticateSecret = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const { secret } = req.body;
    const expectedSecret = process.env.EXTENSION_SECRET;

    if (!expectedSecret) {
      throw new Error('Extension secret is not configured');
    }

    if (!secret) {
      const errorResponse = createErrorResponse('Secret is required');
      res.status(400).json(errorResponse);
      return;
    }

    if (secret !== expectedSecret) {
      const errorResponse = createErrorResponse('Invalid secret');
      res.status(401).json(errorResponse);
      return;
    }

    next();
  } catch (error: any) {
    const errorResponse = createErrorResponse('Authentication failed', error.message);
    res.status(500).json(errorResponse);
  }
};