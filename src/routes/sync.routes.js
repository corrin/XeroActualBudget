import express from 'express';
import { syncXeroAccounts } from '../controllers/sync.controller.js';

const router = express.Router();

router.post('/sync/accounts', syncXeroAccounts);

export default router;