import express from 'express';
import { syncXeroJournals } from '../controllers/sync.controller.js';

const router = express.Router();

router.post('/journals', syncXeroJournals);

export default router;