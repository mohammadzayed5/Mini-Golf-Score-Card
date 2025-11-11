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
        // Delay initialization by 5 seconds to let app fully load
        await new Promise(resolve => setTimeout(resolve, 5000));

        if (!isMounted) return;

        const { AdMob } = await import('@capacitor-community/admob');

        console.log('AdMob: Initializing...');
        await AdMob.initialize({
          requestTrackingAuthorization: true,
          initializeForTesting: false,
        });

        if (isMounted) {
          console.log('AdMob: Initialized successfully');
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('AdMob: Initialization failed:', error);
        // Don't crash the app if AdMob fails
      }
    };

    initializeAdMob();

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
