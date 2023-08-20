import { defineConfig } from "vite";
import viteCompression from "vite-plugin-compression";

export default defineConfig({
  plugins: [
    viteCompression({
      // Might want to delete origin file when building to deploy to S3
      deleteOriginFile: false,
      filter: /\.(js|mjs|json|css|html)$/i,
    }),
  ],
});
