import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import cssInjectedByJs from 'vite-plugin-css-injected-by-js'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react(), dts({ include: ['src'], rollupTypes: true }), cssInjectedByJs()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
    cssCodeSplit: false,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.mjs', '.js', '.jsx', '.json'],
  },
})
