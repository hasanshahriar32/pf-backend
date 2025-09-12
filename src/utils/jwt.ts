import jwt, { JwtPayload as BaseJwtPayload } from 'jsonwebtoken';

interface JwtPayload extends BaseJwtPayload {
  id: string;
  email: string;
  username: string;
  role: string;
}

export const generateToken = (payload: { id: string; email: string; username: string; role: string }): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  
  return jwt.sign(payload, secret, { expiresIn } as any);
};

export const verifyToken = (token: string): JwtPayload => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    
    // Ensure the decoded token has the required properties
    if (!decoded.id || !decoded.email || !decoded.username || !decoded.role) {
      throw new Error('Invalid token payload');
    }
    
    return decoded;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Token verification failed: ${error.message}`);
    }
    throw new Error('Invalid or expired token');
  }
};

export const extractTokenFromHeader = (authHeader: string | undefined): string => {
  if (!authHeader) {
    throw new Error('Authorization header is missing');
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    throw new Error('Authorization header format must be: Bearer <token>');
  }

  return parts[1];
};
