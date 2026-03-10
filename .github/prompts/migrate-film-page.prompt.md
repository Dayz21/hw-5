---
description: "Migrate FilmPage from Pages Router (_old/pages/FilmPage/) to App Router (app/(content)/films/[filmId]/), following the same pattern as the films/ migration"
agent: "agent"
---

Migrate the single film page from the Pages Router to the App Router, following the same pattern used for `app/(content)/films/`.

## Source

[\_old/pages/FilmPage/FilmPage.tsx](./../_old/pages/FilmPage/FilmPage.tsx) and its sub-components in `_old/pages/FilmPage/components/`.

## Target

`app/(content)/films/[filmId]/` — the stub `page.tsx` is already present but is a placeholder.

## Migration Pattern (follow exactly as in `app/(content)/films/`)

### 1. Server page (`page.tsx`)

- Make it an `async` Server Component.
- Receive `params` as `Promise<{ filmId: string }>` and await it.
- Fetch initial film data with `serverFetchFilmById(filmId)` from `api/server/ServerFilmsAPI`.
- Fetch recommendations via a server fetch as well if a server helper exists; otherwise pass `filmId` to a client component for client-side fetching.
- Pass fetched data as props to a `"use client"` component.

### 2. `loading.tsx`

- Add a `loading.tsx` in `app/(content)/films/[filmId]/` with a skeleton matching the film page layout (poster, title, metadata areas).

### 3. Client components (`_components/`)

- Place interactive parts (gallery slider, back button, recommendations) under `app/(content)/films/[filmId]/_components/`.
- Each must have `"use client"` at the top.
- Replace `useParams()` (React Router) with props received from the server page.
- Replace `useNavigate()` with `useRouter()` from `next/navigation`.
- If a MobX store is needed for client state (e.g. `FilmStore`), use `useLocalStore()` and initialise it with the pre-fetched `film` prop so there is no loading flash.

### 4. Styles

- Copy / re-use `_old/pages/FilmPage/FilmPage.module.scss` unchanged; update the import path.

## Rules

- Do NOT use `getServerSideProps` or `getStaticProps` — those are Pages Router only.
- Do NOT import from React Router (`react-router-dom`) in any App Router file.
- SSR data fetching must use `api/server/ServerFilmsAPI` (native `fetch`, no auth).
- Client-only data fetching uses `FilmsAPI` singleton (Axios).
- All observable state must live in `"use client"` components; the server `page.tsx` must be a plain async function.
- Strapi single-item response is `response.data.data` — `serverFetchFilmById` already handles this via `toFilmType`.

## Checklist

- [ ] `app/(content)/films/[filmId]/page.tsx` — full async Server Component
- [ ] `app/(content)/films/[filmId]/loading.tsx` — skeleton UI
- [ ] `app/(content)/films/[filmId]/_components/FilmDetail.tsx` (or equivalent) — `"use client"` main component
- [ ] Sub-components (BackButton, ImagesSlider, ControlButtons) moved / adapted under `_components/`
- [ ] No Pages Router imports remain in any of the new files
- [ ] `yarn build` passes without type errors
