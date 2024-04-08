import { defineConfig } from 'tsup';

export default defineConfig({
  format: ['cjs', 'esm'],
  clean: true,
  dts: true,
  entry: ['./index.ts', './src/lib/buildtimeFn.ts', './src/lib/createRuntimeFn.ts'],
  sourcemap: true,
  splitting: false,
});
