import express from 'express';
import multer from 'multer';
import {
  createPlayer,
  getAllPlayers,
  getPlayerById,
  updatePlayer,
  deletePlayer,
  bulkUploadPlayers
} from '../controller/playerController.js';

/*
_id,age,country,role,basePrice,totalRuns,total4s,total6s,totalCenturies,total50s,total20s,total30s,total40s,battingAverage,totalOvers,totalWides,bowlingRuns,totalNoBalls,totalWickets,totalCatches,totalRunOuts
Virat Kohli,35,India,batting,1000000,12000,1000,500,70,100,50,40,30,55.4,0,0,0,0,0,100,15
Bumrah,30,India,bowling,900000,100,10,5,0,1,0,0,0,9.4,500,30,400,15,150,20,5

*/

const upload = multer({ dest: 'uploads/' });

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Players
 *   description: Player management and stats
 */

/**
 * @swagger
 * /api/players:
 *   post:
 *     summary: Create a new player
 *     tags: [Players]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Player'
 *     responses:
 *       201:
 *         description: Player created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Player'
 */
router.post('/', createPlayer);

/**
* @swagger
* /api/players:
*   get:
*     summary: Get all players
*     tags: [Players]
*     responses:
*       200:
*         description: List of all players
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/Player'
*/
router.get('/', getAllPlayers);

/** 
* @swagger
* /api/players/{id}:
*   get:
*     summary: Get player by ID
*     tags: [Players]
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: string
*     responses:
*       200:
*         description: Player details
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Player'
*       404:
*         description: Player not found
*/
router.get('/:id', getPlayerById);

/**
* @swagger
* /api/players/{id}:
*   put:
*     summary: Update player by ID
*     tags: [Players]
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: string
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Player'
*     responses:
*       200:
*         description: Player updated successfully
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Player'
*       404:
*         description: Player not found
*/
router.put('/:id', updatePlayer);

/**
* @swagger
* /api/players/{id}:
*   delete:
*     summary: Delete player by ID
*     tags: [Players]
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: string
*     responses:
*       200:
*         description: Player deleted
*       404:
*         description: Player not found
*/
router.delete('/:id', deletePlayer);

/**
* @swagger
* /api/players/bulk-upload:
*   post:
*     summary: Bulk upload players via CSV
*     tags: [Players]
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
*         description: Players uploaded successfully
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                 inserted:
*                   type: array
*                   items:
*                     $ref: '#/components/schemas/Player'
*/
/**
 * @swagger
 * components:
 *   schemas:
 *     Player:
 *       type: object
 *       required:
 *         - _id
 *         - age
 *         - country
 *         - role
 *         - basePrice
 *       properties:
 *         _id:
 *           type: string
 *           description: Name of the player
 *         age:
 *           type: number
 *           description: Age of the player
 *         country:
 *           type: string
 *           description: Country of the player
 *         role:
 *           type: string
 *           description: Role of the player (batting, bowling, allrounder)
 *           enum: [batting, bowling, allrounder]
 *         basePrice:
 *           type: number
 *           description: Base price of the player in auction
 *         records:
 *           type: object
 *           properties:
 *             batting:
 *               type: object
 *               properties:
 *                 totalRuns: { type: number }
 *                 total4s: { type: number }
 *                 total6s: { type: number }
 *                 totalCenturies: { type: number }
 *                 total50s: { type: number }
 *                 total20s: { type: number }
 *                 total30s: { type: number }
 *                 total40s: { type: number }
 *                 battingAverage: { type: number }
 *             bowling:
 *               type: object
 *               properties:
 *                 totalOvers: { type: number }
 *                 totalWides: { type: number }
 *                 totalRuns: { type: number }
 *                 totalNoBalls: { type: number }
 *                 totalWickets: { type: number }
 *             fielding:
 *               type: object
 *               properties:
 *                 totalCatches: { type: number }
 *                 totalRunOuts: { type: number }
 */
router.post('/bulk-upload', upload.single('file'), bulkUploadPlayers);

export default router;
