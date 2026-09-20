---
name: ant-design-consistency
description: Use when writing, reviewing, or restyling Ant Design v5
  components for token consistency, correct component APIs, or semantic
  styling. Covers component props/behavior and internal styling targets.
---

## Source of truth for styling
docs/ant-d-design-system.md is the source of truth for colors,
typography, and spacing — it's small, read it directly. Never invent a
value that isn't defined there; if something is missing, say so.

## Component behavior
For props, variants, or behavior, search
docs/ant-design-documentation.txt for the specific component name.
Do not read the whole file — it is ~63,000 lines.

## Semantic styling (internals)
For customizing a component's internals — targeting a specific part
like icon, title, or actions instead of the whole component — search
docs/ant-design-semantic-documentation.txt for that component's semantic
parts, and prefer the classNames/styles API over generic CSS overrides.

If a component isn't covered in the semantic doc, it may not expose this
API yet — say so rather than assuming you missed it.