module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ['**/test/**/*test.ts'],
  setupFiles: [
    '<rootDir>/test/env-setup.js',
    '<rootDir>/test/cocos2d-js.js',
  ],
};