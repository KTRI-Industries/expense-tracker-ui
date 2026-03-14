const nxPreset = require('@nx/jest/preset').default;

module.exports = {
  ...nxPreset,
  collectCoverageFrom: [
    'src/**/*.{ts,js}',
    '!**/node_modules/**',
    '!**/vendor/**',
    '!**/index.ts',
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/libs/shared/api/',
  ],
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$|keycloak-js|keycloak-angular|lodash-es|ng2-charts)'],
};
