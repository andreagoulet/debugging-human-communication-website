# CLAUDE.md

Astro marketing website for "Debugging Human Communication" - a communication coaching program for engineers and technical professionals.

## Commands

```bash
npm run dev      # Dev server at localhost:4321
npm run build    # Build to ./dist/
npm run preview  # Preview production build
```

## Architecture

- **Framework:** Astro 5 + TypeScript (strict) + Tailwind CSS 4
- **Deploy:** Vercel

### Key Directories

- `src/content/homepage/` - Page content as numbered markdown files (01-12). Edit frontmatter only, no body content.
- `src/components/` - Reusable Astro components (cards, testimonials, FAQ items)
- `src/pages/index.astro` - Main page that assembles all content sections
- `src/styles/global.css` - Tailwind config with brand color theme

## Content Editing

All page content lives in `src/content/homepage/*.md` files using Zod-validated frontmatter. The schema is defined in `src/content/homepage/config.ts`.

## Conventions

- Use `formatMarkdown()` from `src/utils/formatMarkdown.ts` for inline markdown (*italic*, **bold**)
- Brand colors: teal, coral, yellow, purple, green, blue (defined in global.css)
- Utility classes: `.btn-primary`, `.section`, `.container-*`, `.heading-*`

## Rules
- Follow instructions in each skill's `SKILL.md`
- Never manually read files in `.claude/skills/`. If a task matches a skill's description, invoke it via the Skill tool. If you find yourself reading `SKILL.md` directly, stop and use the Skill tool instead.

