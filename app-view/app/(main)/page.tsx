import Link from "next/link";
import { DownloadActionButton } from "@/components/download_action_button/download_action_button";
import { Hero } from "@/components/hero/hero";
import { Section } from "@/components/section/section";
import { GUIDES } from "@/guides";
import styles from "./page.module.css";

/**
 * FAQ is the single source of truth. The visible <details> list below AND the
 * FAQPage JSON-LD are both rendered from this array, so they stay byte-identical.
 * WARNING: if you edit the wording, you are updating both the visible copy and
 * the schema in one shot, and that is intentional. Do NOT hand-edit the schema.
 */
type FaqItem = {
  q: string;
  a: string;
  learnMore?: { href: string; label: string };
};

const FAQ: readonly FaqItem[] = [
  {
    q: "Is it free?",
    a: "Yeah, free on iPhone and free in the browser. On the iPhone version, a small ad banner shows up on a couple of screens to keep the servers running. No paywalls, no upsell.",
  },
  {
    q: "Do I need an account?",
    a: "Nope. Guest mode saves everything on your phone. Make an account only if you want your games and player stats to follow you between the app and the web.",
    learnMore: { href: "/guides/how-to-score-mini-golf", label: "How the app scores each round" },
  },
  {
    q: "Does it work without internet?",
    a: "Yes. Start and finish a whole round in airplane mode. If you are signed in, the scores sync back up next time you get bars.",
  },
  {
    q: "How many players can I add?",
    a: "As many as you want. I have run it with twelve at a birthday party and nothing broke.",
  },
  {
    q: "Can I set the number of holes?",
    a: "Yes. Pick any hole count when you set up the course, and the app remembers the course name for next time.",
    learnMore: { href: "/guides/mini-golf-rules", label: "How mini golf scoring works" },
  },
  {
    q: "Does it keep track of wins across games?",
    a: "Yes. Every player has a win count that carries over, so the ongoing family championship has receipts.",
  },
  {
    q: "Any tips for planning a mini golf birthday?",
    a: "Two big ones: keep groups to four so the pace stays fun, and let one kid per group hold the phone so nobody argues over whose turn it is to tap. There is a full playbook in the guide.",
    learnMore: { href: "/guides/mini-golf-birthday-party-ideas", label: "Birthday party playbook" },
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    emoji: "👥",
    title: "Add everyone playing",
    body: "Type in the names. Two friends or the whole birthday party, up to you.",
  },
  {
    step: "02",
    emoji: "⛳",
    title: "Tap in each hole",
    body: "Big +/− buttons for the score. Big enough to hit while someone is arguing about their 7.",
  },
  {
    step: "03",
    emoji: "🏆",
    title: "See who won",
    body: "Confetti at the end, plus a running win tally so nobody forgets who the family champ is.",
  },
];

const FEATURES = [
  {
    emoji: "🏆",
    title: "Live leaderboard",
    body: "Peek mid-round to see who is leading after every hole.",
  },
  {
    emoji: "⛳",
    title: "Any course, any hole count",
    body: "Set 9, 18, or whatever hole count the course has. Name it, save it, reuse it next time.",
  },
  {
    emoji: "👨‍👩‍👧",
    title: "Bring the whole crew",
    body: "No player cap. Two friends or a party of twelve, both work.",
  },
  {
    emoji: "✈️",
    title: "Works with no signal",
    body: "Play a full round on airplane mode. Scores stay put and sync later if you are signed in.",
  },
  {
    emoji: "📊",
    title: "Wins that stick around",
    body: "Every player has a running win count. The family rivalry finally has receipts.",
  },
  {
    emoji: "🚀",
    title: "No signup wall",
    body: "Guest mode is the full app. Sign in only if you want history across devices.",
  },
];

const APP_STORE_URL = "https://apps.apple.com/app/id6755137607";

function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

function appJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "MobileApplication",
    name: "Mini Golf Score Tracker",
    operatingSystem: "iOS",
    applicationCategory: "SportsApplication",
    downloadUrl: APP_STORE_URL,
    url: "https://minigolfscoretracker.com/",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Person",
      name: "Mohammad Zayed",
    },
  };
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd()) }}
      />

      <Section paddingTop={100}>
        <Hero
          title="Keep score without the golf pencil"
          subtitle="Add everyone playing, tap in each hole, and watch the leaderboard update as you go. Free on iPhone and web. Works when the course has zero bars."
          media={
            <Hero.Image
              src="/app_view/Simulator Screenshot - iPhone 17 Pro Max - 2025-11-11 at 00.49.16.png"
              bezel="iPhone 17 Black"
              alt="Mini Golf Score Tracker home screen on iPhone"
            />
          }
          action={
            <div className={styles.heroActions}>
              <DownloadActionButton size="medium" label="Get it free" />
              <a href="/web" className={styles.playInBrowserButton}>
                <span className={styles.playEmoji} aria-hidden="true">
                  ⛳
                </span>
                Play in the browser
              </a>
            </div>
          }
        />
      </Section>

      <Section navigationAnchor="how-it-works" title="How a round goes">
        <div className={styles.stepsGrid}>
          {HOW_IT_WORKS.map((step) => (
            <article key={step.step} className={styles.stepCard}>
              <div className={styles.stepNumber}>{step.step}</div>
              <div className={styles.stepEmoji} aria-hidden="true">
                {step.emoji}
              </div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepBody}>{step.body}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section navigationAnchor="features" title="What it does on a round">
        <div className={styles.featuresGrid}>
          {FEATURES.map((feature) => (
            <article key={feature.title} className={styles.featureCard}>
              <div className={styles.featureEmoji} aria-hidden="true">
                {feature.emoji}
              </div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureBody}>{feature.body}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section navigationAnchor="guides" title="Planning a round or a party?">
        <p className={styles.guidesLead}>
          Quick guides for the questions people search before a round.
        </p>
        <div className={styles.guidesGrid}>
          {GUIDES.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className={styles.guideCard}
            >
              <h3 className={styles.guideTitle}>{guide.title}</h3>
              <p className={styles.guideBlurb}>{guide.cardBlurb}</p>
              <span className={styles.guideArrow} aria-hidden="true">
                Read →
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <Section navigationAnchor="faq" title="Questions people ask before downloading">
        <div className={styles.faqList}>
          {FAQ.map((item) => (
            <details key={item.q} className={styles.faqItem}>
              <summary className={styles.faqQuestion}>{item.q}</summary>
              <p className={styles.faqAnswer}>{item.a}</p>
              {item.learnMore && (
                <p className={styles.faqLearnMore}>
                  <Link href={item.learnMore.href}>
                    Learn more: {item.learnMore.label} →
                  </Link>
                </p>
              )}
            </details>
          ))}
        </div>
      </Section>

      <Section paddingTop={80} paddingBottom={160}>
        <div className={styles.finalCta}>
          <h2 className={styles.finalCtaTitle}>
            Grab it before your next round
          </h2>
          <p className={styles.finalCtaSubtitle}>
            Free download. First hole in about a minute.
          </p>
          <div className={styles.finalCtaActions}>
            <DownloadActionButton size="medium" label="Get it free" />
            <a href="/web" className={styles.playInBrowserButton}>
              <span className={styles.playEmoji} aria-hidden="true">
                ⛳
              </span>
              Play in the browser
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}
