/* eslint-disable */
export default {
  displayName: 'homepage',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  coverageDirectory: '../../coverage/libs/homepage',
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  transformIgnorePatterns: [
    'node_modules/(?!.*\\.mjs$)',
    // '../../node_modules/(?!${ng2-charts})',
  ],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
  /**
   * This is a workaround for the issue:
   *    Details:
   *
   *     C:\dev\WORKSPACE\EXPENSE-TRACKER\expense-tracker-ui\node_modules\lodash-es\lodash.js:10
   *     export { default as add } from './add.js';
   *     ^^^^^^
   *
   *     SyntaxError: Unexpected token 'export'
   */
  moduleNameMapper: {
    '^lodash-es$': 'lodash',
  },
};
