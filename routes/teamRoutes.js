import express from 'express';
import multer from 'multer';
import { createTeam, getTeams, bulkUploadTeams } from '../controller/teamController.js';
import { authenticateJWT, authorizeRoles } from '../middleware/auth.js';

/**
_id,owner,lock
Team Alpha,John Doe,false
Team Beta,Alice,true
 */

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

/**
 * @swagger
 * tags:
 *   name: Teams
 *   description: API endpoints for managing teams
 */

/**
 * @swagger
 * components:
 *  securitySchemes:
 *      bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 *   schemas:
 *     Team:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Team name used as the ID
 *         owner:
 *           type: string
 *         players:
 *           type: array
 *           items:
 *             type: string
 *         lock:
 *           type: boolean
 *       required:
 *         - _id
 *         - owner
 */

/**
 * @swagger
 * /api/teams:
 *   post:
 *     summary: Create a new team
 *     tags: [Teams]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Team'
 *     responses:
 *       201:
 *         description: Team created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post('/', authenticateJWT, authorizeRoles('Admin'), createTeam);

/**
 * @swagger
 * /api/teams:
 *   get:
 *     summary: Get all teams
 *     tags: [Teams]
 *     responses:
 *       200:
 *         description: List of all teams
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Team'
 *       500:
 *         description: Server error
 */
router.get('/', authenticateJWT, authorizeRoles('Admin'), getTeams);

/**
 * @swagger
 * /api/teams/bulk:
 *   post:
 *     summary: Bulk upload teams using a CSV file
 *     tags: [Teams]
 *     security:
 *      - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Teams uploaded successfully
 *       400:
 *         description: Invalid CSV or validation error
 *       500:
 *         description: Server error
 */
//router.post('/bulk', upload.single('file'), bulkUploadTeams);
router.post('/bulk', authenticateJWT, authorizeRoles('Admin'), upload.single('file'), bulkUploadTeams);

export default router;
