import { defineConfig } from "vite";
import { compression } from "vite-plugin-compression2";
import viteImagemin from "vite-plugin-imagemin";

export default defineConfig({
  plugins: [
    // Defaults suggested in docs
    viteImagemin({
      gifsicle: {
        optimizationLevel: 7,
        interlaced: false,
      },
      optipng: {
        optimizationLevel: 7,
      },
      mozjpeg: {
        progressive: true,
        quality: 80,
      },
      pngquant: {
        quality: [0.8, 0.9],
        speed: 4,
      },
      svgo: {
        plugins: [
          {
            name: "removeViewBox",
          },
          {
            name: "removeEmptyAttrs",
            active: false,
          },
        ],
      },
    }),
    compression({
      deleteOriginalAssets: true,
      filename: "[path][base]",
    }),
  ],
});
