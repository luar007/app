import { useState, useEffect } from 'react';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_MAPS_API_KEY;
const GOOGLE_MAPS_API_URL = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,geometry&callback=initMap`;

declare global {
  interface Window {
    initMap: () => void;
    google: typeof google;
  }
}

export const useGoogleMaps = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<Error | null>(null);

  useEffect(() => {
    if (window.google) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = GOOGLE_MAPS_API_URL;
    script.async = true;
    script.defer = true;

    window.initMap = () => {
      setIsLoaded(true);
    };

    script.onerror = () => {
      setLoadError(new Error('Failed to load Google Maps script.'));
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
      delete window.initMap;
    };
  }, []);

  return { isLoaded, loadError };
};