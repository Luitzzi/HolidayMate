---
paths:
  - "src/**/*.tsx"
  - "src/**/*.ts"
---

# Design system conventions

- Read colors, typography, spacing, radius and shadows from `tokens` in
  src/theme/tokens.ts — never from antd's `theme.useToken()` or
  `--ant-*` CSS variables. Principles: docs/design-tokens.md.
- For component props/behavior or the semantic classNames/styles API,
  use the `ant-design-consistency` skill rather than reading
  docs/ant-design-documentation.txt or
  docs/ant-design-semantic-documentation.txt directly — both are too
  large to read whole.
- Prefer Ant Design's semantic classNames/styles API for internal
  styling overrides over generic CSS or deep selectors.