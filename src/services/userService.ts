import { User } from '@prisma/client';
import { prisma } from '@/config/database';
import { CreateUserInput, UpdateUserInput, PaginationInput } from '@/validations/userValidation';
import { hashPassword, comparePassword } from '@/utils/password';

export class UserService {
  async createUser(userData: CreateUserInput): Promise<User> {
    const { password, ...otherData } = userData;
    
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: userData.email },
          { username: userData.username },
        ],
      },
    });

    if (existingUser) {
      if (existingUser.email === userData.email) {
        throw new Error('User with this email already exists');
      }
      if (existingUser.username === userData.username) {
        throw new Error('User with this username already exists');
      }
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        ...otherData,
        password: hashedPassword,
      },
    });

    return newUser;
  }

  async getUserById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    return user;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    return user;
  }

  async getAllUsers(pagination: PaginationInput): Promise<{
    users: User[];
    total: number;
  }> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count(),
    ]);

    return { users, total };
  }

  async updateUser(id: string, userData: UpdateUserInput): Promise<User> {
    // Check if user exists
    const existingUser = await this.getUserById(id);
    if (!existingUser) {
      throw new Error('User not found');
    }

    // Check for conflicts if updating email or username
    if (userData.email || userData.username) {
      const conflictUser = await prisma.user.findFirst({
        where: {
          AND: [
            { id: { not: id } },
            {
              OR: [
                userData.email ? { email: userData.email } : {},
                userData.username ? { username: userData.username } : {},
              ].filter(condition => Object.keys(condition).length > 0),
            },
          ],
        },
      });

      if (conflictUser) {
        if (conflictUser.email === userData.email) {
          throw new Error('User with this email already exists');
        }
        if (conflictUser.username === userData.username) {
          throw new Error('User with this username already exists');
        }
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: userData,
    });

    return updatedUser;
  }

  async deleteUser(id: string): Promise<User> {
    // Check if user exists
    const existingUser = await this.getUserById(id);
    if (!existingUser) {
      throw new Error('User not found');
    }

    const deletedUser = await prisma.user.delete({
      where: { id },
    });

    return deletedUser;
  }

  async changePassword(id: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.getUserById(id);
    if (!user) {
      throw new Error('User not found');
    }

    const isCurrentPasswordValid = await comparePassword(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    const hashedNewPassword = await hashPassword(newPassword);
    
    await prisma.user.update({
      where: { id },
      data: { password: hashedNewPassword },
    });
  }

  async validateUserCredentials(email: string, password: string): Promise<User> {
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    return user;
  }
}
