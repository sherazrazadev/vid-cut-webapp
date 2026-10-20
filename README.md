# vid-cut

Browser-based video editor. Local-first. MIT.

Forked from [OpenCut classic](https://github.com/OpenCut-app/opencut-classic) (MIT). See [NOTICE](./NOTICE) for attribution. Product backlog: [BACKLOG.md](./BACKLOG.md).

## Stack

- Next.js (apps/web)
- Bun workspaces + Turborepo
- Browser / WASM media path (`opencut-wasm` npm package)

## Prerequisites

- [Bun](https://bun.sh) 1.2+
- Node 20+ (via bun/fnm is fine)
- **No Docker** for MVP (see [docs/FREE_SETUP.md](./docs/FREE_SETUP.md))

## Setup (free path)

```bash
cp apps/web/.env.example apps/web/.env.local
bun install
bun dev:web
```

App: [http://localhost:3000](http://localhost:3000)

Auth, Postgres, Redis, Freesound, blog CMS, and analytics are **off** unless you set the optional env vars in `.env.example`.

## Scripts

| Script | Purpose |
|--------|---------|
| `bun dev:web` | Next.js dev server |
| `bun run build:web` | Production build |
| `bun run lint:web` | ESLint |

## License

MIT — retain upstream copyright in [LICENSE](./LICENSE) and [NOTICE](./NOTICE).
