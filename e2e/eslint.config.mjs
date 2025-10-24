import baseConfig from '../eslint.base.config.mjs';
import pluginCypress from 'eslint-plugin-cypress';

export default [
  {
    ignores: ['**/dist'],
  },
  ...baseConfig,
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    ...pluginCypress.configs.recommended,
  },
];
