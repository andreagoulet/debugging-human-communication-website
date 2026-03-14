---
name: generate-webpage
description: Generates new Astro web pages with markdown-driven content, brand-consistent styling, and WCAG 2.1 AA accessibility. Use when creating a new page, adding a page, building a new route, or generating a webpage.
---

STARTER_CHARACTER = 🌐

## Workflow

1. **Clarify** the page's purpose, URL route, and whether it should be indexed by search engines
2. **Create the content markdown file** in the appropriate content collection
3. **Create the Astro page** that consumes the markdown content
4. **Add page-specific styles** via Astro scoped `<style>` blocks (never inline styles)
5. **Verify** accessibility, brand consistency, and that the dev server renders correctly

## Content-first architecture

All page content MUST live in a `.md` file, never hardcoded in `.astro` templates. The `.astro` file is a rendering template only.

### Where content files go

- **Landing pages and standalone pages** (terms, privacy, etc.): `src/content/landing-pages/<slug>.md`
- **Shared content** (reused across pages): `src/content/shared/<feature>/<name>.md`
- **Homepage sections**: `src/content/website/index/<section>.md`

Content files use YAML frontmatter only (no markdown body). The `landing-pages` collection uses `z.any()` in `src/content/config.ts`, so no schema changes are needed for new pages.

### Content file structure

Structure frontmatter to mirror the page's visual sections. For long-form prose pages (legal, policies, articles), use this pattern:

```yaml
---
title: "Page Title"
description: "Meta description for SEO."
hero:
  headline: "Page Heading"
  subtitle: "Optional subtitle"
sections:
  - heading: "Section Heading"
    content:
      - "Paragraph one text with **inline markdown** supported."
      - "Paragraph two."
  - heading: "Another Section"
    content:
      - "More content here."
---
```

For structured pages (forms, multi-section layouts), use descriptive keys that map to visual sections — see `src/content/landing-pages/sbc-cold-booking.md` as a reference.

## Astro page template

Every page follows this skeleton:

```astro
---
import Layout from '../layouts/Layout.astro';
import SiteFooter from '../components/SiteFooter.astro';
import { getCollection } from 'astro:content';
import { formatMarkdown } from '../utils/formatMarkdown';

const footer = (await getCollection('website')).find(e => e.id === 'shared/footer.md')!.data;
const allLandingPages = await getCollection('landing-pages');
const content = allLandingPages.find(e => e.id === '<slug>.md')!.data;
---

<Layout
  title="Page Title | Debugging Human Communication"
  description="Meta description."
  noindex={true}  // set false or omit for public pages
>
  <main>
    <!-- sections here -->
  </main>

  <SiteFooter
    copyright={footer.copyright || ''}
    termsUrl="/terms"
    privacyUrl="/privacy"
  />
</Layout>

<style>
  /* page-specific styles here, using CSS custom properties from global.css */
</style>
```

Key rules:
- Use `formatMarkdown()` with `set:html` for any text that may contain inline markdown
- Use `<Layout>` for `<head>`, meta tags, and OG data
- Use `<SiteFooter>` for the footer (pull data from the shared footer content)
- Set `noindex={true}` for pages that should not appear in search results

## Styling rules

### No inline styles
Never use `style="..."` attributes on HTML elements.

### Use existing utility classes from global.css
- Layout: `.section`, `.container-lg`, `.container-md`, `.container-sm`, `.container-xs`
- Typography: `.heading-hero`, `.heading-section`, `.heading-card`
- Buttons: `.btn-primary`, `.btn-primary-sm`, `.btn-primary-lg`
- Cards: `.card`, `.card-compact`, `.card-featured`, `.card-simple`

### Brand colors (Tailwind classes)
- Primary text: `text-teal-950` (#003640), `text-teal-900` (#012B34)
- Backgrounds: `bg-teal-50` (#F6F6F6), `bg-white`, `bg-teal-200` (#C8EDE4)
- Gradients: `bg-gradient-to-b from-teal-200 to-teal-50` (hero sections)
- Accent: `text-coral`, `bg-coral`

### Contrast-safe text pairings
CRITICAL: `teal-800` (#05A8A7) fails WCAG AA on ALL backgrounds in this palette. Never use it for text or links. Always verify contrast ratios against the actual hex values in `global.css` — the custom brand palette does NOT follow standard Tailwind darkness ordering.

Safe pairings (all pass WCAG AA normal text 4.5:1):
- `teal-950` on `white` — 13.1:1
- `teal-900` on `white` — 15.0:1
- `teal-950` on `teal-50` — 12.1:1
- `teal-900` on `teal-50` — 13.9:1
- `teal-950` on `teal-200` — 10.4:1
- `teal-900` on `teal-200` — 11.9:1

Unsafe (FAIL):
- `teal-800` on `white` — 2.9:1
- `teal-800` on `teal-50` — 2.7:1
- `teal-800` on `teal-200` — 2.3:1

### Page-specific styles
Use Astro scoped `<style>` blocks at the bottom of the `.astro` file. Reference CSS custom properties from `global.css` (e.g., `var(--color-teal-900)`).

### Prose content sections
For sections with long-form text, use this proven pattern:

```html
<div class="container-sm prose prose-teal max-w-none">
  <!-- rendered content -->
</div>
```

Or for custom prose styling:

```html
<div class="container-sm">
  <div class="prose-custom">
    <!-- paragraphs rendered with formatMarkdown -->
  </div>
</div>
```

With a scoped style block:

```css
.prose-custom p {
  font-size: 1.125rem;
  line-height: 1.75rem;
  color: var(--color-teal-900);
  margin-bottom: 1.25rem;
}
.prose-custom strong {
  color: var(--color-teal-950);
}
```

## Accessibility (WCAG 2.1 AA)

These are non-negotiable. Verify every one before considering the page complete.

- **Color contrast**: 4.5:1 for normal text, 3:1 for large text. The brand teal palette has custom values — check `global.css`, not default Tailwind.
- **Heading hierarchy**: One `<h1>` per page, sequential `<h2>` > `<h3>` (no skipping levels)
- **Semantic HTML**: Use `<main>`, `<section>`, `<nav>`, `<footer>` landmarks appropriately
- **Links**: Must have descriptive text (not "click here"). External links: underline + hover state
- **Lists**: Use `<ul>`/`<ol>` for list content, never visual-only bullets
- **Focus indicators**: All interactive elements must be keyboard-accessible
- **Images**: Meaningful `alt` text (or `alt=""` if decorative)
- **Language**: `<html lang="en">` is set in Layout — do not override

## Anti-patterns

- Hardcoding content strings in `.astro` files
- Using `style="..."` inline attributes
- Skipping the `<Layout>` wrapper
- Forgetting `set:html={formatMarkdown(...)}` for markdown-containing text
- Creating pages without a corresponding content `.md` file
- Using default Tailwind color values instead of the custom brand palette in `global.css`
