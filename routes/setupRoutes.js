import express from 'express';
import { getSetupStatus } from '../controller/setupController.js';

const router = express.Router();

router.get('/status', getSetupStatus);

export default router; 