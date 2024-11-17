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
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      './src/constants.ts',
      './src/main.tsx',
      './src/utils/**',
      '.tests/**',
      '.src/client/**',
    ],
    root: './',
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './tests/coverage',
      enabled: true,
      exclude: [
        './src/constants.ts',
        './src/main.tsx',
        './src/utils/**',
        './tests/**',
        './src/client/apollo.ts',
        'postcss.config.cjs',
      ],
    },
  },
});
