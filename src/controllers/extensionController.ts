import { Request, Response, NextFunction } from 'express';
import { ExtensionService } from '@/services/extensionService';
import { 
  createSuccessResponse, 
  createErrorResponse, 
  createPaginatedResponse,
  calculatePagination 
} from '@/utils/response';
import {
  CreateExtensionInput,
  PaginationInput,
  ExtensionIdInput,
} from '@/validations/extensionValidation';

export class ExtensionController {
  private extensionService: ExtensionService;

  constructor() {
    this.extensionService = new ExtensionService();
  }

  createExtension = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const extensionData: CreateExtensionInput = req.body;
      
      const newExtension = await this.extensionService.createExtension(extensionData);

      const response = createSuccessResponse('Extension created successfully', newExtension);
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };

  getAllExtensions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const pagination = req.query as any;
      
      const { extensions, total } = await this.extensionService.getAllExtensions(pagination);
      
      const paginationData = calculatePagination(total, pagination.page || 1, pagination.limit || 10);
      
      const response = createPaginatedResponse(
        'Extensions retrieved successfully',
        extensions,
        paginationData
      );
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  getExtensionById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      
      const extension = await this.extensionService.getExtensionById(id);
      
      if (!extension) {
        const errorResponse = createErrorResponse('Extension not found');
        res.status(404).json(errorResponse);
        return;
      }

      const response = createSuccessResponse('Extension retrieved successfully', extension);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  getLatestExtension = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const extension = await this.extensionService.getLatestExtension();
      
      if (!extension) {
        const errorResponse = createErrorResponse('No extensions found');
        res.status(404).json(errorResponse);
        return;
      }

      const response = createSuccessResponse('Latest extension retrieved successfully', extension);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  getExtensionByBuildNumber = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { buildNumber } = req.params;
      
      const extension = await this.extensionService.getExtensionByBuildNumber(buildNumber);
      
      if (!extension) {
        const errorResponse = createErrorResponse('Extension not found');
        res.status(404).json(errorResponse);
        return;
      }

      const response = createSuccessResponse('Extension retrieved successfully', extension);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
}