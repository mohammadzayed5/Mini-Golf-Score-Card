import { DownloadActionButton } from "@/components/download_action_button/download_action_button";
import { Hero } from "@/components/hero/hero";
import { RatingLaurelsBadge } from "@/components/rating_laurels_badge/rating_laurels_badge";
import { Section } from "@/components/section/section";
import styles from "./page.module.css";

const HOW_IT_WORKS = [
  {
    step: "01",
    emoji: "👥",
    title: "Pick your players",
    body: "Add the crew — no signup, no accounts. Whoever showed up.",
  },
  {
    step: "02",
    emoji: "⛳",
    title: "Tap through the holes",
    body: "Score hole-by-hole with big buttons. Works offline, so it doesn’t matter if the course has Wi-Fi.",
  },
  {
    step: "03",
    emoji: "🏆",
    title: "Crown the winner",
    body: "Confetti, a leaderboard, and a running win count that sticks around for next time.",
  },
];

const FEATURES = [
  {
    emoji: "🏆",
    title: "Live leaderboard",
    body: "See who’s winning after every hole, updated in real time.",
  },
  {
    emoji: "⛳",
    title: "Custom courses",
    body: "Any number of holes, any course name. Save it, reuse it.",
  },
  {
    emoji: "👨‍👩‍👧",
    title: "Unlimited players",
    body: "Two friends or a whole family reunion — no player cap.",
  },
  {
    emoji: "✈️",
    title: "Works offline",
    body: "Start and finish a full game with no signal. Nothing gets lost.",
  },
  {
    emoji: "📊",
    title: "Winner history",
    body: "Wins persist per player across games — the running scoreboard your family will actually argue about.",
  },
  {
    emoji: "🚀",
    title: "No signup needed",
    body: "Guest mode is fully featured. Sign in only if you want sync.",
  },
];

const FAQ = [
  {
    q: "Do I need an account?",
    a: "No. Guest mode works fully offline and everything saves to your device. Sign up only if you want your history to sync across devices.",
  },
  {
    q: "Does it work without internet?",
    a: "Yes — you can start and finish a whole game with no signal. Scores sync when you’re back online (if you’re signed in).",
  },
  {
    q: "How many players can I add?",
    a: "As many as you want. Two, twelve, whole birthday party — no limit.",
  },
  {
    q: "Can I customize the course?",
    a: "Yep. Set any number of holes (1–36), name the course whatever you want.",
  },
  {
    q: "Is it free?",
    a: "Yes. Free on iOS and free in the browser. No paywalls.",
  },
];

export default function Page() {
  return (
    <>
      <Section paddingTop={100}>
        <Hero
          title="Mini golf scores, minus the paper scorecard"
          subtitle="The easiest way to track mini golf with friends and family. Add unlimited players, score hole-by-hole, and celebrate the winner — offline-friendly and free."
          media={
            <Hero.Image
              src="/app_view/Simulator Screenshot - iPhone 17 Pro Max - 2025-11-11 at 00.49.16.png"
              bezel="iPhone 17 Black"
              alt="Mini Golf Score Tracker home screen"
            />
          }
          badges={
            <RatingLaurelsBadge
              showStars={true}
              rating={5.0}
              caption="App Store rating"
            />
          }
          action={
            <div className={styles.heroActions}>
              <DownloadActionButton size="medium" />
              <a href="/web" className={styles.playInBrowserButton}>
                <span className={styles.playEmoji} aria-hidden="true">
                  ⛳
                </span>
                Play in browser
              </a>
            </div>
          }
        />
      </Section>

      <Section navigationAnchor="how-it-works" title="How it works">
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

      <Section navigationAnchor="features" title="Everything you need. Nothing you don’t.">
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

      <Section navigationAnchor="faq" title="Questions">
        <div className={styles.faqList}>
          {FAQ.map((item) => (
            <details key={item.q} className={styles.faqItem}>
              <summary className={styles.faqQuestion}>{item.q}</summary>
              <p className={styles.faqAnswer}>{item.a}</p>
            </details>
          ))}
        </div>
      </Section>

      <Section paddingTop={80} paddingBottom={160}>
        <div className={styles.finalCta}>
          <h2 className={styles.finalCtaTitle}>
            Grab your putter. Grab the app.
          </h2>
          <p className={styles.finalCtaSubtitle}>
            Free on iOS and in the browser. No signup, no ads inside your game.
          </p>
          <div className={styles.finalCtaActions}>
            <DownloadActionButton size="medium" />
            <a href="/web" className={styles.playInBrowserButton}>
              <span className={styles.playEmoji} aria-hidden="true">
                ⛳
              </span>
              Play in browser
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}
