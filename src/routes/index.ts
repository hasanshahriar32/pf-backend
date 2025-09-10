import { Router } from 'express';
import userRoutes from '@/routes/userRoutes';

const router = Router();

// Mount user routes
router.use('/users', userRoutes);

/**
 * @openapi
 * /api/v1:
 *   get:
 *     tags: [Health]
 *     summary: API Information
 *     description: Get basic API information and available endpoints
 *     responses:
 *       200:
 *         description: API information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'API is running'
 *                 version:
 *                   type: string
 *                   example: '1.0.0'
 *                 endpoints:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: string
 *                       example: '/api/v1/users'
 *                     health:
 *                       type: string
 *                       example: '/health'
 *                     documentation:
 *                       type: string
 *                       example: '/api-docs'
 */
router.get('/', (req: any, res: any) => {
  res.json({
    success: true,
    message: 'API is running',
    version: '1.0.0',
    endpoints: {
      users: '/api/v1/users',
      health: '/health',
      documentation: '/api-docs',
    },
  });
});

export default router;
