import { xero } from '../config/xero.js';

export async function fetchAllAccounts() {
  const tenants = await xero.updateTenants();

  if (!tenants?.length) {
    throw new Error('No Xero organizations found');
  }

  const response = await xero.accountingApi.getAccounts(tenants[0].tenantId);
  return response.body.accounts;
}

export async function getActiveAccounts() {
  const accounts = await fetchAllAccounts();
  return accounts.filter(account => account.status === 'ACTIVE');
}