import { defineConfig } from 'vite'
import react from '@vitejs/react-refresh' // Or @vitejs/plugin-react

export default defineConfig({
  plugins: [react()], // No tailwindcss() here for v3!
})