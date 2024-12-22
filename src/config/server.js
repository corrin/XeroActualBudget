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
  app.use(express.static(join(projectRoot, 'dist')));

  // SPA support - serve index.html for non-API routes
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) {
      next();
      return;
    }
    res.sendFile(join(projectRoot, 'dist', 'index.html'));
  });

  app.use(errorHandler);

  return app;
}