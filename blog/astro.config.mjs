// @ts-check
import { defineConfig } from "astro/config";

// Integrations
import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import AutoImport from "astro-auto-import";
import mdx from "@astrojs/mdx";

// Plugins
import tailwindcss from "@tailwindcss/vite";

import expressiveCode from "astro-expressive-code";

// https://astro.build/config
export default defineConfig({
  site: "https://example.com",
  integrations: [
    // https://docs.astro.build/en/guides/integrations-guide/sitemap/
    sitemap(),
    // https://docs.astro.build/en/guides/integrations-guide/svelte/
    svelte(),
    // https://expressive-code.com/
    expressiveCode({
      defaultProps: { wrap: true },
      themes: ["dark-plus", "github-dark"],
    }),
    // https://github.com/delucis/astro-auto-import/tree/main/packages/astro-auto-import
    AutoImport({
      imports: [
        {
          // The following translates to:
          // import componentSet from "@components/mdx/index";
          "@components/mdx/index": [["default", "componentSet"]],
        },
      ],
    }),
    // IMPORTANT: MUST BE LAST INTEGRATION
    // https://docs.astro.build/en/guides/integrations-guide/mdx/
    mdx(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
