import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  output: 'server',
    adapter: cloudflare({
    imageService: 'compile',
    platformProxy: {
      // 在 Windows 开发环境下禁用代理以防止 workerd 崩溃
      enabled: false,
    },
  }),
  integrations: [tailwind()],
  server: {
    host: true, // 确保服务器监听所有网络接口
  }
});