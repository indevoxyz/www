// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";

import tailwindcss from "@tailwindcss/vite";

import db from "@astrojs/db";

import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  prefetch: true,
  site: "https://indevo.xyz",
  trailingSlash: "ignore",
  integrations: [react(), db()],

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: vercel(),
});