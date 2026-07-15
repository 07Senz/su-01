# Deployment

This project uses **Next.js**, **OpenNext**, and **Cloudflare Workers**.

## Development

Run the development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

---

## Build

Build the project for production:

```bash
npm run build
```

---

## Deploy to Cloudflare Workers

### Local deployment

Deploy the latest version:

```bash
npm run cf:deploy
```

This command automatically:

1. Builds the Next.js application.
2. Generates the OpenNext Cloudflare Worker.
3. Deploys it using Wrangler.

---

### Git workflow

Before deploying, save your changes to GitHub:

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

Then deploy:

```bash
npm run cf:deploy
```

---

## Cloudflare Build Settings

Build command:

```bash
npm run cf:build
```

Deploy command:

```bash
npx wrangler deploy
```

---

## Environment Variables

Required:

- `ADMIN_PASS`