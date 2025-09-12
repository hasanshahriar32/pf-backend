import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest, LoginResponse } from '@/types';
import { UserService } from '@/services/userService';
import { generateToken } from '@/utils/jwt';
import { 
  createSuccessResponse, 
  createErrorResponse, 
  createPaginatedResponse,
  calculatePagination 
} from '@/utils/response';
import {
  CreateUserInput,
  UpdateUserInput,
  LoginInput,
  ChangePasswordInput,
  PaginationInput,
  AssignAdminInput,
} from '@/validations/userValidation';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: CreateUserInput = req.body;
      
      const newUser = await this.userService.createUser(userData);
      
      // Generate JWT token
      const token = generateToken({
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        role: newUser.role,
      });

      const loginResponse: LoginResponse = {
        user: {
          id: newUser.id,
          email: newUser.email,
          username: newUser.username,
          firstName: newUser.firstName || undefined,
          lastName: newUser.lastName || undefined,
          role: newUser.role,
        },
        token,
      };

      const response = createSuccessResponse('User registered successfully', loginResponse);
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password }: LoginInput = req.body;
      
      const user = await this.userService.validateUserCredentials(email, password);
      
      const token = generateToken({
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      });

      const loginResponse: LoginResponse = {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName || undefined,
          lastName: user.lastName || undefined,
          role: user.role,
        },
        token,
      };

      const response = createSuccessResponse('Login successful', loginResponse);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  getProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }

      const user = await this.userService.getUserById(req.user.id);
      
      if (!user) {
        throw new Error('User not found');
      }

      // Remove password from response
      const { password, ...userWithoutPassword } = user;

      const response = createSuccessResponse('Profile retrieved successfully', userWithoutPassword);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const pagination: PaginationInput = req.query as any;
      
      const { users, total } = await this.userService.getAllUsers(pagination);
      
      // Remove passwords from response
      const usersWithoutPasswords = users.map(({ password, ...user }) => user);
      
      const paginationData = calculatePagination(total, pagination.page, pagination.limit);
      
      const response = createPaginatedResponse(
        'Users retrieved successfully',
        usersWithoutPasswords,
        paginationData
      );
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      
      const user = await this.userService.getUserById(id);
      
      if (!user) {
        throw new Error('User not found');
      }

      // Remove password from response
      const { password, ...userWithoutPassword } = user;

      const response = createSuccessResponse('User retrieved successfully', userWithoutPassword);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }

      const userData: UpdateUserInput = req.body;
      
      const updatedUser = await this.userService.updateUser(req.user.id, userData);
      
      // Remove password from response
      const { password, ...userWithoutPassword } = updatedUser;

      const response = createSuccessResponse('User updated successfully', userWithoutPassword);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  updateUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const userData: UpdateUserInput = req.body;
      
      const updatedUser = await this.userService.updateUser(id, userData);
      
      // Remove password from response
      const { password, ...userWithoutPassword } = updatedUser;

      const response = createSuccessResponse('User updated successfully', userWithoutPassword);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  deleteUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }

      await this.userService.deleteUser(req.user.id);

      const response = createSuccessResponse('User deleted successfully');
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  deleteUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      
      await this.userService.deleteUser(id);

      const response = createSuccessResponse('User deleted successfully');
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  changePassword = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }

      const { currentPassword, newPassword }: ChangePasswordInput = req.body;
      
      await this.userService.changePassword(req.user.id, currentPassword, newPassword);

      const response = createSuccessResponse('Password changed successfully');
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  assignRole = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const assignData: AssignAdminInput = req.body;
      
      const updatedUser = await this.userService.assignRole(assignData);

      // Remove password from response
      const { password, ...userWithoutPassword } = updatedUser;

      const response = createSuccessResponse('User role updated successfully', userWithoutPassword);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
}
