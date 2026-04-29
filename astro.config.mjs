// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.debugginghumancommunication.com',
  output: 'static',
  adapter: vercel(),
  redirects: {
    '/community': 'https://app.heartbeat.chat/debugginghumancommunication/invitation?code=J3524G',
    '/discovery': 'https://calendly.com/andreagoulet/discovery-session',
    '/sbc-cold': '/',
    '/sbc-cold/book': '/book',
    '/sbc-warm': '/workshop/referred',
    '/guest-pass': '/workshop/referred',
    '/workshop/new': '/',
    '/workshop/new/book': '/book',
  },
  vite: {
    plugins: [tailwindcss()]
  }
});