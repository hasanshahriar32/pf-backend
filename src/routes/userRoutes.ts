import { Router } from 'express';
import { UserController } from '@/controllers/userController';
import { authenticateToken } from '@/middleware/auth';
import { validate } from '@/middleware/validation';
import {
  createUserSchema,
  updateUserSchema,
  loginSchema,
  changePasswordSchema,
  paginationSchema,
  userIdSchema,
} from '@/validations/userValidation';

const router = Router();
const userController = new UserController();

// Public routes
router.post(
  '/register',
  validate(createUserSchema),
  userController.register
);

router.post(
  '/login',
  validate(loginSchema),
  userController.login
);

// Protected routes - require authentication
router.get(
  '/profile',
  authenticateToken,
  userController.getProfile
);

router.put(
  '/profile',
  authenticateToken,
  validate(updateUserSchema),
  userController.updateUser
);

router.delete(
  '/profile',
  authenticateToken,
  userController.deleteUser
);

router.put(
  '/change-password',
  authenticateToken,
  validate(changePasswordSchema),
  userController.changePassword
);

// Admin routes (for managing other users)
router.get(
  '/',
  authenticateToken,
  validate(paginationSchema, 'query'),
  userController.getAllUsers
);

router.get(
  '/:id',
  authenticateToken,
  validate(userIdSchema, 'params'),
  userController.getUserById
);

router.put(
  '/:id',
  authenticateToken,
  validate(userIdSchema, 'params'),
  validate(updateUserSchema),
  userController.updateUserById
);

router.delete(
  '/:id',
  authenticateToken,
  validate(userIdSchema, 'params'),
  userController.deleteUserById
);

export default router;
