# Cloudflare Workers Deployment

This project uses **Next.js**, **OpenNext**, and **Cloudflare Workers**.

OpenNext converts the Next.js application into a Cloudflare Worker, enabling support for:

- App Router
- API Routes
- Server-Side Rendering (SSR)
- Static Generation (SSG)
- Middleware (where supported)

## Local Development

```bash
npm run dev
```

## Production Build

```bash
npm run build
```

## Build for Cloudflare (OpenNext)

```bash
npm run cf:build
```

This command:

1. Builds the Next.js application.
2. Generates the `.open-next` Worker bundle.

## Deploy

```bash
npm run cf:deploy
```

This command:

1. Builds the Next.js application.
2. Builds the OpenNext Worker.
3. Deploys the Worker using Wrangler.

## Git Workflow

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

Then deploy:

```bash
npm run cf:deploy
```

## Cloudflare Git Deployment

Configure your Worker with:

**Build command**

```bash
npm run cf:build
```

**Deploy command**

```bash
npx wrangler deploy
```