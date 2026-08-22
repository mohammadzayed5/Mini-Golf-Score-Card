import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mini Golf Guides · Rules, Scoring, Party Ideas",
  description: "Plain-English guides to mini golf: rules, scoring, birthday party planning, and how to build a backyard course.",
  alternates: { canonical: "/guides" },
};

const GUIDES = [
  {
    slug: "mini-golf-rules",
    title: "Mini Golf Rules, Explained Plainly",
    blurb: "The rules groups argue about most: order of play, max strokes, and what happens when the ball leaves the felt.",
  },
  {
    slug: "how-to-score-mini-golf",
    title: "How to Score Mini Golf",
    blurb: "Par, bogey, and what to do when Uncle Rob takes eleven on hole 4. With and without an app.",
  },
  {
    slug: "mini-golf-birthday-party-ideas",
    title: "Mini Golf Birthday Party Ideas",
    blurb: "Group sizes, prizes, and how to keep 8-year-olds moving without a meltdown.",
  },
  {
    slug: "mini-golf-scoring-cheat-sheet",
    title: "Mini Golf Scoring Cheat Sheet",
    blurb: "Par by hole count, max strokes, tiebreakers. A one-screen reference.",
  },
  {
    slug: "backyard-mini-golf",
    title: "How to Build a Backyard Mini Golf Course",
    blurb: "Nine holes with pool noodles, PVC, and whatever is already in the garage.",
  },
  {
    slug: "printable-mini-golf-scorecard",
    title: "Printable Mini Golf Scorecard (and a faster way)",
    blurb: "A free PDF you can print. Plus the app version that adds up the total for you.",
  },
];

export default function GuidesIndex() {
  return (
    <>
      <h1>Mini Golf Guides</h1>
      <p>
        Real answers to the questions people search before a round. Rules, scoring, party planning,
        and how to build a course in the backyard.
      </p>
      <ul>
        {GUIDES.map((g) => (
          <li key={g.slug}>
            <Link href={`/guides/${g.slug}`}>
              <strong>{g.title}</strong>
            </Link>
            <br />
            <span style={{ opacity: 0.75 }}>{g.blurb}</span>
          </li>
        ))}
      </ul>
    </>
  );
}
