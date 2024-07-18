const nxPreset = require('@nx/jest/preset').default;

module.exports = {
  ...nxPreset,
  collectCoverageFrom: [
    'src/**/*.{ts,js}',
    '!**/node_modules/**',
    '!**/vendor/**',
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/libs/api/',
  ]
};
