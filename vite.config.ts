import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import { FelaVueCSS } from './src/vite-transformer';

export default defineConfig({
  root: 'test/app',
  plugins: [
    FelaVueCSS(),
    vue()
  ]
})