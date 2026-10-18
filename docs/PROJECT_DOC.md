# ContentDash - Project Documentation

## Overview

ContentDash is a personalized content dashboard: a single responsive web app where a user configures their interests once and then gets a unified, customizable feed of news, movie recommendations and social posts. This document explains what was built, how it is structured, and the reasoning behind the main decisions.

## Requirement coverage

| Requirement | Implementation |
| --- | --- |
| Personalized feed + preferences | `SettingsPanel` toggles categories stored in the `preferences` Redux slice and mirrored to `localStorage` |
| Data fetching (3 sources) | `src/lib/api.ts`: NewsAPI (news), TMDB (recommendations), mock social API; all fall back to bundled sample data |
| Interactive content cards | `ContentCard` with image, headline, description, CTA and favorite toggle |
| Infinite scrolling | IntersectionObserver sentinel in `Feed` loads the next page via a thunk |
| Dashboard layout | Sidebar (Feed/Trending/Favorites/Settings) + header with search, dark toggle, account |
| Trending section | `trendingItems` utility sorted by score with category filter chips |
| Favorites section | `favorites` slice, persisted, rendered as a card grid |
| Debounced search | `useDebouncedValue` hook (300 ms) wired into `SearchBar` |
| Drag-and-drop | Framer Motion `Reorder.Group`; order kept as an id list in the `content` slice |
| Dark mode | Header toggle -> `dark` class on `<html>`; CSS custom properties + Tailwind `dark:` variant; persisted |
| Animations | Framer Motion layout/drag animations, fade-ins, spinner |
| Redux Toolkit + async logic | Slices for preferences/content/favorites/auth; `createAsyncThunk` for fetching |
| Unit tests | Slice logic and utilities incl. edge cases (`src/__tests__`) |
| Integration tests | Feed rendering, query filtering, empty state |
| E2E tests | Playwright: search, favorites, dark mode, persistence, drag-and-drop |
| Bonus: authentication | Mock sign-in dialog; avatar in header; persisted session |
| Bonus: real-time data | Simulated live feed: a new post arrives every 45 s |

## Architecture

**State.** Four Redux slices: `preferences` (categories, dark mode), `content` (feed items, pagination, custom order), `favorites`, `auth`. A tiny subscription in `app/providers.tsx` persists the three user-owned slices to `localStorage` and rehydrates them on mount. This avoids pulling in `redux-persist` while giving the same user-visible behavior and staying SSR-safe with Next's static export.

**Data.** `lib/api.ts` exposes `fetchFeed`, which fans out to the three sources in parallel, normalizes everything into one `ContentItem` shape, applies search/type filters, sorts by publish time and paginates. API keys are optional: they are read from `localStorage` (Settings panel) or build-time env vars, and any failure degrades to the bundled sample dataset. No key is ever committed.

**Drag-and-drop.** Framer Motion's `Reorder` gives accessible, animated reordering. The store keeps `order: string[]` (ids); the `orderedItems` selector merges the custom order with newly loaded pages, so infinite scroll never fights the user's arrangement.

**Testing.** Vitest + Testing Library run in jsdom for unit and integration tests; Playwright covers the critical user flows in a real browser (including persistence across reload and the drag interaction).

## Trade-offs and notes

- **Static export** (`output: "export"`) so the app deploys free to GitHub Pages and needs no server or secrets. Data fetching is client-side only.
- The social source is a mock by design: real social APIs require OAuth apps, which is out of scope for an assignment and would not be reviewable without credentials.
- The real-time bonus is simulated with an interval rather than a real WebSocket/SSE server, since the static deployment has no backend.
- Mock authentication is intentionally local-only (bonus asks for mock auth); it exists to demonstrate the profile-customization UX.

## Possible next steps

- Real SSE/WebSocket feed behind a small API route on a serverful deployment.
- `react-i18next` language switching (scaffolded for but left out to keep the bundle lean).
- Shareable feed layouts via URL-encoded order + preferences.
