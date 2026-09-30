# Social Media Dashboard

A single view of engagement, reach and audience growth across six social platforms, built with
Next.js, React and Recharts.

**Live demo:** https://social-dashboard-delta.vercel.app

> **This is a front-end demo.** Every figure on screen is generated locally from a seeded
> pseudo-random generator. There is no backend, no database and no authentication, and the
> dashboard is not connected to any social platform's API. See
> [Status and roadmap](#status-and-roadmap) for what is and is not implemented.

---

## Screens

| Route                     | What it shows                                                            |
| ------------------------- | ------------------------------------------------------------------------ |
| `/`                       | Four headline metrics plus engagement, reach, growth and platform charts |
| `/posts`                  | Post feed with likes, shares, threaded comments and pagination           |
| `/users`                  | Connected accounts, their handles per platform and follower counts       |
| `/notifications`          | Activity feed — likes, comments, shares, follows and mentions            |
| `/settings/account`       | Profile details, connected platforms, privacy preferences                |
| `/settings/notifications` | Delivery channels and per-event notification preferences                 |
| `/settings/appearance`    | Light / dark / system theme                                              |

---

## Getting started

Requires Node 20.9 or newer (see `.nvmrc`).

```bash
git clone https://github.com/Zay2006/social-dashboard.git
cd social-dashboard
npm install
npm run dev
```

The dev server runs at http://localhost:3000.

### Scripts

| Script                 | Purpose                               |
| ---------------------- | ------------------------------------- |
| `npm run dev`          | Dev server with Turbopack             |
| `npm run build`        | Production build                      |
| `npm start`            | Serve the production build            |
| `npm run lint`         | ESLint                                |
| `npm run typecheck`    | `tsc --noEmit`                        |
| `npm test`             | Vitest unit and component tests       |
| `npm run test:watch`   | Vitest in watch mode                  |
| `npm run format`       | Prettier                              |
| `npm run format:check` | Prettier in check mode (what CI runs) |

CI runs formatting, lint, typecheck, tests, a production build and `npm audit --audit-level=high`
on every pull request.

---

## Tech stack

- **Framework** — Next.js 15 (App Router), React 19
- **Language** — TypeScript in `strict` mode
- **Styling** — Tailwind CSS 3 with shadcn-style design tokens
- **Components** — hand-rolled shadcn/ui primitives over Radix (`Dialog`, `Slot`)
- **Charts** — Recharts
- **Icons** — Lucide
- **Testing** — Vitest, Testing Library, jsdom

---

## Architecture

```
src/
  app/
    layout.tsx              Root layout: fonts, theme bootstrap, skip link
    error.tsx               Root error boundary
    not-found.tsx           404
    globals.css             Design tokens and base layer
    (dashboard)/
      layout.tsx            Shared chrome for every dashboard route
      loading.tsx           Streaming skeleton
      page.tsx              Dashboard overview
      posts/ users/ notifications/ settings/
  components/
    layout/                 Shell, sidebar navigation, theme toggle
    dashboard/              Stat cards and charts
    posts/                  Feed, post card, comments dialog
    notifications/          Activity feed
    settings/               Account, notification and appearance settings
    ui/                     Button, Card, Dialog, Input, Switch, Avatar, TimeStamp
  lib/
    platforms.ts            Single source of truth for label, icon and colours
    format.ts               Date and number formatting
    storage.ts              localStorage that cannot throw
    id.ts                   Collision-free ids
    theme/                  Theme provider and pre-paint bootstrap script
    data/                   Seeded generators and fixtures
```

A few decisions worth knowing about if you are extending this:

**Design tokens are HSL triplets, not colour functions.** `tailwind.config.ts` consumes them as
`hsl(var(--token))`, so a variable holding a full `oklch(...)` or `rgb(...)` value produces an
invalid declaration and silently drops the utility. Keep `globals.css` to bare
`<hue> <saturation>% <lightness>%` values.

**Generated data is seeded.** `lib/data/random.ts` provides a deterministic generator. Seeding
component state with `Math.random()` gives the server and the client different values for the same
render, which is a hydration mismatch. Anything rendered during SSR must come from a fixed seed.

**Dates are formatted in two passes.** Prerendered HTML carries the server's timezone, so
`lib/format.ts` separates timezone-independent formatters (safe during SSR) from locale-dependent
ones. The `<TimeStamp>` component renders UTC first and upgrades to the visitor's timezone after
mount.

**Chart colours are selected in JavaScript.** Recharts writes colours as SVG presentation
attributes, which cannot resolve `var()`, so `lib/platforms.ts` carries an explicit light/dark pair
per platform.

---

## Accessibility

- Keyboard reachable throughout, with a skip link to the main content
- Colour choices clear 4.5:1 contrast in both themes; verified with axe-core
- Toggles are `role="switch"` with `aria-checked` and an associated label
- Charts expose an accessible name and description, and Recharts' keyboard layer is enabled
- Navigation marks the active route with `aria-current="page"`
- The mobile drawer traps focus, closes on `Escape` and locks background scroll
- Motion respects `prefers-reduced-motion`

---

## Status and roadmap

**Implemented**

- Responsive layout down to 360px, with the sidebar collapsing into a drawer
- Light, dark and system themes, applied before first paint so there is no flash
- Four interactive charts that stay consistent with each other and with the sidebar figures
- Post feed with optimistic likes, shares, comments and pagination
- Notification feed with read/unread state, and separate notification preferences
- Unit and component test coverage for the data layer, formatting and interactive components

**Not implemented**

- Real platform integrations. There are no API routes and no OAuth flow; the "connected accounts"
  on the settings page are fixtures.
- Authentication. There is no sign-in, and settings changes live in component state only — they
  are not persisted anywhere.
- A database. Users, posts and notifications are fixtures in `src/lib/data`.
- AI features. Content suggestions, sentiment analysis and forecasting are ideas, not code.
- End-to-end tests.

**Next up, roughly in order**

1. Persist settings, starting with `localStorage` and moving to a real store
2. Add API routes backed by a database, and move the generators behind them
3. OAuth per platform, then replace the fixtures with live metrics
4. End-to-end coverage for the feed and settings flows

---

## Licence

MIT — see [LICENSE](LICENSE).
