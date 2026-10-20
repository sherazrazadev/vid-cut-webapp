# Free / no-Docker setup

vid-cut runs the editor without Postgres, Redis, auth, or paid APIs.

## Requirements

- Bun 1.2+
- Modern Chromium-based browser (WebCodecs)

Docker is **not** required for MVP.

## Steps

```bash
cd /path/to/vid-cut
cp apps/web/.env.example apps/web/.env.local
bun install
bun dev:web
```

Open [http://localhost:3000](http://localhost:3000).

## What works without secrets

| Feature | Status |
|---------|--------|
| Landing + projects + editor | Yes (local IndexedDB) |
| Import / timeline / export | Yes (browser) |
| Auth / accounts | Off (`AUTH_ENABLED=false`) |
| Feedback API | Accepts payload; no DB write |
| Sound search (Freesound) | Empty until `FREESOUND_API_KEY` |
| Blog (Marble) | Empty until `MARBLE_WORKSPACE_KEY` |
| Analytics | Off until `NEXT_PUBLIC_ANALYTICS_ENABLED=true` |

## Optional paid/ops toggles

See `apps/web/.env.example` and `apps/web/src/env/features.ts`.

| Flag / env | Enables |
|------------|---------|
| `AUTH_ENABLED=true` + `DATABASE_URL` + `BETTER_AUTH_SECRET` | Better Auth |
| `DATABASE_URL` | Drizzle / feedback persistence |
| `UPSTASH_REDIS_REST_*` | Rate limits |
| `FREESOUND_API_KEY` | Stock sound search |
| `MARBLE_WORKSPACE_KEY` | Blog CMS |
| `NEXT_PUBLIC_ANALYTICS_ENABLED=true` | Databuddy script |

## Vercel free deploy

1. Push your repo.
2. Import on Vercel; framework Next.js; root or `apps/web` as needed for the monorepo.
3. Set only `NEXT_PUBLIC_SITE_URL` (your `*.vercel.app` URL).
4. Leave auth/DB/Redis unset.

## Docker (optional)

Use root `docker-compose.yml` only if you turn auth/DB/Redis on.
