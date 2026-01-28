export default {
  testEnvironment: "node",
  transform: {},
  moduleFileExtensions: ["js", "mjs"],
  testMatch: ["**/__tests__/**/*.test.js", "**/*.test.js"],
  setupFilesAfterEnv: ["./src/__tests__/setup.js"],
  testTimeout: 30000,
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
};
