// src/services/xero.service.js
import { xero } from '../config/xero.js';
import fs from 'fs';

const tokenFile = './data/tokenSet.json';

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

export async function saveTokenSet(tokenSet) {
  fs.writeFileSync(tokenFile, JSON.stringify(tokenSet, null, 2));
}

export async function loadTokenSet() {
  if (fs.existsSync(tokenFile)) {
    const tokenData = fs.readFileSync(tokenFile);
    xero.setTokenSet(JSON.parse(tokenData));
  } else {
    console.log('No saved token set found.');
  }
}