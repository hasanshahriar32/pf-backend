import { Router } from 'express';
import userRoutes from '@/routes/userRoutes';

const router = Router();

// Mount user routes
router.use('/users', userRoutes);

// Health check for API
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    version: '1.0.0',
    endpoints: {
      users: '/api/v1/users',
      health: '/health',
    },
  });
});

export default router;
