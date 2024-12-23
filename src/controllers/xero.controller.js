import { xero } from '../config/xero.js';

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
    if (!xero.tokenSet?.access_token) {
      return res.status(401).json({
        error: 'Not authenticated with Xero',
        details: 'Please connect to Xero first'
      });
    }

    const tenants = await xero.updateTenants();

    if (!tenants?.length) {
      throw new Error('No Xero organizations found');
    }

    const response = await xero.accountingApi.getAccounts(tenants[0].tenantId);

    // Filter out bank accounts and sort by group then name
  const accounts = response.body.accounts
        //.filter(account => account.type !== 'BANK')  // Better to include everything and map it to ignore
        .sort((a, b) => {
          if (a.type !== b.type) {
            return a.type.localeCompare(b.type);
          }
          return a.name.localeCompare(b.name);
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