import express from 'express';
import { getCategories } from '../controllers/actual.controller.js';

const router = express.Router();

// Remove /api/actual prefix since it's already handled in index.js
router.get('/categories', getCategories);

export default router;