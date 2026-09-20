# Frontend

TypeScript + React application using Ant Design v6 as the design system.

## Commands
- `npm run dev` — start dev server
- `npm run build` — production build/
- `npm test` — run tests
- `npm run lint` — ESLint
- `npm run format` — Prettier

## Design system
ant-d-design-system.md is the source of truth for all design questions.
It defines our token-based design system, built on Ant Design v5. Always
use the colors, typography, and spacing defined there — never invent a
value that isn't defined. If something is missing, say so rather than
guessing.

The component reference and semantic-styling docs in docs/ are large.
Don't read them directly — use the `ant-design-consistency` skill, which
knows how to search them.

## Code conventions
See .claude/rules/typescript-conventions.md and
.claude/rules/design-system.md for language and styling conventions.
