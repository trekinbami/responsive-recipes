import { defineConfig } from 'vitest/config';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import path from 'path';

export default defineConfig({
  plugins: [vanillaExtractPlugin()],
  resolve: {
    alias: [
      {
        find: 'responsive-recipes',
        replacement: path.resolve(__dirname, './src/lib/createRuntimeFn')
      }
    ]
  },
  test: {
    include: ['__tests__/**/*.test.ts'],
    globals: true,
    environment: 'node'
  }
});
