# Skill Registry

**Delegator use only.** Any agent that launches sub-agents reads this registry to resolve compact rules, then injects them directly into sub-agent prompts. Sub-agents do NOT read this registry or individual SKILL.md files.

See `_shared/skill-resolver.md` for the full resolution protocol.

## User Skills

| Trigger | Skill | Path |
|---------|-------|------|
| "AI SDK", "Vercel AI SDK", "generateText", "streamText", "build an agent", "tool calling", "useChat" | ai-sdk | .agents/skills/ai-sdk/SKILL.md |
| "shadcn init", "create an app with --preset", "switch to --preset", components.json present | shadcn | .agents/skills/shadcn/SKILL.md |
| Next.js best practices, file conventions, RSC boundaries, data patterns, async APIs, metadata, error handling | next-best-practices | .agents/skills/next-best-practices/SKILL.md |
| Setting up new Next.js project, deciding component placement, implementing Server Actions, layouts, route groups | architect-nextjs | .agents/skills/architect-nextjs/SKILL.md |
| Writing, reviewing, or refactoring React/Next.js code for performance, bundle optimization | vercel-react-best-practices | .agents/skills/vercel-react-best-practices/SKILL.md |
| Next.js 16 Cache Components, PPR, use cache directive, cacheLife, cacheTag, updateTag | next-cache-components | .agents/skills/next-cache-components/SKILL.md |
| Build web components, pages, artifacts, landing pages, dashboards, styling/beautifying UI | frontend-design | .agents/skills/frontend-design/SKILL.md |
| Dashboards, admin panels, SaaS apps, tools, settings pages, data interfaces | interface-design | .agents/skills/interface-design/SKILL.md |
| UI polish, component design, animation decisions, invisible details, design engineering | emil-design-eng | .agents/skills/emil-design-eng/SKILL.md |
| Brand colors, style guidelines, visual formatting, company design standards | brand-guidelines | .agents/skills/brand-guidelines/SKILL.md |
| UI/UX design intelligence, color palettes, font pairings, accessibility, interaction patterns | ui-ux-pro-max | .agents/skills/ui-ux-pro-max/SKILL.md |
| Styling artifacts with themes, slides, docs, HTML landing pages | theme-factory | .agents/skills/theme-factory/SKILL.md |
| Review UI code for Web Interface Guidelines compliance, check accessibility, audit design | web-design-guidelines | .agents/skills/web-design-guidelines/SKILL.md |
| Edit existing marketing copy, review copy, proofread, polish, tighten messaging | copy-editing | .agents/skills/copy-editing/SKILL.md |
| Write marketing copy, landing pages, pricing pages, CTA copy, value proposition | copywriting | .agents/skills/copywriting/SKILL.md |
| "find a skill for X", "is there a skill for", extending agent capabilities | find-skills | .agents/skills/find-skills/SKILL.md |

## Compact Rules

### ai-sdk
- Do NOT trust internal knowledge about AI SDK — always verify against `node_modules/ai/docs/` or ai-sdk.dev
- Always use `ToolLoopAgent` pattern for creating agents
- Use `InferAgentUIMessage<typeof agent>` for type-safe tool results with `useChat`
- Use Vercel AI Gateway provider by default unless user specifies otherwise
- Always fetch current model IDs via curl — never use model IDs from memory
- Be minimal — only specify options that differ from defaults
- Run typecheck after changes to ensure code is correct
- Check `references/common-errors.md` before debugging type errors

### shadcn
- Use existing components first — check `npx shadcn@latest info` before writing custom UI
- `className` for layout only — never override component colors or typography
- No `space-x-*` or `space-y-*` — use `flex` with `gap-*`
- Forms use `FieldGroup` + `Field`, never raw `div` with `space-y-*`
- Dialog, Sheet, Drawer always need a Title for accessibility
- Icons in Button use `data-icon`, no sizing classes inside components
- Use semantic tokens (`bg-background`, `text-muted-foreground`), never raw hex values
- Use `cn()` for conditional classes, not manual template literal ternaries
- Always run `npx shadcn@latest docs <component>` and fetch URLs before creating/fixing components
- After adding components, always read added files and verify correctness

