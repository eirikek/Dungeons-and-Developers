import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/project2',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: 'src/test/setup.ts',
    include: ['tests/**/*.test.tsx'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    root: './',
  },
});
