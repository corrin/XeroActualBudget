import express from 'express';
import { saveMappings, getMappings } from '../controllers/mappings.controller.js';

const router = express.Router();

router.get('/', getMappings);
router.post('/', saveMappings);

export default router;