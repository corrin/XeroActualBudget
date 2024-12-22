import { XeroClient } from 'xero-node';
import dotenv from 'dotenv';

dotenv.config();

const scopes = [
  'offline_access',
  'accounting.transactions.read',
  'accounting.transactions',
  'accounting.journals.read',
  'accounting.settings.read',
  'accounting.contacts.read'
];

// Initialize Xero client with explicit configuration
export const xero = new XeroClient({
  clientId: process.env.XERO_CLIENT_ID,
  clientSecret: process.env.XERO_CLIENT_SECRET,
  redirectUris: [process.env.XERO_REDIRECT_URI],
  scopes: scopes,
  state: 'returnToHome', // Add a state parameter for security
  httpTimeout: 3000, // Increase timeout
  grantType: 'authorization_code'
});

// Add helper methods
xero.setTokenSet = (tokenSet) => {
  xero.tokenSet = tokenSet;
  console.log('Token set stored successfully');
};