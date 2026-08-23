import Link from "next/link";
import type { Metadata } from "next";
import { GUIDES } from "@/guides";

export const metadata: Metadata = {
  title: "Mini Golf Guides · Rules, Scoring, Party Ideas",
  description: "Plain-English guides to mini golf: rules, scoring, birthday party planning, and how to build a backyard course.",
  alternates: { canonical: "/guides" },
};

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
