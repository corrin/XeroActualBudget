import './config/env.js';
import { configureServer } from './config/server.js';
import { setupNgrok } from './config/ngrok.js';
import xeroRoutes from './routes/xero.routes.js';
import actualRoutes from './routes/actual.routes.js';
import mappingsRoutes from './routes/mappings.routes.js';

const app = configureServer();
const port = process.env.PORT || 3000;

// Configure routes
app.use('/api/xero', xeroRoutes);
app.use('/api/actual', actualRoutes);
app.use('/api/mappings', mappingsRoutes);

async function startServer() {
  try {
    // Setup ngrok - this must succeed for development
    const ngrokUrl = await setupNgrok();
    process.env.XERO_REDIRECT_URI = `${ngrokUrl}/api/xero/callback`;
    console.log('Xero callback URL:', process.env.XERO_REDIRECT_URI);

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();