import { DownloadActionButton } from "@/components/download_action_button/download_action_button";
import styles from "./guide_meta.module.css";

interface GuideMetaProps {
  slug: string;
  title: string;
  description: string;
  datePublished: string;
}

const HOST = "https://minigolfscoretracker.com";

function articleJsonLd({ slug, title, description, datePublished }: GuideMetaProps) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    author: { "@type": "Person", name: "Mohammad Zayed" },
    publisher: {
      "@type": "Organization",
      name: "Mini Golf Score Tracker",
    },
    datePublished,
    dateModified: datePublished,
    mainEntityOfPage: `${HOST}/guides/${slug}`,
    url: `${HOST}/guides/${slug}`,
  };
}

function breadcrumbJsonLd({ slug, title }: GuideMetaProps) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${HOST}/` },
      { "@type": "ListItem", position: 2, name: "Guides", item: `${HOST}/guides` },
      { "@type": "ListItem", position: 3, name: title, item: `${HOST}/guides/${slug}` },
    ],
  };
}

export function GuideMeta(props: GuideMetaProps) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd(props)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(props)) }}
      />
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
        <a href="/">Home</a>
        <span aria-hidden="true"> / </span>
        <a href="/guides">Guides</a>
        <span aria-hidden="true"> / </span>
        <span aria-current="page">{props.title}</span>
      </nav>
    </>
  );
}

interface GuideCTAProps {
  hook: string;
}

export function GuideCTA({ hook }: GuideCTAProps) {
  return (
    <aside className={styles.cta}>
      <h3 className={styles.ctaTitle}>Keep score without the tiny pencil</h3>
      <p className={styles.ctaBody}>{hook}</p>
      <div className={styles.ctaActions}>
        <DownloadActionButton size="medium" label="Get it free" />
        <a href="/web" className={styles.ctaSecondary}>
          <span aria-hidden="true">⛳</span>
          Play in the browser
        </a>
      </div>
    </aside>
  );
}
