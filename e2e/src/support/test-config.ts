const CONFIG_KEYS = {
  KEYCLOAK_URL: 'keycloakUrl',
  KEYCLOAK_REALM: 'keycloakRealm',
  KEYCLOAK_CLIENT_ID: 'keycloakClientId',
  API_BASE_URL: 'apiBaseUrl',
  TEST_USERNAME: 'ownerUsername',
  TEST_PASSWORD: 'ownerPassword',
  TEST_USER_EMAIL: 'invitedUserEmail',
  TEST_GUEST_USERNAME: 'guestUsername',
  TEST_GUEST_EMAIL: 'guestEmail',
} as const;

type TestConfigKey = (typeof CONFIG_KEYS)[keyof typeof CONFIG_KEYS];

const readConfiguredEnv = (name: TestConfigKey): string => {
  const value = Cypress.env(name);

  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(
      `Missing Cypress env "${name}". Configure it in e2e/cypress.config.ts or override it with a CYPRESS_* environment variable.`,
    );
  }

  return value;
};

export const KEYCLOAK_URL = readConfiguredEnv(CONFIG_KEYS.KEYCLOAK_URL);
export const KEYCLOAK_REALM = readConfiguredEnv(CONFIG_KEYS.KEYCLOAK_REALM);
export const KEYCLOAK_CLIENT_ID = readConfiguredEnv(
  CONFIG_KEYS.KEYCLOAK_CLIENT_ID,
);
export const API_BASE_URL = readConfiguredEnv(CONFIG_KEYS.API_BASE_URL);

export const TEST_USERNAME = readConfiguredEnv(CONFIG_KEYS.TEST_USERNAME);
export const TEST_PASSWORD = readConfiguredEnv(CONFIG_KEYS.TEST_PASSWORD);
export const TEST_USER_EMAIL = readConfiguredEnv(CONFIG_KEYS.TEST_USER_EMAIL);

export const TEST_GUEST_USERNAME = readConfiguredEnv(
  CONFIG_KEYS.TEST_GUEST_USERNAME,
);
export const TEST_GUEST_EMAIL = readConfiguredEnv(CONFIG_KEYS.TEST_GUEST_EMAIL);
