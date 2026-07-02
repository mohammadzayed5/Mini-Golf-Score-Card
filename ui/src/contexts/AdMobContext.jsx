import { createContext, useContext, useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';

const AdMobContext = createContext({
  isInitialized: false,
  isNativePlatform: false,
});

export const useAdMob = () => useContext(AdMobContext);

export const AdMobProvider = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const isNativePlatform = Capacitor.isNativePlatform();

  useEffect(() => {
    // Only initialize AdMob once, at the app level, on native platforms
    if (!isNativePlatform) {
      console.log('AdMob: Not on native platform, skipping initialization');
      return;
    }

    let isMounted = true;

    const initializeAdMob = async () => {
      try {
        const { AdMob } = await import('@capacitor-community/admob');
        if (!isMounted) return;

        // Init without the tracking prompt so it doesn't block first paint.
        await AdMob.initialize({
          requestTrackingAuthorization: false,
          initializeForTesting: false,
        });
        if (!isMounted) return;
        setIsInitialized(true);

        // Ask for tracking authorization after the UI is up. Failure is non-fatal.
        try {
          await AdMob.requestTrackingAuthorization();
        } catch {}
      } catch (error) {
        console.error('AdMob: Initialization failed:', error);
      }
    };

    // Defer to the next idle callback so we never block first paint.
    const schedule = window.requestIdleCallback || ((cb) => setTimeout(cb, 0));
    schedule(initializeAdMob);

    return () => {
      isMounted = false;
    };
  }, [isNativePlatform]);

  return (
    <AdMobContext.Provider value={{ isInitialized, isNativePlatform }}>
      {children}
    </AdMobContext.Provider>
  );
};
