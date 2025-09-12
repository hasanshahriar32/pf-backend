import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '@/types';
import { verifyToken, extractTokenFromHeader } from '@/utils/jwt';
import { createErrorResponse } from '@/utils/response';
import { prisma } from '@/config/database';

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

export const requireAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user?.id) {
      const errorResponse = createErrorResponse('Unauthorized', 'Authentication required');
      res.status(401).json(errorResponse);
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { role: true }
    });

    if (!user || user.role !== 'ADMIN') {
      const errorResponse = createErrorResponse('Forbidden', 'Admin access required');
      res.status(403).json(errorResponse);
      return;
    }

    next();
  } catch (error: any) {
    const errorResponse = createErrorResponse('Internal Server Error', error.message);
    res.status(500).json(errorResponse);
  }
};
