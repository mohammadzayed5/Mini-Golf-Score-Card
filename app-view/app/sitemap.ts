import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const HOST = "https://minigolfscoretracker.com";

const GUIDE_SLUGS = [
  "mini-golf-rules",
  "how-to-score-mini-golf",
  "mini-golf-birthday-party-ideas",
  "mini-golf-scoring-cheat-sheet",
  "backyard-mini-golf",
  "printable-mini-golf-scorecard",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${HOST}/`, lastModified: now, changeFrequency: "monthly", priority: 1.0 },
    { url: `${HOST}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${HOST}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${HOST}/release-notes`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    ...GUIDE_SLUGS.map((slug) => ({
      url: `${HOST}/guides/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
