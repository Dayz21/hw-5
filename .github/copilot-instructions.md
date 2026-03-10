# Project Guidelines

## Tech Stack

- **Framework**: Next.js 16 (App Router — migration in progress from Pages Router)
- **Language**: TypeScript (strict)
- **State**: MobX 6 + mobx-react-lite (`observer` HOC)
- **HTTP**: Axios singleton with JWT interceptor
- **Styling**: SCSS Modules + centralized tokens (`styles/colors.scss`, `styles/variables.scss`)
- **Backend**: Strapi (ISR-compatible via `ServerFilmsAPI`)

## Build and Dev

```bash
yarn dev        # start dev server
yarn build      # production build
yarn lint       # ESLint
yarn format     # Prettier --write .
```

No test runner is configured.

## Architecture

### Directory Layout

| Directory     | Purpose                                                                      |
| ------------- | ---------------------------------------------------------------------------- |
| `app/`        | App Router pages (stubs — migration in progress)                             |
| `_old/pages/` | Original Pages Router pages (source of truth until migrated)                 |
| `components/` | Shared UI components (barrel-exported via `index.ts`)                        |
| `store/`      | MobX stores; page-level via `useLocalStore()`, global via `store/rootStore/` |
| `api/`        | API classes + types; `api/server/` for SSR-safe fetch wrappers               |
| `config/`     | `config.ts` (env vars) and `routes.ts` (path constants)                      |
| `styles/`     | Shared SCSS tokens (colors, variables, mixins)                               |

### State Management (MobX)

- Private fields use `_fieldName` convention; expose via `get` accessors.
- Declare all observables/actions in `makeObservable<this, PrivateFields>()` — list private fields explicitly.
- Mutate state inside `runInAction()` after async awaits; never mutate `.push()` on `observable.ref` arrays.
- Page-level stores: create with `useLocalStore()` hook (auto-destroyed on unmount).
- Global stores: accessed via `rootStore` (user, favorites).
- Wrap consuming components with `observer()` from `mobx-react-lite`.

```typescript
// Canonical store shape
class FilmsStore {
  private _films: FilmType[] = [];
  private _isLoading = false;

  constructor() {
    makeObservable<this, "_films" | "_isLoading">(this, {
      _films: observable.ref,
      _isLoading: observable,
      films: computed,
      isLoading: computed,
      fetchFilms: action.bound,
    });
  }

  get films() { return this._films; }
  get isLoading() { return this._isLoading; }

  async fetchFilms(...) {
    this._isLoading = true;
    try {
      const data = await FilmsAPI.fetchFilms(...);
      runInAction(() => { this._films = data.films; });
    } catch (e) {
      console.error(e);
    } finally {
      runInAction(() => { this._isLoading = false; });
    }
  }

  destroy() { /* reset state — required by ILocalStore */ }
}
```

### API Layer

- Each domain has a typed class (`FilmsAPI`, `AuthAPI`, `FavoritesAPI`, …) exported as a singleton.
- All client requests go through the Axios `API` singleton (auto-injects `Authorization: Bearer <token>` from localStorage).
- SSR/ISR pages use `ServerFilmsAPI` (native `fetch`, no auth, `revalidate: 60`).
- Query strings are built with `filmsQueryUtils` (Strapi filter syntax via `qs`, always pass `skipNulls: true`).
- Strapi **list** responses are nested as `response.data.data[]` + `response.data.meta.pagination`; **single-item** responses are `response.data.data`. Account for this asymmetry in every new endpoint.
- Related fields (e.g. `poster`, `category`, `gallery`) must be explicitly listed in the query's `populate` array or they are absent from the response.

### Components

- Each component lives in `components/<Name>/` with `<Name>.tsx`, `<Name>.module.scss`, and `index.ts` (barrel export).
- Add `"use client"` at top of any component that uses MobX (`observer`) or browser APIs.
- Compose conditional class names with `classnames`.
- Import shared SCSS tokens via `@use "@styles/colors"` / `@use "@styles/variables"`.

## Conventions

### Path Aliases

```
@/*              → ./*
@components/*    → ./components/*
@config/*        → ./config/*
@styles/*        → ./styles/*
@utils/*         → ./utils/*
```

### Type Conversions

API responses are transformed to store types via `toXxxType()` factory functions (e.g., `toFilmType()`). Always add a factory function when introducing a new API response shape; do not use raw API types inside stores or components.

`toOptionType()` converts `CategoryType` → `{ key, value }` for use in `MultiDropdown` and other select components.

## Pitfalls

- **Router migration**: `app/` pages are stubs. New pages should be written in App Router; old behavior lives in `_old/pages/`.
- **`observable.ref` arrays**: Reassign the entire array inside `runInAction`; do not `.push()`.
- **localStorage + SSR**: `process.env.NEXT_PUBLIC_API_URL` must be set. Token access is client-only — SSR paths must use `ServerFilmsAPI`.
- **`useSearchParams`**: Use `next/navigation` in App Router, not the React Router version used in `_old/`.
- **No token refresh**: JWT expires silently; watch for 401s and redirect to login manually.
- **`ILocalStore` destroy**: Every page-level store must implement `destroy()` to reset state; `useLocalStore` calls it on unmount. Forgetting this causes observer accumulation.
- **Loading flag in `finally`**: Always reset `_isLoading` in a `finally` block inside `runInAction`, not just on success, so the UI unblocks even when a request fails.
