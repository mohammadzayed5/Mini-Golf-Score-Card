import { useEffect } from 'react';
import { useAdMob } from '../contexts/AdMobContext';

const AdBanner = ({ adUnitId, position = 'BOTTOM_CENTER' }) => {
  const { isInitialized, isNativePlatform } = useAdMob();

  useEffect(() => {
    // Only show banner if AdMob is initialized and we're on a native platform
    if (!isInitialized || !isNativePlatform) {
      console.log('AdBanner: Waiting for AdMob initialization or not on native platform');
      return;
    }

    const showBanner = async () => {
      try {
        const { AdMob, BannerAdSize, BannerAdPosition } = await import('@capacitor-community/admob');

        console.log('AdBanner: Showing banner ad with ID:', adUnitId);
        await AdMob.showBanner({
          adId: adUnitId,
          adSize: BannerAdSize.BANNER,
          position: BannerAdPosition[position],
          margin: 130,
        });
        console.log('AdBanner: Banner ad shown successfully');
      } catch (error) {
        console.error('AdBanner: Failed to show banner ad:', error);
      }
    };

    showBanner();

    // Cleanup: hide banner when component unmounts
    return () => {
      if (isNativePlatform) {
        (async () => {
          try {
            const { AdMob } = await import('@capacitor-community/admob');
            await AdMob.hideBanner();
            console.log('AdBanner: Banner ad hidden');
          } catch (error) {
            console.error('AdBanner: Failed to hide banner:', error);
          }
        })();
      }
    };
  }, [isInitialized, isNativePlatform, adUnitId, position]);

  // Return null since the ad is rendered natively
  return null;
};

export default AdBanner;
