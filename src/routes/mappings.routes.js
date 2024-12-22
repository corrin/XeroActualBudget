import express from 'express';
import { saveMappings } from '../controllers/mappings.controller.js';

const router = express.Router();

// Remove /api prefix since it's already handled in index.js
router.post('/', saveMappings);

export default router;