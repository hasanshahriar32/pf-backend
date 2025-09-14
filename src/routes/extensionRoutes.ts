import { Router } from 'express';
import { ExtensionController } from '@/controllers/extensionController';
import { authenticateSecret } from '@/middleware/extensionAuth';
import { validate } from '@/middleware/validation';
import {
  createExtensionSchema,
  paginationSchema,
  extensionIdSchema,
} from '@/validations/extensionValidation';

const router = Router();
const extensionController = new ExtensionController();

/**
 * @openapi
 * /api/v1/extensions:
 *   post:
 *     tags: [Extensions]
 *     summary: Create a new extension (3rd party service only)
 *     description: Create a new extension build entry. Requires secret authentication.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ExtensionCreate'
 *               - type: object
 *                 required:
 *                   - secret
 *                 properties:
 *                   secret:
 *                     type: string
 *                     description: Secret key for authentication
 *     responses:
 *       201:
 *         description: Extension created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Extension'
 *       400:
 *         description: Invalid input data or missing secret
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Invalid secret
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  '/',
  authenticateSecret,
  validate(createExtensionSchema, 'body'),
  extensionController.createExtension
);

/**
 * @openapi
 * /api/v1/extensions:
 *   get:
 *     tags: [Extensions]
 *     summary: Get all extensions (Public)
 *     description: Retrieve a paginated list of all extensions. This endpoint is public.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Extensions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/PaginatedResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Extension'
 */
router.get(
  '/',
  validate(paginationSchema, 'query'),
  extensionController.getAllExtensions
);

/**
 * @openapi
 * /api/v1/extensions/latest:
 *   get:
 *     tags: [Extensions]
 *     summary: Get latest extension (Public)
 *     description: Retrieve the most recent extension build. This endpoint is public.
 *     responses:
 *       200:
 *         description: Latest extension retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Extension'
 *       404:
 *         description: No extensions found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/latest', extensionController.getLatestExtension);

/**
 * @openapi
 * /api/v1/extensions/build/{buildNumber}:
 *   get:
 *     tags: [Extensions]
 *     summary: Get extension by build number (Public)
 *     description: Retrieve a specific extension by its build number. This endpoint is public.
 *     parameters:
 *       - in: path
 *         name: buildNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: Build number of the extension
 *     responses:
 *       200:
 *         description: Extension retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Extension'
 *       404:
 *         description: Extension not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/build/:buildNumber', extensionController.getExtensionByBuildNumber);

/**
 * @openapi
 * /api/v1/extensions/{id}:
 *   get:
 *     tags: [Extensions]
 *     summary: Get extension by ID (Public)
 *     description: Retrieve a specific extension by its ID. This endpoint is public.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Extension ID
 *     responses:
 *       200:
 *         description: Extension retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Extension'
 *       404:
 *         description: Extension not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  '/:id',
  validate(extensionIdSchema, 'params'),
  extensionController.getExtensionById
);

export default router;