/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
export default {
  testMatch: [
    '**/tests/**/*.test.[jt]s?(x)',
    '!**/tests/e2e/**', // Exclude Playwright tests
  ],

  // The paths to modules that run some code to configure or set up the testing environment before each test
  setupFiles: ['fake-indexeddb/auto'],

  // The test environment that will be used for testing
  testEnvironment: 'jsdom',

  // A map from regular expressions to paths to transformers
  transform: {
    '^.+\\.(js|ts)$': 'babel-jest',
  },
};
