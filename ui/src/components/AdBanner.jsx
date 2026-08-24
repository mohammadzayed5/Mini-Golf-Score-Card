import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAdMob } from '../contexts/AdMobContext';

/**
 * ONE banner for the whole tab shell, driven by the current route.
 *
 * This used to be mounted separately on Home, Players and Courses. AdMob's
 * showBanner/hideBanner are global — there is only ever one banner — so three
 * independent mounts fought over it: navigating Home -> Players unmounted the
 * Home banner and mounted the Players one, and the outgoing async hideBanner()
 * could resolve *after* the incoming showBanner(), leaving no banner at all.
 *
 * Mounting once in TabLayout and swapping the ad unit on navigation removes the
 * race entirely: show is only ever called on a route change, and hide is only
 * called when leaving an ad-bearing route or tearing down the shell.
 */

// Routes that carry a banner, and which unit to serve there.
const AD_UNIT_BY_PATH = {
  '/': 'ca-app-pub-5108646735858325/3148534405',
  '/players': 'ca-app-pub-5108646735858325/7215223181',
  '/courses': 'ca-app-pub-5108646735858325/2774674474',
  '/history': 'ca-app-pub-5108646735858325/8100929442',
};

/**
 * The banner is positioned from the bottom edge, so it needs to clear the tab
 * bar. This was hardcoded to 130, which overshoots a ~83pt bar plus home
 * indicator and could push the ad off-screen on smaller devices. Measure the
 * real bar instead and fall back to a sane value if it isn't mounted yet.
 */
function tabBarOffset() {
  const bar = document.querySelector('.navigationbar');
  return bar?.offsetHeight ? Math.round(bar.offsetHeight) : 60;
}

export default function AdBanner() {
  const { isInitialized, isNativePlatform } = useAdMob();
  const { pathname } = useLocation();
  const shownRef = useRef(false);

  const adUnitId = AD_UNIT_BY_PATH[pathname];

  useEffect(() => {
    if (!isInitialized || !isNativePlatform) return;

    let cancelled = false;

    const sync = async () => {
      const { AdMob, BannerAdSize, BannerAdPosition } = await import(
        '@capacitor-community/admob'
      );
      if (cancelled) return;

      if (!adUnitId) {
        // Not an ad-bearing route. Only hide if something is actually up.
        if (shownRef.current) {
          try {
            await AdMob.hideBanner();
            shownRef.current = false;
          } catch (error) {
            console.error('AdBanner: hideBanner failed:', error);
          }
        }
        return;
      }

      try {
        await AdMob.showBanner({
          adId: adUnitId,
          adSize: BannerAdSize.BANNER,
          position: BannerAdPosition.BOTTOM_CENTER,
          margin: tabBarOffset(),
        });
        if (!cancelled) shownRef.current = true;
      } catch (error) {
        console.error('AdBanner: showBanner failed for', adUnitId, error);
      }
    };

    sync();

    return () => {
      cancelled = true;
    };
  }, [isInitialized, isNativePlatform, adUnitId]);

  // Surface load failures. Without this the only symptom is a missing banner.
  useEffect(() => {
    if (!isInitialized || !isNativePlatform) return;

    let listener;
    (async () => {
      try {
        const { AdMob, BannerAdPluginEvents } = await import(
          '@capacitor-community/admob'
        );
        listener = await AdMob.addListener(
          BannerAdPluginEvents.FailedToLoad,
          (info) => console.error('AdBanner: ad failed to load:', info)
        );
      } catch (error) {
        console.error('AdBanner: could not attach FailedToLoad listener:', error);
      }
    })();

    return () => {
      listener?.remove?.();
    };
  }, [isInitialized, isNativePlatform]);

  // Teardown of the whole shell: make sure no banner is left behind.
  useEffect(() => {
    if (!isNativePlatform) return;
    return () => {
      (async () => {
        try {
          const { AdMob } = await import('@capacitor-community/admob');
          await AdMob.hideBanner();
        } catch {
          // Nothing useful to do if the shell is already gone.
        }
      })();
    };
  }, [isNativePlatform]);

  // Rendered natively, nothing in the DOM.
  return null;
}
