import type { MetadataRoute } from "next";
import { GUIDES } from "@/guides";

export const dynamic = "force-static";

const HOST = "https://minigolfscoretracker.com";

/**
 * Two rules this file has to keep, because breaking either one quietly costs
 * indexing rather than failing the build:
 *
 * 1. Every URL here must be self-canonical. app/(main)/layout.tsx sets
 *    `alternates.canonical: "/"`, and any page that does not override it
 *    inherits a canonical pointing at the homepage. Listing such a page here
 *    tells Google "index this" and "this is really the homepage" at the same
 *    time, and the URL gets dropped. If you add a route, give it its own
 *    `alternates.canonical` before adding it below.
 *
 * 2. `lastModified` is a hand-set date, never `new Date()`. A build-time
 *    timestamp re-stamps all URLs on every deploy, which trains crawlers to
 *    ignore lastmod. Guide dates live in src/guides.ts; core page dates are
 *    below. Bump them when the content actually changes.
 *
 * Deliberately absent:
 *   /web/*             client-rendered SPA shell, canonicals to /, and
 *                      netlify.toml serves every /web/* path as a 200. Also
 *                      disallowed in app/robots.ts.
 *   /release-notes/1   byte-identical to /release-notes; canonicalised to it.
 *   /open-graph-builder  internal dev tool, noindex.
 */
type CorePage = {
  path: string;
  lastModified: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
};

const CORE_PAGES: readonly CorePage[] = [
  { path: "/", lastModified: "2026-08-22", changeFrequency: "monthly", priority: 1.0 },
  { path: "/guides", lastModified: "2026-08-22", changeFrequency: "monthly", priority: 0.8 },
  { path: "/release-notes", lastModified: "2026-02-10", changeFrequency: "monthly", priority: 0.4 },
  { path: "/privacy", lastModified: "2026-02-10", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", lastModified: "2026-02-10", changeFrequency: "yearly", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...CORE_PAGES.map((page) => ({
      url: `${HOST}${page.path}`,
      lastModified: page.lastModified,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    ...GUIDES.map((guide) => ({
      url: `${HOST}/guides/${guide.slug}`,
      lastModified: guide.lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
