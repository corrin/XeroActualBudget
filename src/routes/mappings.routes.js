import express from 'express';
import { saveMappings } from '../controllers/mappings.controller.js';

const router = express.Router();

router.post('/api/mappings', saveMappings);

export default router;