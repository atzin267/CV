import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // base: "./"  -> makes the build work both at a domain root and in a subfolder
  // (handy for GitHub Pages project sites). Change to "/<repo-name>/" if needed.
  base: "./",
});
