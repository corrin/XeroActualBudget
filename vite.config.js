import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { join } from 'path';

// Get the project root directory
const projectRoot = process.cwd();

export default defineConfig({
  root: 'src/client',
  plugins: [react()],
  build: {
    // Change the build output directory
    outDir: join(projectRoot, 'dist'),
    // Ensure we clear the output directory before building
    emptyOutDir: true,
    // Generate sourcemaps for better debugging
    sourcemap: true
  }
});