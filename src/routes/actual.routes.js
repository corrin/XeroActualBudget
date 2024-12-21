import express from 'express';
import { getCategories } from '../controllers/actual.controller.js';

const router = express.Router();

router.get('/api/actual/categories', getCategories);

export default router;