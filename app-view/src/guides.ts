/**
 * Single source of truth for the guides section.
 *
 * app/sitemap.ts, app/(main)/page.tsx and app/(main)/guides/page.tsx all read
 * from this array. Adding an entry here puts the guide in the sitemap, the
 * landing page grid and the guides index in one edit.
 *
 * Adding a directory under app/(main)/guides/ WITHOUT adding it here builds a
 * page that nothing links to and the sitemap never mentions.
 *
 * `lastModified` is set by hand on purpose. Deriving it from `new Date()` at
 * build time re-stamps every URL on every deploy, and Google discounts lastmod
 * values that churn without the content changing. Bump the date here only when
 * you actually rewrite the guide.
 */
export type Guide = {
  slug: string;
  /** Used as the link text on both the landing page and the guides index. */
  title: string;
  /** Short version for the landing page card grid. */
  cardBlurb: string;
  /** Longer version for the guides index. */
  blurb: string;
  /** YYYY-MM-DD. Feeds <lastmod> in the sitemap. */
  lastModified: string;
};

export const GUIDES: readonly Guide[] = [
  {
    slug: "mini-golf-rules",
    title: "Mini Golf Rules, Explained Plainly",
    cardBlurb: "Order of play, max strokes, and the ones every group argues about.",
    blurb:
      "The rules groups argue about most: order of play, max strokes, and what happens when the ball leaves the felt.",
    lastModified: "2026-08-22",
  },
  {
    slug: "how-to-score-mini-golf",
    title: "How to Score Mini Golf",
    cardBlurb: "Par, bogey, and what to do when Uncle Rob takes eleven on hole 4.",
    blurb:
      "Par, bogey, and what to do when Uncle Rob takes eleven on hole 4. With and without an app.",
    lastModified: "2026-08-22",
  },
  {
    slug: "mini-golf-birthday-party-ideas",
    title: "Mini Golf Birthday Party Ideas",
    cardBlurb: "Group sizes, prizes, and how to keep 8-year-olds from throwing clubs.",
    blurb:
      "Group sizes, prizes, and how to keep 8-year-olds moving without a meltdown.",
    lastModified: "2026-08-22",
  },
  {
    slug: "mini-golf-scoring-cheat-sheet",
    title: "Mini Golf Scoring Cheat Sheet",
    cardBlurb: "Par by hole, max strokes, and how to break a tie without a rematch.",
    blurb: "Par by hole count, max strokes, tiebreakers. A one-screen reference.",
    lastModified: "2026-08-22",
  },
  {
    slug: "backyard-mini-golf",
    title: "How to Build a Backyard Mini Golf Course",
    cardBlurb: "Nine holes with pool noodles, PVC, and stuff already in the garage.",
    blurb:
      "Nine holes with pool noodles, PVC, and whatever is already in the garage.",
    lastModified: "2026-08-22",
  },
  {
    slug: "printable-mini-golf-scorecard",
    title: "Printable Mini Golf Scorecard (and a faster way)",
    cardBlurb: "PDF you can print. Plus the app version that adds it up for you.",
    blurb:
      "A free PDF you can print. Plus the app version that adds up the total for you.",
    lastModified: "2026-08-22",
  },
];
