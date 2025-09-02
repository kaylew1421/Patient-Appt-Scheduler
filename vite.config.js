import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
plugins: [react()],
server: {
port: 5173,
host: true,
// Proxy API calls to your Express backend during dev (optional)
proxy: {
'/api': 'http://localhost:3000'
}
},
build: { outDir: 'dist' }
})