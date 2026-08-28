import eslint from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist/**', 'graphify-out/**', '.factory/qa-artifacts/**'] },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.ts'],
    languageOptions: { globals: globals.browser }
  },
  {
    files: ['public/sw.js'],
    languageOptions: { globals: globals.serviceworker }
  },
  {
    files: ['e2e/**/*.ts', '*.ts'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } }
  }
);
