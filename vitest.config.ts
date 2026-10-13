import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: { include: ['tests/unit/**/*.test.ts'] },
  // fileURLToPath produce una ruta válida también en Windows (pathname daría "/C:/...").
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
});
