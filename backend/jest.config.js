module.exports = {
    testEnvironment: "node",
    testMatch: [
        "**/tests/**/*.test.js?(x)"
    ],
    clearMocks: true,
    collectCoverage: false,
    coverageDirectory: "coverage",
    coverageProvider: "v8",
};