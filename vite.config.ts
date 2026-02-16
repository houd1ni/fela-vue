import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import felaVuePlugin from './test/app/vite-transformer';

export default defineConfig({
  root: 'test/app',
  plugins: [
    felaVuePlugin(),
    vue()
  ]
})