---
description: "Migrate unmigrated pages from _old/pages/ to the App Router (app/), following the same established pattern as app/(content)/films/ and app/(content)/films/[filmId]/"
applyTo: "app/**"
---

Migrate the remaining un-implemented pages from the Pages Router (`_old/pages/`) to the App Router (`app/`), strictly following the pattern established in `app/(content)/films/` and `app/(content)/films/[filmId]/`.

## Unmigrated pages to implement

| Old source                         | New target route   | App Router path                  |
| ---------------------------------- | ------------------ | -------------------------------- |
| `_old/pages/FavoritesPage/`        | `/favorites`       | `app/(content)/favorites/`       |
| `_old/pages/CollectionsPage/`      | `/collections`     | `app/(content)/collections/`     |
| `_old/pages/RecommendationsPage/`  | `/recommendations` | `app/(content)/recommendations/` |
| `_old/pages/AccountPage/`          | `/account`         | `app/(content)/account/`         |
| `_old/pages/Auth/LoginPage.tsx`    | `/login`           | `app/(auth)/login/`              |
| `_old/pages/Auth/RegisterPage.tsx` | `/register`        | `app/(auth)/register/`           |

When asked to migrate a specific page, handle only that page. When asked to migrate all remaining pages, implement all rows in the table above.

---

## Canonical migration pattern

The already-migrated `app/(content)/films/page.tsx` and `app/(content)/films/[filmId]/page.tsx` are the **canonical reference**. Read them before starting any migration.

### 1. Server page (`page.tsx`)

- Export a **default async Server Component** — no `"use client"`, no `observer()`.
- Receive `searchParams` or `params` as `Promise<…>` and `await` them.
- Fetch initial data with helpers from `api/server/ServerFilmsAPI` (native `fetch`, no auth, `revalidate: 60`).
- Pass all fetched data as **props** to a single `"use client"` child component.
- **Exception**: pages that require client auth state (`AccountPage`, `FavoritesPage`) cannot fetch meaningful data server-side — their `page.tsx` only renders the client component wrapper without any data fetch.

### 2. `loading.tsx`

- Add a `loading.tsx` sibling file with a skeleton matching the page layout.
- Use `<div>` / `<span>` skeleton blocks, not spinners, to match the skeleton pattern in `app/(content)/films/loading.tsx`.

### 3. Client components (`_components/`)

- Place all interactive parts inside `<route>/_components/`.
- Every file in `_components/` must start with `"use client"`.
- Replace `useNavigate()` → `useRouter()` from `next/navigation`.
- Replace `useParams()` → props received from the server page.
- Replace `<Link to=…>` (react-router) → `<Link href=…>` from `next/link`.
- Replace `useSearchParams()` (react-router) → `useSearchParams()` from `next/navigation`.
- MobX stores needed for client interactivity: keep using `useLocalStore()` + `observer()`.
- Global stores (`rootStore.userStore`, `rootStore.favoritesStore`) are used in client components only.

### 4. Auth-dependent pages (`FavoritesPage`, `AccountPage`)

- `page.tsx` is a **trivial server component** that renders only `<ClientFavoritesPage />` / `<ClientAccountPage />`.
- The client component reads `rootStore.userStore.isAuthorized` with `observer()`.
- No server-side auth check; redirect to login is done inside the client component with `useRouter().push()`.

### 5. Auth pages (`LoginPage`, `RegisterPage`)

- These are **pure client forms** — the entire `page.tsx` needs `"use client"` (or delegate to a single `_components/AuthForm.tsx`).
- Replace `useNavigate()` with `useRouter()` from `next/navigation`.
- Replace `<Link to=…>` with `<Link href=…>` from `next/link`.
- `AuthAPI.login()` / `AuthAPI.register()` calls remain unchanged (they use the Axios singleton client-side).
- After successful auth, call `rootStore.userStore.fetchMe()` so the global store is current before navigating.
- Check if `app/(auth)/layout.tsx` exists; if not, create it to reproduce the centred column layout from `Auth.module.scss` (`.auth_page` class).

### 6. Collections page

- `CollectionsStore.init()` loads categories then a film batch per category — this is **client-side lazy loading**, keep it.
- The server `page.tsx` fetches the initial category list via `ServerCategoriesAPI` and passes it to a `"use client"` `CollectionsClient` component.
- `CollectionsClient` initialises `useLocalStore(() => new CollectionsStore())` and calls `store.initWithCategories(categories)` instead of `store.init()` to avoid a redundant second categories fetch.
- If `CollectionsStore` has no `initWithCategories` method, add one that skips the categories fetch and goes straight to loading films.

### 7. Recommendations page

- The server `page.tsx` fetches page 1 of featured/recommended films via `ServerFilmsAPI` and passes them as `initialFilms` + `initialPagination` props.
- The `"use client"` component initialises `useLocalStore(() => new RecommendationsStore())`, seeds it with `initialFilms`, and continues infinite scroll client-side.
- If `RecommendationsStore` has no seeding mechanism, add a `seed(films, pagination)` method following the same `runInAction` pattern used elsewhere in the store.

### 8. Styles

- Copy the corresponding `.module.scss` from `_old/pages/<PageName>/` unchanged to the new route folder.
- Update import paths to use `@styles/` aliases.
- Do **not** rename or restructure SCSS classes.

---

## Rules

- Never use `getServerSideProps` or `getStaticProps` — those are Pages Router only.
- Never import from `react-router-dom` or `react-router` in any new App Router file.
- Server pages must be plain `async function`s; all reactive/observable code lives in `"use client"` components.
- SSR data must use `api/server/ServerFilmsAPI` or `api/server/ServerCategoriesAPI`.
- Client data uses `FilmsAPI`, `FavoritesAPI`, `AuthAPI` (Axios singletons) — unchanged.
- `ROUTES` constants (`config/routes.ts`) are shared by both old and new code — use them for all `href` values.
- After completing a page, verify with `yarn build` that no TypeScript errors were introduced.

---

## Checklist (per page)

- [ ] `app/<group>/<page>/page.tsx` — server component (or `"use client"` for pure-client pages)
- [ ] `app/<group>/<page>/loading.tsx` — skeleton
- [ ] `app/<group>/<page>/<Page>.module.scss` — copied and path-corrected
- [ ] `app/<group>/<page>/_components/<PageClient>.tsx` — `"use client"`, replaces the old observer page
- [ ] No `react-router`/`react-router-dom` imports in any new file
- [ ] No `useEffect` data-fetching in the server page
- [ ] `yarn build` passes without type errors
