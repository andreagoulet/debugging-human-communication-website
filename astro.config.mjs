// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Routes that are noindex (private/funnel pages) — keep them out of the sitemap.
const SITEMAP_EXCLUDE = ['/agenda', '/book', '/discovery-welcome', '/workshop/referred'];

// https://astro.build/config
export default defineConfig({
  site: 'https://www.debugginghumancommunication.com',
  output: 'static',
  adapter: vercel(),
  integrations: [
    sitemap({
      filter: (page) => !SITEMAP_EXCLUDE.some((path) => page.includes(path)),
    }),
  ],
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