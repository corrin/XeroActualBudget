import './config/env.js';
import { configureServer } from './config/server.js';
import { setupNgrok } from './config/ngrok.js';
import xeroRoutes from './routes/xero.routes.js';
import actualRoutes from './routes/actual.routes.js';
import mappingsRoutes from './routes/mappings.routes.js';

const app = configureServer();
const port = process.env.PORT || 3000;

app.use('/api/xero', xeroRoutes);
app.use('/api/actual', actualRoutes);
app.use('/api/mappings', mappingsRoutes);

async function startServer() {
  try {
    let serverUrl = `http://localhost:${port}`;
    if (process.env.NODE_ENV === 'development') {
      serverUrl = await setupNgrok();
    }

    app.listen(port, () => {
      console.log(`Server running at ${serverUrl}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();