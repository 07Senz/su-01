// Minimal D1 adapter used by Next.js API routes.
// In production on Cloudflare Workers, `req` may carry an `env` field.

export function getD1FromEnv(env: any) {
  if (!env || !env.DB) {
    throw new Error("Missing D1 binding: env.DB");
  }
  return env.DB;
}

