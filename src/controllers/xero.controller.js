import { xero } from '../config/xero.js';

export async function connectXero(req, res) {
  try {
    const consentUrl = await xero.buildConsentUrl();
    console.log('Generated Consent URL:', consentUrl); // Log the full URL
    res.redirect(consentUrl);
  } catch (error) {
    console.error('Error redirecting to Xero login:', error);
    res.status(500).send('Failed to redirect to Xero login');
  }
}

export async function handleCallback(req, res) {
  try {
    const { code } = req.query;
    const tokenSet = await xero.apiCallback(code);
    console.log('Token Set:', tokenSet);
    xero.tokenSet = tokenSet; // Ensure token is explicitly stored in the xero instance
    res.send('Successfully connected to Xero!');
  } catch (error) {
    console.error('Error during Xero callback:', error);
    res.status(500).send('Failed to connect to Xero');
  }
}

export async function getAccounts(req, res) {
  try {
    // Ensure the Xero token is set
    if (!xero.tokenSet || !xero.tokenSet.access_token) {
      return res.status(401).json({ error: 'No valid token available. Please log in.' });
    }

    // Proceed with fetching accounts
    const tenants = await xero.updateTenants();
    const firstTenant = tenants[0];
    const accounts = await xero.accountingApi.getAccounts(firstTenant.tenantId);
    res.json(accounts.body);
  } catch (error) {
    console.error('Error fetching accounts:', error);
    res.status(500).send('Failed to fetch accounts');
  }
}
