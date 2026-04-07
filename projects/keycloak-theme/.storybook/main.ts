import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/angular';
import { mergeConfig, type UserConfig } from 'vite';

const sharedThemeEntry = fileURLToPath(
  new URL('../../../libs/shared/theme/src/index.ts', import.meta.url),
);

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [],
  framework: {
    name: '@analogjs/storybook-angular',
    options: {},
  },
  async viteFinal(config) {
    return mergeConfig(config as UserConfig, {
      resolve: {
        alias: {
          // Storybook does not automatically reuse the Keycloak Vite config, so
          // monorepo-only aliases need to be re-declared here.
          '@expense-tracker-ui/shared/theme': sharedThemeEntry,
        },
      },
    });
  },
};

export default config;
