// src/controllers/xero.controller.js
import { fetchAllAccounts, saveTokenSet, loadTokenSet } from '../services/xero.service.js';
import { saveXeroAccount } from '../db/index.js';

export async function connectXero(req, res) {
  try {
    const state = Math.random().toString(36).substring(7);
    const consentUrl = await xero.buildConsentUrl({ state });
    res.redirect(consentUrl);
  } catch (error) {
    console.error('Error redirecting to Xero:', error);
    res.status(500).send('Failed to redirect to Xero login');
  }
}

export async function handleCallback(req, res) {
  try {
    const { code, state } = req.query;

    if (!code) {
      throw new Error('No authorization code received');
    }

    const tokenSet = await xero.apiCallback(req.url, { state });

    if (!tokenSet?.access_token) {
      throw new Error('No valid token received from Xero');
    }

    xero.setTokenSet(tokenSet);
    await saveTokenSet(tokenSet);

    console.log('Token set saved:', tokenSet);

    res.redirect('/');
  } catch (error) {
    console.error('Error during Xero callback:', error);
    res.status(500).json({
      error: 'Failed to complete Xero authentication',
      details: error.message
    });
  }
}

export async function getAccounts(req, res) {
  try {
    await loadTokenSet();

    const accounts = await fetchAllAccounts();

    // Log the accounts being saved
    console.log('Fetched Xero accounts:', accounts);

    accounts.forEach(account => {
      saveXeroAccount({
        id: account.AccountID,
        name: account.Name,
        type: account.Type,
        status: account.Status,
        updated_datetime: account.UpdatedDateUTC
          ? new Date(account.UpdatedDateUTC).toISOString()
          : '1970-01-01T00:00:00.000Z'
      });
    });

    res.json(accounts);
  } catch (error) {
    console.error('Error fetching Xero accounts:', error);
    res.status(500).json({
      error: 'Failed to fetch Xero accounts',
      details: error.message
    });
  }
}
