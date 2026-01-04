# AGENTS.md

## Project Overview
- Static personal website (EN/JA) hosted on GitHub Pages.
- Content is rendered with pure HTML/CSS/vanilla JS.
- Data is read from Supabase via REST API.

## Key References
- `docs/SPEC.md`: page structure, shared files, and implementation rules.
- `docs/UI_DESIGN_GUIDE.md`: neo‑brutal design rules and components.
- `docs/DESIGN.md`: overall architecture and data model.
- `docs/SUPABASE.md`: DDL, RLS policies, and seed data.

## Conventions
- EN pages live at `/`, JA pages under `/ja/`.
- Use `shared/styles.css`, `shared/app.js`, and `shared/supabase.js` for shared behavior.
- Keep UI in neo‑brutal style: bold borders, single accent color, high contrast.
- Always add `hreflang` for EN/JA pairs and correct `<html lang>`.

## Supabase Notes
- Only `anon` key is allowed in `shared/config.js`.
- RLS must be enabled; public read is `SELECT` with `published = true`.

## Workflow
- Prefer matching existing patterns in `docs/SPEC.md` for new pages.
- Keep JS minimal and page-scoped (`type="module"`).
- Avoid heavy assets; optimize for speed and clarity.
