# Square Menu Frontend (Next.js + TypeScript)

Mobile-first single-page menu application that consumes the Square proxy backend.

## Features

- Mobile-first responsive UI (optimized for 375px viewport)
- Location selector with persistence in `localStorage`
- Category navigation with active highlighting
- Menu grouped by category
- Menu search by name/description (client-side bonus)
- Loading skeletons, robust error states, and empty states
- Typed API client and typed view models
- Unit, integration, and e2e tests

## Backend Dependency

This frontend expects the backend from `square-proxy-backend` to be running and accessible.

Required backend endpoints:

- `GET /api/locations`
- `GET /api/catalog?location_id=<LOCATION_ID>`
- `GET /api/catalog/categories?location_id=<LOCATION_ID>`

## Tech Stack

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- Vitest + Testing Library (unit/integration)
- Playwright (e2e)

## Environment

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Variables:

- `NEXT_PUBLIC_API_BASE_URL` (default: `http://localhost:3000/api`)

## Run Locally

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Run with Docker

Build and start:

```bash
docker compose up --build
```

By default frontend is served at [http://localhost:3001](http://localhost:3001).

Optional environment overrides:

- `FRONTEND_PORT` (default `3001`)
- `NEXT_PUBLIC_API_BASE_URL` (default `http://localhost:3000/api`)

## Scripts

- `npm run dev` - start dev server
- `npm run build` - production build
- `npm run start` - run production server
- `npm run lint` - lint project
- `npm run test` - run all Vitest tests
- `npm run test:unit` - run unit tests only
- `npm run test:integration` - run integration tests only
- `npm run test:e2e` - run Playwright e2e tests

## Test Strategy

### Unit tests

Located in `src/lib/*.test.ts`.

Focus:

- Currency formatting
- Variation text formatting
- Description truncation behavior

### Integration tests

Located in `src/components/*.test.tsx`.

Focus:

- API-driven UI state transitions
- Search filtering behavior
- Rendering of menu data from typed mocks

### E2E tests

Located in `e2e/*.spec.ts`.

Focus:

- Full user flow in browser
- Route-level API mocking
- Search interaction and rendered menu validation

## UX Notes

- Location selection is persisted under `square_menu_selected_location`
- Description supports `Read more / Read less`
- Price shown from first variation
- Multi-variation items show inline variation list
- Missing images show placeholder state

## Error Handling

- API failures show retryable error panel
- Empty data shows explicit empty state message
- Loading state uses skeleton cards for visual stability

## Project Structure

- `src/app/page.tsx` - page entrypoint
- `src/hooks/use-menu-page-state.ts` - menu state/data orchestration hook
- `src/components/menu/` - menu UI components (selector, nav, cards, states)
- `src/lib/api.ts` - typed API client and error wrapper
- `src/lib/menu.ts` - formatting and display helpers
- `src/types/api.ts` - shared response contracts
- `e2e/menu.spec.ts` - browser test flow

## Troubleshooting

- If no locations appear, verify backend is running and `NEXT_PUBLIC_API_BASE_URL` is correct
- If categories show but no items render, ensure backend location has catalog items present
- If e2e tests fail on missing browser, install once:

```bash
npx playwright install chromium
```
