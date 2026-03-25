import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  /** Đảm bảo đọc `client/.env` dù chạy lệnh từ thư mục nào */
  envDir: path.resolve(__dirname),
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      'logo': path.resolve(__dirname, './src/assets/images/logo.png')
    }
  },
  build: {
    outDir: path.resolve(__dirname, '../server/public/bin'),
    emptyOutDir: true
  }
})
