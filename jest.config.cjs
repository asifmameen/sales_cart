// jest.config.cjs
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/test/setupTests.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  // Avoid CSS import crashes
  moduleNameMapper: {
    "\\.(css|scss|sass|less)$": "identity-obj-proxy"
  },
  // Coverage (you can tweak the globs)
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/main.tsx",
    "!src/**/*.d.ts"
  ],
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", { tsconfig: "tsconfig.test.json" }]
  }
};
