import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '26.197.165.209', // Прослушивание всех сетевых интерфейсов
    port: 3000, // Порт, на котором будет запущен сервер
  },
})