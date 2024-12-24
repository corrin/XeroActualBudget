// src/controllers/xero.controller.js
import { xero } from '../config/xero.js';
import { fetchAllAccounts } from '../services/xero.service.js';
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

        // Use Xero's built-in token handling
        xero.setTokenSet(tokenSet);

        console.log('Token set received and set:', tokenSet);

        res.redirect('/');
    } catch (error) {
        console.error('Error during Xero callback:', error);
        res.status(500).json({
            error: 'Failed to complete Xero authentication',
            details: error.message,
        });
    }
}

export async function getAccounts(req, res) {
    try {
        if (!xero.tokenSet?.access_token) {
            throw new Error('Not authenticated with Xero');
        }

        const accounts = await fetchAllAccounts(); // Reuse the function from the service layer

        console.log('Fetched Xero accounts:', accounts);

        accounts.forEach(account => {
            if (account.accountID == null) {
                console.log('Processing Xero account with missing ID:', account);
            }
            saveXeroAccount({
                accountID: account.accountID,
                name: account.name,
                type: account.type,
                status: account.status,
                updatedDateUTC: account.updatedDateUTC
            });
        });

        res.json(accounts);
    } catch (error) {
        console.error('Error fetching Xero accounts:', error);
        res.status(500).json({
            error: 'Failed to fetch Xero accounts',
            details: error.message,
        });
    }
}
