import type { Metadata } from "next";
import { ReleaseNote } from "@/components/release_note/release_note";
import { ReleaseNotesPagination } from "@/components/release_notes_pagination/release_notes_pagination";
import { MAX_RELEASE_NOTES_PER_PAGE } from "@/constants";
import {
  readReleaseNotesPage,
  readTotalReleaseNotesPageCount,
} from "@/lib/release_notes_helpers";

/**
 * Without this, the page inherits `canonical: "/"` from app/(main)/layout.tsx
 * and tells Google it is the homepage, which un-indexes it.
 */
export const metadata: Metadata = {
  title: "Release Notes · Mini Golf Score Tracker",
  description:
    "What changed in each version of Mini Golf Score Tracker for iPhone and web.",
  alternates: { canonical: "/release-notes" },
};

export default async function ReleaseNotesIndexPage() {
  const totalPageCount = await readTotalReleaseNotesPageCount(
    MAX_RELEASE_NOTES_PER_PAGE
  );
  const notes = await readReleaseNotesPage(1, MAX_RELEASE_NOTES_PER_PAGE);

  return (
    <>
      {notes.map((note) => (
        <ReleaseNote
          key={note.slug}
          title={note.title}
          publishDate={note.publishDate}
          content={<note.content />}
        />
      ))}

      {totalPageCount > 1 && (
        <ReleaseNotesPagination
          currentPage={1}
          totalPageCount={totalPageCount}
        />
      )}
    </>
  );
}
