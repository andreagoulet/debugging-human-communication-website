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

## Accessibility

All components and content must conform to WCAG 2.1 AA standards:

- **Color contrast:** Text must meet minimum contrast ratios (4.5:1 for normal text, 3:1 for large text). The brand palette has custom teal values — always verify contrast against `global.css` definitions, not default Tailwind colors.
- **Semantic HTML:** Use appropriate heading hierarchy, landmark elements, and ARIA attributes.
- **Interactive elements:** Buttons and links must have accessible names. Icons that are decorative use `aria-hidden="true"`. Icons that convey meaning need accessible text.
- **Images:** All images must have meaningful `alt` text (or `alt=""` if purely decorative).
- **Focus management:** Interactive elements must be keyboard-accessible with visible focus indicators.

When creating or modifying any component, verify accessibility before considering the task complete.

## Two-repo architecture

This website repo has a sibling **backend repo** at `/Users/Andrea/src/debugging-human-communication/` containing:

- Client data, session notes, coaching skills
- Cloudflare Workers (webhook receivers, form backends, scheduled jobs)
- Automation scripts (Drive delivery, transcript processing, etc.)
- Business planning docs

**Routing tasks by repo:**

| Work type | Repo |
|---|---|
| Landing pages, Astro components, styling, marketing copy | this repo |
| Cloudflare Workers, form backends, automation scripts | coaching repo |
| Skills, session notes, client data, coaching content | coaching repo |
| Planning docs for anything business-wide | coaching repo |

**Cross-repo coordination rules:**

- When a task spans both repos (e.g., a new landing page + Worker backend), make changes in both in the same session.
- **Commit separately in each repo** — never try to commit cross-repo changes as one. `git` in this repo only sees this repo's working tree.
- For coaching-repo changes, `cd /Users/Andrea/src/debugging-human-communication && git ...`.
- In end-of-task summaries, name which commit landed in which repo.
- When a task is ambiguous ("build a fit-call form"), state which repo(s) you're touching before starting.

## Rules
- Follow instructions in each skill's `SKILL.md`
- Never manually read files in `.claude/skills/`. If a task matches a skill's description, invoke it via the Skill tool. If you find yourself reading `SKILL.md` directly, stop and use the Skill tool instead.
- Ask strategic and clarifying questions one at a time.

