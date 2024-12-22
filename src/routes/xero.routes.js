import express from 'express';
import { connectXero, handleCallback, getAccounts } from '../controllers/xero.controller.js';

const router = express.Router();

router.get('/connect', connectXero);
router.get('/callback', handleCallback);
router.get('/accounts', getAccounts);

export default router;