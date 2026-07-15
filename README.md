## Development

Run the development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

---

## Build

Build the Next.js application:

```bash
npm run build
```

---

## Deploy to Cloudflare Workers

This project uses **OpenNext** with **Cloudflare Workers**.

### Deploy the latest version

After making changes, run:

```bash
git add .
git commit -m "Your commit message"
git push origin main
npm run cf:deploy
```

The deployment process will:

1. Build the Next.js application.
2. Generate the OpenNext Cloudflare Worker.
3. Deploy the latest version to Cloudflare Workers.

---

## Environment Variables

Required environment variables:

- `ADMIN_PASS`

---

## Learn More

- https://nextjs.org/docs
- https://opennext.js.org/cloudflare
- https://developers.cloudflare.com/workers/