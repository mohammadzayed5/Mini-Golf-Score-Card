import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const HOST = "https://minigolfscoretracker.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        // Internal dev tool, not linked from anywhere public.
        "/open-graph-builder",
        // The Vite app under /web is a client-rendered shell: the HTML holds no
        // content, and it already canonicals to /. netlify.toml rewrites
        // /web/* to /web/index.html with a 200, so every path under /web
        // answers 200 with the same markup and there is no 404 to stop a
        // crawler. Blocking the prefix keeps that unbounded space out of the
        // crawl budget. Users reaching /web from the landing page are
        // unaffected; robots.txt does not gate humans.
        "/web",
      ],
    },
    sitemap: `${HOST}/sitemap.xml`,
    host: HOST,
  };
}
