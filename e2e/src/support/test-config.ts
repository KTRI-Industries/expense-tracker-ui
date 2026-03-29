const readEnv = (name: string, fallback: string): string =>
  (Cypress.env(name) as string | undefined) ?? fallback;

export const KEYCLOAK_URL = readEnv(
  'keycloakUrl',
  'https://keycloak.127.0.0.1.nip.io:8443',
);
export const KEYCLOAK_REALM = readEnv('keycloakRealm', 'expense-tracker-realm');
export const KEYCLOAK_CLIENT_ID = readEnv(
  'keycloakClientId',
  'expense-tracker-ui',
);
export const MAILHOG_URL = readEnv(
  'mailhogUrl',
  'https://mailhog.127.0.0.1.nip.io',
);
export const API_BASE_URL = readEnv('apiBaseUrl', 'http://localhost:8080');

export const TEST_USERNAME = readEnv('ownerUsername', 'test_user');
export const TEST_PASSWORD = readEnv('ownerPassword', 'open123');
export const TEST_USER_EMAIL = readEnv('invitedUserEmail', 'test@test.com');

export const TEST_GUEST_USERNAME = readEnv('guestUsername', 'test_admin');
export const TEST_GUEST_EMAIL = readEnv(
  'guestEmail',
  `${TEST_GUEST_USERNAME}@email.com`,
);
