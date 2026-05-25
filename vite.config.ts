import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const hfToken = env.HF_ACCESS_TOKEN ?? ''

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        // Keeps HF_ACCESS_TOKEN on the dev server only (not in the client bundle).
        '/hf-api': {
          target: 'https://router.huggingface.co',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/hf-api/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              if (hfToken) {
                proxyReq.setHeader('Authorization', `Bearer ${hfToken}`)
              }
            })
          },
        },
      },
    },
  }
})
