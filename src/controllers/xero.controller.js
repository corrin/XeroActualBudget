import { xero } from '../config/xero.js';

export async function connectXero(req, res) {
  const consentUrl = xero.buildConsentUrl();
  res.redirect(consentUrl);
}

export async function handleCallback(req, res) {
  try {
    const { code } = req.query;
    await xero.apiCallback(code);
    res.send('Successfully connected to Xero!');
  } catch (error) {
    console.error('Error during Xero callback:', error);
    res.status(500).send('Failed to connect to Xero');
  }
}

export async function getAccounts(req, res) {
  try {
    const tenants = await xero.updateTenants();
    const firstTenant = tenants[0];
    const accounts = await xero.accountingApi.getAccounts(firstTenant.tenantId);
    res.json(accounts.body);
  } catch (error) {
    console.error('Error fetching accounts:', error);
    res.status(500).send('Failed to fetch accounts');
  }
}