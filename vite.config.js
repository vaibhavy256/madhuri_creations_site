import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Vercel builds with no GITHUB_ACTIONS variable, so it gets base "/".
  // GitHub Actions sets GITHUB_ACTIONS=true, so it gets the repo subfolder.
  base: process.env.GITHUB_ACTIONS ? "/madhuri_creations_site/" : "/",
});