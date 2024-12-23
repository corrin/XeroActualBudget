import { XeroClient } from 'xero-node';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const scopes = [
  'offline_access',
  'accounting.transactions.read',
  'accounting.transactions',
  'accounting.journals.read',
  'accounting.settings.read',
  'accounting.contacts.read'
];

export const xero = new XeroClient({
  clientId: process.env.XERO_CLIENT_ID,
  clientSecret: process.env.XERO_CLIENT_SECRET,
  redirectUris: [process.env.XERO_REDIRECT_URI],
  scopes: scopes,
  httpTimeout: 3000,
  httpClient: axios,
});

xero.setTokenSet = (tokenSet) => {
  xero.tokenSet = tokenSet;
};