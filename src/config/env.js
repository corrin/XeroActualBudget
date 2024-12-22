import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredVars = [
  'XERO_CLIENT_ID',
  'XERO_CLIENT_SECRET',
  'ACTUAL_SERVER_URL',
  'ACTUAL_PASSWORD'
];

// Optional environment variables in development
if (process.env.NODE_ENV !== 'production') {
  requiredVars.push('NGROK_AUTH_TOKEN');
}

const missing = requiredVars.filter(varName => !process.env[varName]);

if (missing.length > 0) {
  console.error('Missing required environment variables:', missing.join(', '));
  console.error('Please check your .env file');
  process.exit(1);
}

// Validate port number
const port = process.env.PORT || 3000;
if (isNaN(port) || port < 1 || port > 65535) {
  console.error('Invalid PORT value:', port);
  console.error('PORT must be a number between 1 and 65535');
  process.exit(1);
}