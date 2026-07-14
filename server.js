// Cloudflare Workers (Node runtime) entry.
// This file is intentionally minimal and will likely fail at runtime
// unless you use the appropriate framework bindings / adapter for Next.js on CF.
// The goal for this task is to ensure the deployment target is NOT static export.

export default {
  async fetch(request, env, ctx) {
    return new Response(
      JSON.stringify({
        error: "Cloudflare runtime bootstrap not configured for Next.js server.",
        note: "Use Cloudflare Pages Functions/Workers Framework or a dedicated Next.js adapter to run Next.js server on Cloudflare.",
      }),
      { status: 500, headers: { "content-type": "application/json" } },
    );
  },
};

