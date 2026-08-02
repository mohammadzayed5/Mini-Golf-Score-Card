import { APP_ID, IS_WAITLIST_ENABLED, THEME } from "@/constants";
import type { Metadata, Viewport } from "next";
import Script from "next/script";

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

        <Script id="posthog-init" strategy="afterInteractive">
          {`!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug getPageViewId captureTraceFeedback captureTraceMetric".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
posthog.init('phc_vT9jNWLVXpgdteCtgZmdqnyNSQMUSPdePzwsnYFMS3Rc',{api_host:'https://us.i.posthog.com',defaults:'2026-05-30',person_profiles:'identified_only'});`}
        </Script>
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
