import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom", // Set the testing environment to jsdom
    globals: true, // Optional: if you prefer global APIs like describe, it, etc.
    setupFiles: "./setupTests.ts", // Optional: if you have setup files
  },
});
