import { APP_ID, IS_WAITLIST_ENABLED, THEME } from "@/constants";
import type { Metadata, Viewport } from "next";

import { AppIcon } from "@/components/app_icon/app_icon";
import { CompactFooter } from "@/components/compact_footer/compact_footer";
import { DownloadActionButton } from "@/components/download_action_button/download_action_button";
import { EmailForm } from "@/components/email_form/email_form";
import { Hero } from "@/components/hero/hero";
import { MaterialSymbolsLink } from "@/components/material_symbols_link/material_symbols_link";
import { Navbar } from "@/components/navbar/navbar";
import { ThemeStyle } from "@/components/theme_style/theme_style";
import "@/global.css";
import { ThemeProvider } from "@/providers/theme_provider";

export const metadata: Metadata = {
  /**
   * `title` and `description` are visible in search results.
   * Recommended length for title is max 60 characters.
   * Recommended length for description is max 160 characters.
   */
  title: "Mini Golf Score Tracker - Track Scores with Friends & Family",
  description: "The easiest way to track mini golf scores with friends and family. Create custom courses, add unlimited players, and celebrate winners with confetti. Works offline!",

  /**
   * Your website URL.
   */
  metadataBase: new URL("https://minigolfscoretracker.com"),

  /**
   * Info inside `openGraph` and `twitter` is used to show rich previews
   * on social media when someone shares a link to your website.
   *
   * AppView comes with a tool to help you generate an Open Graph image,
   * run the dev server and go to `http://localhost:3000/open-graph-builder`.
   */
  openGraph: {
    title: "Mini Golf Score Tracker",
    description: "Track mini golf scores with friends and family. Create custom courses, add unlimited players, and celebrate winners!",
    url: "https://minigolfscoretracker.com/app",
    images: [
      {
        url: "/og-preview.png",
        width: 1200,
        height: 720,
        alt: "Mini Golf Score Tracker App",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mini Golf Score Tracker",
    description: "Track mini golf scores with friends and family. Create custom courses, add unlimited players, and celebrate winners!",
    images: ["/og-preview.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme={THEME}>
      <head>
        {/* This makes Safari on iOS show the App Store download banner */}
        <meta name="apple-itunes-app" content={`app-id=${APP_ID}`} />

        <link rel="icon" href="/favicon.png" type="image/png" sizes="48x48" />

        <ThemeStyle />
        <MaterialSymbolsLink />
      </head>
      <body>
        <ThemeProvider>
          {!IS_WAITLIST_ENABLED && (
            <>
              <Navbar
                icon={<AppIcon src="/app_view/icon_placeholder.png" />}
                appName="Mini Golf Score Tracker"
                links={[
                  { label: "Features", href: "#features" },
                  { label: "Contact", href: "mailto:mohammadzayed521@gmail.com" },
                ]}
                action={<DownloadActionButton />}
              />

              {children}

              {/*
                There is also a <MultiColumnFooter> component available
                in case you need more space for links.
              */}
              <CompactFooter
                appIcon={
                  <AppIcon
                    src="/app_view/icon_placeholder.png"
                    filter="grayscale"
                  />
                }
                links={[
                  { label: "Privacy", href: "/privacy" },
                  {
                    label: "Terms of Use",
                    href: "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/",
                    external: true,
                  },
                  {
                    label: "Contact",
                    href: "mailto:mohammadzayed521@gmail.com",
                  },
                ]}
                footnoteLeading={`© ${new Date().getFullYear()} Mini Golf Score Tracker. All rights reserved.`}
                footnoteTrailing={
                  // I'd appreciate if you leave this link here, but feel free to remove it, no hard feelings :)
                  <>
                    Website is built with{" "}
                    <a target="_blank" href="https://appview.dev">
                      AppView
                    </a>
                  </>
                }
              />
            </>
          )}

          {IS_WAITLIST_ENABLED && (
            <Hero
              title="App Title"
              subtitle="Short app description that highlights what the app does and its key value"
              media={
                <Hero.Image
                  src="/app_view/screenshot_placeholder.png"
                  alt=""
                  bezel="iPhone 17 Black"
                />
              }
              action={
                <>
                  <EmailForm
                    providerConfig={{
                      provider: "loops",
                      config: {
                        formId: "your-loops-form-id",
                      },
                    }}
                  />
                  {/*
                    You can also use a simple button to redirect users
                    to a custom page where you collect emails
                  */}
                  {/* <GetNotifiedActionButton href="your-email-form-link" /> */}
                </>
              }
            />
          )}
        </ThemeProvider>

        {/* <PlausibleAnalytics domain="your-app-domain.com" /> */}
        {/* <VercelAnalytics /> */}
      </body>
    </html>
  );
}
