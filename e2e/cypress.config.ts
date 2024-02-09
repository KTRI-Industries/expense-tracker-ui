import { defineConfig } from 'cypress';
import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';

const cypressJsonConfig = {
  // fileServerFolder: '.',
  // fixturesFolder: './src/fixtures',
  // video: true,
  // videosFolder: '../../dist/cypress/apps/senik-ui-e2e/videos',
  // screenshotsFolder: '../../dist/cypress/apps/senik-ui-e2e/screenshots',
  // chromeWebSecurity: false,
  // defaultCommandTimeout: 20000,
  // specPattern: 'src/e2e/**/*.cy.{js,jsx,ts,tsx}',
  // supportFile: 'src/support/e2e.ts',
  experimentalRunAllSpecs: true,
};

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__dirname),
    ...cypressJsonConfig,
  },
});
