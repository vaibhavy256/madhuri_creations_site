import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // GitHub Actions sets GITHUB_ACTIONS=true -> repo subfolder. Vercel/local get "/".
  base: process.env.GITHUB_ACTIONS ? "/madhuri_creations_site/" : "/",
});
