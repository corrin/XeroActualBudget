import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { errorHandler } from '../middleware/errorHandler.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export function configureServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Serve static files in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(join(__dirname, '../../dist')));
    app.get('/', (req, res) => {
      res.sendFile(join(__dirname, '../../dist/index.html'));
    });
  } else {
    // In development, redirect root to Vite dev server
    app.get('/', (req, res) => {
      res.redirect('http://localhost:5173');
    });
  }

  // Error handling middleware should be last
  app.use(errorHandler);

  return app;
}