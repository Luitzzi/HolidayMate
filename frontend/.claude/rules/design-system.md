---
paths:
  - "src/**/*.tsx"
  - "src/**/*.ts"
---

# Design system conventions

- Follow the design-system source-of-truth rule in CLAUDE.md (tokens.md
  is authoritative for colors, typography, spacing).
- For component props/behavior or the semantic classNames/styles API,
  use the `ant-design-consistency` skill rather than reading
  docs/ant-design-documentation.txt or
  docs/ant-design-semantic-documentation.txt directly — both are too
  large to read whole.
- Prefer Ant Design's semantic classNames/styles API for internal
  styling overrides over generic CSS or deep selectors.