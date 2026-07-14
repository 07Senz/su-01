import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // IMPORTANT:
  // Do NOT enable `output: 'export'`.
  // This app uses API routes under `app/api/*` for member persistence.
  // `next export` / `output: 'export'` cannot include API routes.

  // Optional: If you have images, you may need to disable image optimization
  // because some static-export flows don't support the standard Next.js image server.
  images: {
    unoptimized: true,
  },

};

export default nextConfig;

