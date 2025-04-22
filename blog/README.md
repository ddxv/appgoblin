# Blog

This templates used [Astro](https://astro.build/), [Tailwind](https://tailwindcss.com/), and [Skeleton](https://www.skeletonlabs.co/) along with a curated template created and implemented by the the creators of Skeleton.

## How To Install

Find installation instructions within the FAQ here:

https://github.com/skeletonlabs/skeleton-templates

## Themes

This template comes pre-configured with the "Cerberus" theme. See customizations in `/src/styles/global.css`.

[Learn more about customizing themes here](https://www.skeleton.dev/docs/design/themes).

## Project Structure

The following is located in `/src`.

- `/components` - the local components such as header, footer, etc.
- `/content` - The MDX content or blog post and authors.
- `/layouts` - The page and blog post layouts.
- `/pages` - The individual page templates.
- `/styles` - Contains the global stylesheet `globals.css`.
- `constants.ts` - Static data shared throughout the application.
- `content.conig.ts` - Uses Zod to enable type safety for [Astro Content Collections](https://docs.astro.build/en/reference/modules/astro-content/).

## Media

Media such as blog images can be located in the `/public` directory.

## Routes

All rountes can be found in the `/src/routes` directory. This template includes:

- `/` - the homepage of the website.
- `/blog` - a grid list of the blogroll.
- `/blog/{postFileName}` - each individual blog post.
- `/about` - learn more about the project.
- `/sandbox` - a hidden sandbox page for testing theme styles.

## Testing Sandbox

A hidden sandbox page has been provided at `/sandbox`. This allows you to quickly preview and test various Skeleton elements and components, including: typography, buttons, the color palette, and more. This route can be deleted at your own discretion.

## Additional Assets

- Icons from https://lucide.dev/
- Images from Unsplash https://unsplash.com/

## License

This template is served under the terms of the [Personal License](https://v2.skeleton.dev/docs/sponsorship/licensing). Contact [Skeleton Labs](mailto:admin@skeletonlabs.dev) if you are interested in obtaining either a Commercial or Enterprise license.

## Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `pnpm install`             | Installs dependencies                            |
| `pnpm dev`             | Starts local dev server at `localhost:4321`      |
| `pnpm build`           | Build your production site to `./dist/`          |
| `pnpm preview`         | Preview your build locally, before deploying     |
| `pnpm astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `pnpm astro -- --help` | Get help using the Astro CLI                     |