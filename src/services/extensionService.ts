import { Extension } from '@prisma/client';
import { prisma } from '@/config/database';
import { CreateExtensionInput, PaginationInput } from '@/validations/extensionValidation';

export class ExtensionService {
  async createExtension(extensionData: CreateExtensionInput): Promise<Extension> {
    // Check if extension with same build number already exists
    const existingExtension = await prisma.extension.findFirst({
      where: {
        buildNumber: extensionData.buildNumber,
      },
    });

    if (existingExtension) {
      throw new Error('Extension with this build number already exists');
    }

    const newExtension = await prisma.extension.create({
      data: extensionData,
    });

    return newExtension;
  }

  async getAllExtensions(pagination: PaginationInput): Promise<{
    extensions: Extension[];
    total: number;
  }> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const [extensions, total] = await Promise.all([
      prisma.extension.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.extension.count(),
    ]);

    return { extensions, total };
  }

  async getExtensionById(id: string): Promise<Extension | null> {
    const extension = await prisma.extension.findUnique({
      where: { id },
    });

    return extension;
  }

  async getLatestExtension(): Promise<Extension | null> {
    const extension = await prisma.extension.findFirst({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return extension;
  }

  async getExtensionByBuildNumber(buildNumber: string): Promise<Extension | null> {
    const extension = await prisma.extension.findFirst({
      where: { buildNumber },
    });

    return extension;
  }

  async deleteExtension(id: string): Promise<Extension> {
    const extension = await prisma.extension.findUnique({
      where: { id },
    });

    if (!extension) {
      throw new Error('Extension not found');
    }

    const deletedExtension = await prisma.extension.delete({
      where: { id },
    });

    return deletedExtension;
  }
}