### next-best-practices
- Server Components by default, add `'use client'` only for interactivity/hooks/state
- Use `next/image` over `<img>`, `next/font` over Google Fonts link tags
- Async `params` and `searchParams` in Next.js 15+ — must await
- Use Suspense boundaries for streaming content, avoid awaiting in async components before JSX
- `'use cache'` directive replaces `unstable_cache` in Next.js 16
- Server Actions need authentication inside the action, not just middleware
- Avoid barrel file imports — Next.js transforms them automatically for lucide-react
- Use `next/dynamic` for heavy components not needed on initial render (e.g., Monaco)

### architect-nextjs
- Scope Rule: code used by 1 feature → MUST stay local (`_components/`); 2+ features → MUST go to `src/shared/`
- Use Route Groups `(feature)` for top-level modules — screaming architecture
- Server Components default; Client Components ONLY for `useState`, `useEffect`, event listeners
- Server Actions for mutations — place in `_actions/name.ts`
- Never pollute `shared` with single-use components
- Colocate specific hooks/types/styles next to the consuming component

### vercel-react-best-practices
- Eliminate waterfalls: start independent promises early, await late — use `Promise.all()`
- Defer await into branches where actually used; check cheap sync conditions before async flags
- Use Suspense boundaries to stream content, don't block entire page on one fetch
- Don't define components inside components — causes remount on every render
- Use functional setState updates to prevent stale closures
- Lazy state initialization: pass function to `useState` for expensive values
- Calculate derived state during rendering, not in effects
- Hoist static JSX outside components to avoid re-creation
- Use `toSorted()` instead of `sort()` for immutability in React

### next-cache-components
- Enable with `cacheComponents: true` in next.config (replaces `experimental.ppr`)
- Three content types: Static (auto-prerendered), Cached (`'use cache'`), Dynamic (Suspense)
- Cannot access `cookies()`, `headers()`, `searchParams` inside `'use cache'` — pass as arguments
- Use `cacheTag()` to tag cached content, `updateTag()` for immediate invalidation
- `revalidateTag()` for background stale-while-revalidate behavior
- Cache keys are automatic: build ID + function hash + serializable arguments + closure variables
- `'use cache: private'` allows runtime APIs for compliance requirements

### frontend-design
- Choose a clear, BOLD aesthetic direction before coding — not generic AI aesthetics
- Avoid overused fonts (Inter, Roboto, Arial) — pick distinctive, characterful typefaces
- Commit to cohesive color palettes using CSS variables
- Prioritize CSS-only animations; use Motion library for React when available
- One well-orchestrated page load with staggered reveals > scattered micro-interactions
- Match implementation complexity to aesthetic vision — maximalism needs elaborate code, minimalism needs precision
- Interpret creatively — no two designs should be the same

### interface-design
- Intent first: who is this human, what must they accomplish, what should it feel like — with specifics
- Explore domain concepts, color world, signature element, and defaults BEFORE proposing direction
- Subtle layering: surface elevation with whisper-quiet shifts, borders with low-opacity rgba
- Build text hierarchy (primary/secondary/tertiary/muted), border progression, and control tokens
- Pick ONE depth approach and commit: borders-only, subtle shadows, layered shadows, or surface color shifts
- Every interactive element needs states: default, hover, active, focus, disabled
- Run swap test, squint test, signature test, and token test before presenting output

