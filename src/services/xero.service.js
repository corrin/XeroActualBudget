import { xero } from '../config/xero.js';

export async function fetchAllAccounts() {
  const tenants = await xero.updateTenants();
  const firstTenant = tenants[0];
  const response = await xero.accountingApi.getAccounts(firstTenant.tenantId);
  return response.body.accounts;
}

export async function getActiveAccounts() {
  const accounts = await fetchAllAccounts();
  return accounts.filter(account => account.status === 'ACTIVE');
}