import { CardGrid } from "@/components/card_grid/card_grid";
import { DownloadActionButton } from "@/components/download_action_button/download_action_button";
import { Hero } from "@/components/hero/hero";
import { RatingLaurelsBadge } from "@/components/rating_laurels_badge/rating_laurels_badge";
import { Section } from "@/components/section/section";

export default function Page() {
  return (
    <>
      <Section paddingTop={100}>
        <Hero
          title="Mini Golf Score Tracker"
          subtitle="Track your mini golf scores with friends and family. The easiest way to keep score and celebrate winners!"
          media={
            <Hero.Image
              src="/app_view/Simulator Screenshot - iPhone 17 Pro Max - 2025-11-11 at 00.49.16.png"
              bezel="iPhone 17 Black"
              alt="Mini Golf Score Tracker home screen"
            />
          }
          badges={
            <>
              <RatingLaurelsBadge
                showStars={true}
                rating={5.0}
                caption="App Store rating"
              />
            </>
          }
          action={<DownloadActionButton size="medium" />}
        />
      </Section>

      <Section navigationAnchor="features">
        <CardGrid rowHeight={438}>
          <CardGrid.StackedCard
            maxWidth="twoThirds"
            title="Create Custom Courses"
            description="Set up any course with any number of holes. Whether it's 9, 18, or your local course's unique layout."
            media={
              <CardGrid.StackedCard.Image
                src="/app_view/Simulator Screenshot - iPhone 17 Pro Max - 2025-11-11 at 00.50.38.png"
                alt="Create custom mini golf courses"
                bezel="iPhone 17 Black"
              />
            }
            textAlignment="leading"
          />

          <CardGrid.StackedCard
            maxWidth="third"
            title="Unlimited Players"
            description="Add as many players as you want - perfect for family gatherings and group outings."
            media={
              <CardGrid.StackedCard.Image
                src="/app_view/Simulator Screenshot - iPhone 17 Pro Max - 2025-11-11 at 00.51.02.png"
                alt="Add unlimited players to your game"
                bezel="iPhone 17 Black"
                bezelCrop={{ edge: "bottom", croppedRatio: 0.1 }}
              />
            }
            textAlignment="leading"
          />

          <CardGrid.StackedCard
            maxWidth="third"
            title="Real-Time Score Tracking"
            description="Track scores hole by hole with an intuitive, easy-to-use interface."
            media={
              <CardGrid.StackedCard.Image
                src="/app_view/Simulator Screenshot - iPhone 17 Pro Max - 2025-11-11 at 00.51.49.png"
                alt="Track scores in real-time during your game"
                bezel="iPhone 17 Black"
                bezelCrop={{ edge: "bottom", croppedRatio: 0.25 }}
              />
            }
            textAlignment="leading"
          />

          <CardGrid.StackedCard
            maxWidth="twoThirds"
            title="Celebrate Winners"
            titleFontStyle="cursive"
            description="Beautiful winner celebration with confetti animation makes every victory special!"
            layoutDirection="reverse"
            media={
              <CardGrid.StackedCard.Image
                src="/app_view/Simulator Screenshot - iPhone 17 Pro Max - 2025-11-11 at 00.52.03.png"
                alt="Winner celebration with confetti"
                bezel="iPhone 17 Black"
              />
            }
            textAlignment="leading"
          />

          <CardGrid.StackedCard
            maxWidth="half"
            title="Game History"
            description="View complete game history and track your wins over time."
            media={
              <CardGrid.StackedCard.Image
                src="/app_view/Simulator Screenshot - iPhone 17 Pro Max - 2025-11-11 at 00.52.09.png"
                bezel="iPhone 17 Black"
                bezelCrop={{ edge: "bottom", croppedRatio: 0.5 }}
                alt="View your complete game history"
              />
            }
            layoutDirection="reverse"
            textAlignment="center"
          />

          <CardGrid.StackedCard
            maxWidth="half"
            title="Track Your Stats"
            description="See your best holes, holes-in-one, and other achievements."
            media={
              <CardGrid.StackedCard.Image
                src="/app_view/Simulator Screenshot - iPhone 17 Pro Max - 2025-11-11 at 00.52.03.png"
                bezel="iPhone 17 Black"
                bezelCrop={{ edge: "top", croppedRatio: 0.5 }}
                alt="Track your statistics and achievements"
              />
            }
            layoutDirection="forward"
            textAlignment="center"
          />
        </CardGrid>
      </Section>

      <Section title="Perfect For">
        <CardGrid rowHeight={280}>
          <CardGrid.IconCard
            maxWidth="third"
            iconName="target"
            title="Family Outings"
            description="Make family mini golf trips more fun and organized with easy score tracking"
          />

          <CardGrid.IconCard
            maxWidth="third"
            iconName="star"
            title="Competitive Games"
            description="Keep accurate scores when competing with friends and see who's the real champion"
          />

          <CardGrid.IconCard
            maxWidth="third"
            iconName="check_circle"
            title="Personal Records"
            description="Track your personal bests and improvement over time at your favorite courses"
          />
        </CardGrid>
      </Section>

      <Section title="Key Features">
        <CardGrid rowHeight={280}>
          <CardGrid.IconCard
            maxWidth="half"
            iconName="check_circle"
            title="Works Offline"
            description="No internet required during games - track scores anywhere, anytime"
          />

          <CardGrid.IconCard
            maxWidth="half"
            iconName="check_circle"
            title="Clean Interface"
            description="Beautiful, intuitive design that's easy for everyone to use"
          />
        </CardGrid>
      </Section>

      <Section paddingTop={60} paddingBottom={160}>
        <DownloadActionButton
          href="https://apps.apple.com/app/id6755137607"
          size="medium"
        />
      </Section>
    </>
  );
}
