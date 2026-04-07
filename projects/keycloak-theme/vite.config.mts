import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import { keycloakify } from 'keycloakify/vite-plugin';

const projectRoot = fileURLToPath(new URL('./', import.meta.url));
const tsconfigAppPath = fileURLToPath(new URL('./tsconfig.app.json', import.meta.url));
const sharedThemeEntry = fileURLToPath(
  new URL('../../libs/shared/theme/src/index.ts', import.meta.url),
);

export default defineConfig({
  root: projectRoot,
  build: {
    outDir: '../../dist/keycloak-theme',
    emptyOutDir: true,
    target: ['es2022'],
  },
  resolve: {
    // Keep the Keycloak app aligned with the workspace path aliases used by the
    // main Angular app so shared design-system code resolves the same way.
    alias: {
      '@expense-tracker-ui/shared/theme': sharedThemeEntry,
    },
    mainFields: ['module'],
  },
  plugins: [
    angular({
      tsconfig: tsconfigAppPath,
    }),
    keycloakify({
      themeName: 'expense-tracker',
      accountThemeImplementation: 'none',
      environmentVariables: [{ name: 'UI_THEME', default: 'navy' }],
    }),
  ],
});
