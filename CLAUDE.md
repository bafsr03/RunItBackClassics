# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

This is the **Horizon theme v3.5.1** (by Shopify) exported from the `runitbackclassics.myshopify.com` store. It is a standard Shopify theme — no build step, no package.json. Files are edited directly and pushed to Shopify via the CLI.

## Development Commands

```bash
# Serve theme locally against the live store (requires Shopify CLI)
shopify theme dev --store runitbackclassics.myshopify.com

# Push changes to store (default: unpublished theme)
shopify theme push --store runitbackclassics.myshopify.com

# Pull latest theme from store
shopify theme pull --store runitbackclassics.myshopify.com

# Check Liquid syntax
shopify theme check
```

## Directory Structure

| Directory | Purpose |
|-----------|---------|
| `layout/` | Root HTML wrappers — `theme.liquid` (all pages) and `password.liquid` |
| `templates/` | JSON files mapping page types to sections (e.g. `product.json`, `index.json`) |
| `sections/` | Liquid section files — each is a self-contained, merchant-configurable block |
| `snippets/` | Reusable Liquid partials, rendered with `{% render %}`. Prefixed `_` snippets are private sub-components |
| `blocks/` | Liquid block files for nested section content |
| `assets/` | JS (ES modules), CSS, and SVG icons — served directly, no bundling |
| `config/` | `settings_schema.json` (theme settings UI), `settings_data.json` (saved values) |
| `locales/` | Translation strings for all languages; `en.default.json` is the source of truth |

## JavaScript Architecture

Assets JS uses **ES modules with `@theme/*` path aliases** (mapped in `assets/jsconfig.json` to `assets/`). Import pattern:

```js
import { requestIdleCallback } from '@theme/utilities';
import { Component } from '@theme/component';
```

**Core abstractions:**

- **`Component` (`assets/component.js`)** — Base class for all custom web components. Extends `HTMLElement`. Manages `ref` attributes as element references, sets up mutation observers, and handles declarative event listeners. Most interactive UI elements extend this.

- **`DeclarativeShadowElement`** — Handles Declarative Shadow DOM hydration for components mounted after initial render.

- **`ThemeEvents` (`assets/events.js`)** — Typed event bus. All cross-component communication uses these constants (e.g. `ThemeEvents.cartUpdate`, `ThemeEvents.variantUpdate`). Dispatch on `document`.

- **`SectionRenderer` (`assets/section-renderer.js`)** — Re-renders sections via Shopify's Section Rendering API. Uses `morph` for DOM diffing to preserve state.

- **`morph` (`assets/morph.js`)** — DOM morphing/diffing library. Supports `data-hydration-key` for targeted updates — only elements with this attribute are updated during hydration mode.

- **`section-hydration.js`** — Lazy hydrates a section via `SectionRenderer` on idle, once per section (guarded by `data-hydrated="true"`).

## Liquid Conventions

- `snippets/` files prefixed with `_` (e.g. `_product-card.liquid`) are private sub-components rendered only by their parent section or block.
- Translation keys are accessed via `{{ 't:key.path' | t }}` in schema JSON files and `{{ 'key.path' | t }}` in Liquid templates.
- CSS custom properties for color schemes and layout are injected by `snippets/color-schemes.liquid` and `snippets/theme-styles-variables.liquid` — do not hardcode colors.
- Global JS state (routes, translations, template info) is available via the `Theme` global object defined in `assets/global.d.ts`.

## Theme Settings

- Merchant-facing settings are declared in `config/settings_schema.json` and read in Liquid via `settings.setting_id`.
- Section-level settings are declared inline in each `.liquid` section file's `{% schema %}` block.
- `config/settings_data.json` stores the current saved values — do not manually edit this; use the Theme Editor or `shopify theme pull`.
