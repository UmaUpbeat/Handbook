// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
  // ── Astro-level settings -----------------------------------------------
  site: "https://uma.example",
  trailingSlash: "ignore",
  output: "static",
  build: { format: "directory" },

  // ── Starlight integration ---------------------------------------------
  integrations: [
    starlight({
      title: "Uma Upbeat Handbook",
      tagline: "One engine, two modes, three minutes to launch.",
      logo: { src: "./src/assets/houston.webp" }, // splash hero image reused
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/UmaUpbeat/Handbook",
        },
      ],

      // ── Navigation sidebar --------------------------------------------
      sidebar: [
        {
          label: "Architecture",
          collapsed: false,
          autogenerate: { directory: "architecture" },
        },
        {
          label: "API",
          collapsed: true,
          autogenerate: { directory: "api" },
        },
        {
          label: "Components",
          collapsed: true,
          autogenerate: { directory: "components" },
        },
        {
          label: "Governance",
          collapsed: true,
          autogenerate: { directory: "governance" },
        },
      ],

      // ── Misc Starlight niceties ---------------------------------------
      editLink: {
        baseUrl: "https://github.com/UmaUpbeat/Handbook/edit/main/",
      },
      lastUpdated: true,
      pagination: true,
      expressiveCode: true, // modern code blocks
    }),
  ],
});
