import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { errorHandler } from '../middleware/errorHandler.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '../..');

export function configureServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Always serve static files from the dist directory
  const distPath = join(projectRoot, 'dist');
  console.log('Serving static files from:', distPath);

  app.use(express.static(distPath));

  // API routes will be added in index.js

  // Serve index.html for all non-API routes (SPA support)
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) {
      next();
      return;
    }
    res.sendFile(join(distPath, 'index.html'));
  });

  // Error handling middleware should be last
  app.use(errorHandler);

  return app;
}