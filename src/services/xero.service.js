// src/services/xero.service.js
import fs from 'fs';
import { xero } from '../config/xero.js';

export async function fetchAllAccounts() {
  const tenants = await xero.updateTenants();

  if (!tenants?.length) {
    throw new Error('No Xero organizations found');
  }

  const response = await xero.accountingApi.getAccounts(tenants[0].tenantId);
  fs.writeFileSync('data/xero_accounts_response.json', JSON.stringify(response.body.accounts, null, 2));
  return response.body.accounts;
}

export async function getActiveAccounts() {
  const accounts = await fetchAllAccounts();
  return accounts.filter(account => account.status === 'ACTIVE');
}

export async function fetchJournals(ifModifiedSince) {
  const tenants = await xero.updateTenants();

  if (!tenants?.length) {
    throw new Error('No Xero organizations found');
  }

  const response = await xero.accountingApi.getJournals(tenants[0].tenantId, undefined, ifModifiedSince);
  return response.body.journals;
}