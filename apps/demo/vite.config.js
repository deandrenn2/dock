import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
export default defineConfig({
    plugins: [react()],
    base: process.env['NODE_ENV'] === 'production' ? '/dock-buttons/' : '/',
    server: {
        port: process.env['PORT'] ? parseInt(process.env['PORT']) : 5173,
        strictPort: true,
    },
    resolve: {
        alias: {
            '@deandre-dock/buttons': resolve(__dirname, '../../packages/core/src/index.ts'),
            '@deandre-dock/shadcn': resolve(__dirname, '../../packages/shadcn/src'),
            '@/lib/utils': resolve(__dirname, './src/lib/utils.ts'),
        },
    },
});
//# sourceMappingURL=vite.config.js.map