### emil-design-eng
- Never animate keyboard-initiated actions (used 100+ times/day) — no animation ever
- Use custom easing curves: `cubic-bezier(0.23, 1, 0.32, 1)` for ease-out, not built-in CSS easings
- Never use `ease-in` for UI animations — feels sluggish
- UI animations stay under 300ms; button press feedback 100-160ms
- Never animate from `scale(0)` — start from `scale(0.95)` with `opacity: 0`
- Popovers use origin-aware transform-origin (not center); modals are exempt
- Buttons must have `transform: scale(0.97)` on `:active` for responsive feel
- Use CSS transitions over keyframes for interruptible UI
- Only animate `transform` and `opacity` for GPU-accelerated performance
- Review UI code using Before/After markdown table format

### brand-guidelines
- Headings: Poppins font (Arial fallback); Body: Lora font (Georgia fallback)
- Dark: `#141413`, Light: `#faf9f5`, Mid Gray: `#b0aea5`, Light Gray: `#e8e6dc`
- Accent colors: Orange `#d97757`, Blue `#6a9bcc`, Green `#788c5d`
- Applies to artifacts that benefit from Anthropic look-and-feel

### ui-ux-pro-max
- Accessibility CRITICAL: contrast 4.5:1, alt text, keyboard nav, aria-labels, focus states
- Touch targets minimum 44×44pt with 8px+ spacing
- Animation duration 150-300ms for micro-interactions, transform/opacity only
- Mobile-first design, minimum 16px body text, no horizontal scroll
- Semantic color tokens (not raw hex), meaningful empty states, skeleton loading
- Use `--design-system` flag for comprehensive design system recommendations
- No emojis as structural icons — use SVG/icon libraries

### theme-factory
- 10 pre-set themes available: Ocean Depths, Sunset Boulevard, Forest Canopy, Modern Minimalist, Golden Hour, Arctic Frost, Desert Rose, Tech Innovation, Botanical Garden, Midnight Galaxy
- Show `theme-showcase.pdf` for visual selection before applying
- Each theme includes cohesive color palette with hex codes and complementary font pairings

### web-design-guidelines
- Fetch latest guidelines from vercel-labs/web-interface-guidelines before each review
- Check accessibility, contrast, focus states, semantic HTML, keyboard navigation
- Output findings in terse `file:line` format

### copy-editing
- Seven Sweeps Framework: Clarity → Voice/Tone → So What → Prove It → Specificity → Heightened Emotion → Zero Risk
- Cut weak intensifiers (very, really, extremely), filler (just, actually, basically)
- Replace corporate speak: utilize→use, leverage→use, facilitate→help, innovative→new
- One idea per sentence, vary sentence length, front-load important information
- After each sweep, loop back to verify previous sweeps aren't compromised

### copywriting
- Clarity over cleverness, benefits over features, specificity over vagueness
- Customer language over company language — mirror voice-of-customer
- Headline formulas: "{Achieve outcome} without {pain point}", "The {category} for {audience}"
- Strong CTAs: action verb + what they get — avoid "Submit", "Sign Up", "Learn More"
- One primary action per page, single message for landing pages
- Simple over complex: "use" not "utilize", active over passive, confident over qualified

### find-skills
- Use `npx skills find [query]` to search ecosystem, `npx skills add <package>` to install
- Check skills.sh leaderboard before CLI search
- Verify quality: prefer 1K+ installs, official sources (vercel-labs, anthropics, microsoft)
- Present options with name, description, install count, and install command

## Project Conventions

| File | Path | Notes |
|------|------|-------|
| AGENTS.md | AGENTS.md | Index — Ultracite code standards, references conventions below |
| Ultracite/Biome config | biome.jsonc | Extends ultracite/biome/core and ultracite/biome/next |
| TypeScript config | tsconfig.json | strict mode, ES2017 target, path aliases @/* |
| Next.js config | next.config.mjs | Minimal config, no custom settings |
| shadcn config | components.json | base-mira style, RSC true, Tailwind v4, lucide icons |
| Claude instructions | .claude/CLAUDE.md | Duplicate of AGENTS.md |
| Gemini instructions | GEMINI.md | Duplicate of AGENTS.md |

Read the convention files listed above for project-specific patterns and rules. All referenced paths have been extracted — no need to read index files to discover more.
