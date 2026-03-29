import { defineConfig } from 'cypress';
import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';

const cypressJsonConfig = {
  // fileServerFolder: '.',
  // fixturesFolder: './src/fixtures',
  // video: true,
  // videosFolder: '../../dist/cypress/apps/senik-ui-e2e/videos',
  // screenshotsFolder: '../../dist/cypress/apps/senik-ui-e2e/screenshots',
  chromeWebSecurity: false,
  // defaultCommandTimeout: 20000,
  // specPattern: 'src/e2e/**/*.cy.{js,jsx,ts,tsx}',
  // supportFile: 'src/support/e2e.ts',
  experimentalRunAllSpecs: true,
  defaultCommandTimeout: 10000,
  requestTimeout: 10000,
  env: {
    keycloakUrl:
      process.env['CYPRESS_KEYCLOAK_URL'] ??
      'https://keycloak.127.0.0.1.nip.io:8443',
    mailhogUrl:
      process.env['CYPRESS_MAILHOG_URL'] ?? 'https://mailhog.127.0.0.1.nip.io',
    ownerUsername: process.env['CYPRESS_OWNER_USERNAME'] ?? 'test_user',
    ownerPassword: process.env['CYPRESS_OWNER_PASSWORD'] ?? 'open123',
    invitedUserEmail:
      process.env['CYPRESS_INVITED_USER_EMAIL'] ?? 'test@test.com',
    guestUsername: process.env['CYPRESS_GUEST_USERNAME'] ?? 'test_admin',
    guestEmail:
      process.env['CYPRESS_GUEST_EMAIL'] ?? 'test_admin@email.com',
  },
};

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__dirname),
    ...cypressJsonConfig,
    // Please ensure you use `cy.origin()` when navigating between domains and remove this option.
    // See https://docs.cypress.io/app/references/migration-guide#Changes-to-cyorigin
    injectDocumentDomain: true,
  },
});
