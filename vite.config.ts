import { defineConfig } from 'vite';
import litCss from 'vite-plugin-lit-css';

export default defineConfig({
  plugins: [litCss({
    // your global and rel="stylesheet" styles must be excluded
    exclude: './src/index.scss'
  })],
  build: {
    target: 'esnext'
  }
});
