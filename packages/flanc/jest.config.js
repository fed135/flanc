module.exports = {
    collectCoverageFrom: [
      '<rootDir>/src/**/*.ts*',
      '!<rootDir>/node_modules/',
    ],
    coverageThreshold: {
      global: {
        branches: 50,
        functions: 45,
        lines: 50,
        statements: 50,
      },
    },
    globals: {
      'ts-jest': {
        diagnostics: false,
        isolatedModules: true,
        tsConfig: '<rootDir>/tsconfig.json',
      },
    },
    modulePathIgnorePatterns: [
      '<rootDir>/node_modules/',
    ],
    preset: 'ts-jest',
    testEnvironment: 'node',
  };
  