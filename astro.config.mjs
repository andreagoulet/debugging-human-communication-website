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
    // The Communication Lab is now the homepage; keep the old URL working.
    '/communication-lab': '/',
    // Testimonials became the outcomes-first Results page.
    '/testimonials': '/results',
    // Masterclass moved off the root to /masterclass — keep its funnels pointed at it.
    '/sbc-cold': '/masterclass',
    '/sbc-cold/book': '/book',
    '/sbc-warm': '/workshop/referred',
    '/guest-pass': '/workshop/referred',
    '/workshop/new': '/masterclass',
    '/workshop/new/book': '/book',
  },
  vite: {
    plugins: [tailwindcss()]
  }
});