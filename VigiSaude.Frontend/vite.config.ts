import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Important for GitHub Pages when deploying under a repository subpath
  // In dev we keep "/"; in production we set the repo name subpath
  base: mode === "development" ? "/" : "/vigi-saude/",
  server: {
    host: "::",
    port: 4200,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
