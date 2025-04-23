import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const post = defineCollection({
  // Load Markdown and MDX files in the `src/content/post/` directory.
  loader: glob({ base: "./src/content/post", pattern: "**/*.{md,mdx}" }),
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Transform string to Date object
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
  }),
});

const authors = defineCollection({
  // Load Markdown and MDX files in the `src/content/authors/` directory.
  loader: glob({ base: "./src/content/authors", pattern: "**/*.{md,mdx}" }),
  // Type-check frontmatter using a schema
  schema: z.object({
    id: z.string(),
    name: z.string(),
    title: z.string(),
    portrait: z.string(),
    // bio: z.string().optional(),
    location: z.string(),
    website: z.string(),
    blusky: z.string(),
    email: z.string(),
  }),
});

export const collections = { post, authors };
