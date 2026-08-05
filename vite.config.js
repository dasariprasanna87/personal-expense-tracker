/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev
export default defineConfig({
  base: "/personal-expense-tracker/",
  plugins: [react(), tailwindcss()],
  // 🌟 ADDED: Testing pipeline configuration for your workspace
  test: {
    globals: true, // Enables test keywords without manual imports in every file
    environment: "jsdom", // Simulates a real Google Chrome/Firefox browser canvas in Node
    setupFiles: "./src/test/setup.js", // Points to your global extensions setup file
  },
});
