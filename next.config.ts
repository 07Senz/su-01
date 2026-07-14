import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // output: 'export',

  // Optional: If you have images, you may need to disable image optimization
  // because 'export' mode doesn't support the standard Next.js image server
  images: {
    unoptimized: true,
  },

};


export default nextConfig;