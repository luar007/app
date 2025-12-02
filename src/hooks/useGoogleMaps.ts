import { useState, useEffect } from 'react';

// Hardcoding a chave da API para teste, conforme solicitado.
// Lembre-se de reverter para import.meta.env.VITE_MAPS_API_KEY após o teste.
const GOOGLE_MAPS_API_KEY = 'AIzaSyDsO2bQrWULscRlDL10Op6Jkm3SMfvgVCk'; 
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
    // Check if the script is already loaded or if google object exists
    if (window.google && window.google.maps) {
      setIsLoaded(true);
      return;
    }

    // Check if a script with the Google Maps API URL already exists
    const existingScript = document.querySelector(`script[src^="https://maps.googleapis.com/maps/api/js"]`);
    if (existingScript) {
      // If it exists, assume it's loading or loaded, and wait for initMap callback
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
      setLoadError(new Error('Failed to load Google Maps script. Please check your API key and network connection.'));
    };

    document.head.appendChild(script);

    return () => {
      // Clean up the script and callback if component unmounts before loading
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
      delete window.initMap;
    };
  }, []);

  return { isLoaded, loadError };
};