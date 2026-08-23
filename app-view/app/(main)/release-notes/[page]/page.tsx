import type { Metadata } from "next";
import { ReleaseNote } from "@/components/release_note/release_note";
import { ReleaseNotesPagination } from "@/components/release_notes_pagination/release_notes_pagination";
import { MAX_RELEASE_NOTES_PER_PAGE } from "@/constants";
import {
  readReleaseNotesPage,
  readTotalReleaseNotesPageCount,
} from "@/lib/release_notes_helpers";

/**
 * /release-notes/1 renders the same notes as /release-notes, so it points its
 * canonical there instead of competing with it. Later pages hold different
 * notes and are self-canonical. Without this the whole route would inherit
 * `canonical: "/"` from app/(main)/layout.tsx and claim to be the homepage.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const { page } = await params;
  const pageNumber = Number(page);

  return {
    title: "Release Notes · Mini Golf Score Tracker",
    description:
      "What changed in each version of Mini Golf Score Tracker for iPhone and web.",
    alternates: {
      canonical:
        pageNumber <= 1 ? "/release-notes" : `/release-notes/${pageNumber}`,
    },
  };
}

export default async function ReleaseNotesPage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  const totalPageCount = await readTotalReleaseNotesPageCount(
    MAX_RELEASE_NOTES_PER_PAGE,
  );
  const notes = await readReleaseNotesPage(
    Number(page),
    MAX_RELEASE_NOTES_PER_PAGE,
  );

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
          currentPage={Number(page)}
          totalPageCount={totalPageCount}
        />
      )}
    </>
  );
}

export async function generateStaticParams() {
  const totalPageCount = await readTotalReleaseNotesPageCount(
    MAX_RELEASE_NOTES_PER_PAGE,
  );

  return Array.from({
    length: totalPageCount,
  }).map((_, index) => ({
    page: String(index + 1),
  }));
}

export const dynamicParams = false;
