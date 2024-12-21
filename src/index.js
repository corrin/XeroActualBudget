import express from 'express';
import { setupNgrok } from './config/ngrok.js';
import xeroRoutes from './routes/xero.routes.js';
import actualRoutes from './routes/actual.routes.js';
import mappingsRoutes from './routes/mappings.routes.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for development
app.use(cors());
app.use(express.json());

// API routes
app.use('/api', xeroRoutes);
app.use('/api', actualRoutes);
app.use('/api', mappingsRoutes);

// Only serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, '../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../dist/index.html'));
  });
}

async function startServer() {
  try {
    const ngrokUrl = await setupNgrok();
    process.env.XERO_REDIRECT_URI = `${ngrokUrl}/api/callback`;
    
    app.listen(port, () => {
      console.log(`Backend server running at http://localhost:${port}`);
      console.log(`Ngrok URL: ${ngrokUrl}`);
      console.log(`Xero callback URL: ${process.env.XERO_REDIRECT_URI}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();