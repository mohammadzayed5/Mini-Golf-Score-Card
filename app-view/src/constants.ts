import { Caveat, Dancing_Script } from "next/font/google";
import { ColorScheme } from "./types/shared";

/**
 * "system" - follows the user's system appearance
 * "light" - forces your website to always use light theme
 * "dark" - forces your website to always use dark theme
 */
export const THEME: "system" | "light" | "dark" = "system";

/**
 * Your App Store App ID without the 'id' prefix.
 * You can find it in your App Store Connect.
 * Go to your app -> App Information -> Apple ID.
 *
 * Example: "6502667826"
 */
export const APP_ID = "6755137607";

/**
 * Google Search Console site verification token.
 *
 * Leave this empty. minigolfscoretracker.com is already verified in Search
 * Console as a *domain* property (sc-domain:minigolfscoretracker.com), which
 * is verified by DNS TXT record and covers every subdomain and both http and
 * https. That is strictly stronger than an HTML meta tag, so no tag is needed
 * and app/(main)/layout.tsx omits it while this is empty.
 *
 * This only exists as a fallback: if the DNS TXT record is ever lost (domain
 * transfer, nameserver change) and re-verification by meta tag is easier, take
 * the token from Search Console's "HTML tag" method — paste only the `content`
 * value, not the whole tag — deploy, then press Verify.
 */
export const GOOGLE_SITE_VERIFICATION = "";

/**
 * Custom fonts for 'whimsical' and 'cursive' font styles.
 * Default system font is used for all other font styles.
 * See https://nextjs.org/docs/app/getting-started/fonts#google-fonts
 */
export const WHIMSICAL_FONT = Caveat({ subsets: ["latin"] });
export const CURSIVE_FONT = Dancing_Script({ subsets: ["latin"] });

export const MATERIAL_SYMBOLS = [
  "send",
  "check_circle",
  "star",
  "mail",
  "open_in_new",
  "open_in_full",
  "play_arrow",
  "pause",
  "lock",
  "target",
] as const;

// Mini Golf Green Theme
export const COLORS: ColorScheme = {
  LIGHT: {
    "text-primary": "#1a3a2e",
    "text-secondary": "rgba(26, 58, 46, 0.60)",
    "fill-0": "#FFFFFF",
    "fill-1": "#f0fdf4",
    "fill-2": "#dcfce7",
    "fill-3": "#bbf7d0",
    "accent-brand": "#16a34a",
    "accent-orange": "#FF8D28",
    "accent-green": "#5FE3AC",
    "accent-red": "#FF3B30",
    "accent-blue": "#007AFF",
    "accent-indigo": "#5856D6",
    "accent-mint": "#5FE3AC",
    "accent-purple": "#AF52DE",
    "accent-pink": "#FF2D55",
  },
  DARK: {
    "text-primary": "#F5FBF8",
    "text-secondary": "rgba(245, 251, 248, 0.65)",
    "fill-0": "#0b1a17",
    "fill-1": "#12251f",
    "fill-2": "#1a3128",
    "fill-3": "#234135",
    "accent-brand": "#5FE3AC",
    "accent-orange": "#FF9230",
    "accent-green": "#5FE3AC",
    "accent-red": "#FF453A",
    "accent-blue": "#0A84FF",
    "accent-indigo": "#5E5CE6",
    "accent-mint": "#5FE3AC",
    "accent-purple": "#BF5AF2",
    "accent-pink": "#FF375F",
  },
} as const;

export const MAX_RELEASE_NOTES_PER_PAGE = 5;

export const IS_WAITLIST_ENABLED = false;
