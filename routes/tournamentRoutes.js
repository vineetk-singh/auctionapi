import express from 'express';
import Tournament from '../models/tournament.js';
import { tournamentSchema } from '../validations/tournamentValidation.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Tournament:
 *       type: object
 *       required:
 *         - name
 *         - numberOfTeams
 *         - playersEachTeam
 *         - amountPerTeam
 *       properties:
 *         name:
 *           type: string
 *         numberOfTeams:
 *           type: integer
 *         playersEachTeam:
 *           type: integer
 *         amountPerTeam:
 *           type: number
 *       example:
 *         name: "IPL 2025"
 *         numberOfTeams: 8
 *         playersEachTeam: 11
 *         amountPerTeam: 1000
 */

/**
 * @swagger
 * /api/tournaments:
 *   get:
 *     summary: Get all tournaments
 *     tags: [Tournament]
 *     responses:
 *       200:
 *         description: List of tournaments
 */
router.get('/', async (req, res) => {
  const tournaments = await Tournament.find();
  res.json(tournaments);
});

/**
 * @swagger
 * /api/tournaments/{name}:
 *   get:
 *     summary: Get a tournament by name
 *     tags: [Tournament]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: The tournament name
 *     responses:
 *       200:
 *         description: Tournament data
 *       404:
 *         description: Not found
 */
router.get('/:name', async (req, res) => {
  const tournament = await Tournament.findById(req.params.name);
  if (!tournament) return res.status(404).json({ error: 'Tournament not found' });
  res.json(tournament);
});

/**
 * @swagger
 * /api/tournaments:
 *   post:
 *     summary: Create a new tournament
 *     tags: [Tournament]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tournament'
 *     responses:
 *       201:
 *         description: Tournament created
 */
router.post('/', validate(tournamentSchema), async (req, res) => {
  try {
    const { name, ...rest } = req.body;
    const tournament = new Tournament({ _id: name, ...rest });
    await tournament.save();
    res.status(201).json(tournament);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/tournaments/{name}:
 *   put:
 *     summary: Update an existing tournament
 *     tags: [Tournament]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tournament'
 *     responses:
 *       200:
 *         description: Tournament updated
 */
router.put('/:name', validate(tournamentSchema), async (req, res) => {
  try {
    const tournament = await Tournament.findByIdAndUpdate(req.params.name, {
      _id: req.body.name,
      numberOfTeams: req.body.numberOfTeams,
      playersEachTeam: req.body.playersEachTeam,
      amountPerTeam: req.body.amountPerTeam
    }, { new: true, runValidators: true });
    if (!tournament) return res.status(404).json({ error: 'Tournament not found' });
    res.json(tournament);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/tournaments/{name}:
 *   delete:
 *     summary: Delete a tournament
 *     tags: [Tournament]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted successfully
 */
router.delete('/:name', async (req, res) => {
  const tournament = await Tournament.findByIdAndDelete(req.params.name);
  if (!tournament) return res.status(404).json({ error: 'Tournament not found' });
  res.json({ message: 'Tournament deleted' });
});

export default router;