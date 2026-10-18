# ContentDash - Personalized Content Dashboard

A personalized content dashboard built with **Next.js (App Router), TypeScript, Redux Toolkit and Tailwind CSS**. It aggregates news, movie recommendations and social posts into a single customizable feed with drag-and-drop organization, debounced search, dark mode and persisted preferences.

## Features

- **Personalized content feed** - pick favorite categories (technology, sports, finance, entertainment, science) in Settings; preferences persist in `localStorage` across sessions.
- **Multiple sources** - News (NewsAPI), recommendations (TMDB) and social posts (mock API). Without API keys the app runs on rich bundled sample data, so it always works offline and in review environments. Keys can be pasted in Settings and are stored only in the browser's localStorage - never in the repo.
- **Interactive content cards** - image, headline, description, source, relative time and a call-to-action per card; mark any card as favorite.
- **Infinite scrolling** - an IntersectionObserver sentinel loads the next page as you scroll.
- **Dashboard layout** - sidebar navigation (My Feed, Trending, Favorites, Settings) and a top header with search, dark-mode toggle and account.
- **Trending section** - top items by score, filterable per category.
- **Favorites section** - everything you have saved, persisted.
- **Debounced search** - 300 ms debounce across titles, descriptions, sources and categories.
- **Drag-and-drop** - reorder feed cards (Framer Motion `Reorder`); the custom order is kept in Redux.
- **Dark mode** - toggled in the header, implemented with CSS custom properties + Tailwind's `dark` variant, persisted.
- **Animations** - card hover lift, fade-in sections, loading spinner (Framer Motion + CSS).
- **Bonus** - mock sign-in (avatar + persisted session) and a simulated real-time feed that drops a new post into the feed every 45 seconds.

## Tech stack

Next.js 16 (static export) · React 19 · TypeScript · Redux Toolkit (slices + async thunks) · Tailwind CSS 4 · Framer Motion · Vitest + Testing Library · Playwright

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

### Optional live data

Open **Settings** in the app and paste a [NewsAPI](https://newsapi.org) key and/or a [TMDB](https://www.themoviedb.org/documentation/api) key. They are read from `localStorage` at request time and fall back to sample data on any error. Build-time equivalents: `NEXT_PUBLIC_NEWSAPI_KEY`, `NEXT_PUBLIC_TMDB_KEY`.

## Testing

```bash
npm test           # unit + integration (Vitest + Testing Library, jsdom)
npm run test:e2e   # E2E (Playwright; starts the dev server automatically)
```

- **Unit**: preferences/favorites/content slices, search/trending/debounce utilities (edge cases: zero-category guard, empty states, duplicate live items).
- **Integration**: the feed renders fetched content, filters by query, and shows the empty state.
- **E2E**: feed load, debounced search, favorites flow, dark mode, preference persistence across reloads, drag-and-drop reordering.

## Build & deploy

```bash
npm run build      # static export into ./out
```

The repo ships a GitHub Actions workflow (`.github/workflows/deploy.yml`) that builds the static export and publishes it to GitHub Pages on every push to `main`.

## Project structure

```
src/
  app/          App Router entry (layout, page, providers, global styles)
  components/   Sidebar, Header, SearchBar, Feed, ContentCard, Trending, Favorites, Settings
  store/        Redux store + slices (preferences, content, favorites, auth)
  lib/          API layer (NewsAPI/TMDB/mock), mock data, utilities
  hooks/        useDebounce
  __tests__/    Vitest unit + integration tests
e2e/            Playwright specs
```

## Architecture notes

- Global state lives in Redux Toolkit slices; async fetching uses `createAsyncThunk` thunks with a graceful fallback to bundled data.
- Persistence is a small store subscription that mirrors preferences, favorites and auth into `localStorage` (rehydrated on load).
- The custom drag order is stored as an ordered id list; a pure selector (`orderedItems`) merges it with freshly fetched items.
- Static export keeps hosting free and keyless: all data fetching is client-side.

## Demo

`demo.mp4` in this repo is a short walkthrough (feed, search, trending, favorites, settings, dark mode).
