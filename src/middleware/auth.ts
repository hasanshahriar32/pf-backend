import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '@/types';
import { verifyToken, extractTokenFromHeader } from '@/utils/jwt';
import { createErrorResponse } from '@/utils/response';

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = extractTokenFromHeader(req.headers?.authorization);
    const decoded = verifyToken(token);
    
    req.user = {
      id: decoded.id,
      email: decoded.email,
      username: decoded.username,
    };

    next();
  } catch (error: any) {
    const errorResponse = createErrorResponse('Unauthorized', error.message);
    res.status(401).json(errorResponse);
  }
};
