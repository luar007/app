import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { showSuccess, showError } from '@/utils/toast';
import BottomNavBar from '@/components/BottomNavBar';
import { useNavigate } from 'react-router-dom';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';
import { MapPin } from 'lucide-react';

const RequestRide = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('');
  const navigate = useNavigate();
  const { isLoaded, loadError } = useGoogleMaps();
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMap = useRef<google.maps.Map | null>(null);
  const currentMarker = useRef<google.maps.Marker | null>(null);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const geocoderService = useRef<google.maps.Geocoder | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const directionsService = useRef<google.maps.DirectionsService | null>(null);
  const directionsRenderer = useRef<google.maps.DirectionsRenderer | null>(null);

  const originInputRef = useRef<HTMLInputElement>(null);
  const destinationInputRef = useRef<HTMLInputElement>(null);

  const defaultCenter = { lat: -23.55052, lng: -46.633308 }; // Centro de São Paulo

  useEffect(() => {
    if (isLoaded && mapRef.current) {
      initializeMap();
      initializeAutocompletes();
    }
  }, [isLoaded]);

  const initializeMap = () => {
    if (!window.google || !window.google.maps) {
      showError('Google Maps API não carregada.');
      return;
    }

    googleMap.current = new window.google.maps.Map(mapRef.current as HTMLElement, {
      center: defaultCenter,
      zoom: 12,
      disableDefaultUI: true,
    });

    autocompleteService.current = new window.google.maps.places.AutocompleteService();
    geocoderService.current = new window.google.maps.Geocoder();
    placesService.current = new window.google.maps.places.PlacesService(googleMap.current);
    directionsService.current = new window.google.maps.DirectionsService();
    directionsRenderer.current = new window.google.maps.DirectionsRenderer({ map: googleMap.current });

    getCurrentLocation();
  };

  const initializeAutocompletes = () => {
    if (!window.google || !window.google.maps.places) {
      showError('Google Places API não carregada.');
      return;
    }

    if (originInputRef.current) {
      const originAutocomplete = new window.google.maps.places.Autocomplete(originInputRef.current, {
        types: ['address'],
        componentRestrictions: { country: 'br' }, // Restrict to Brazil
      });
      originAutocomplete.addListener('place_changed', () => {
        const place = originAutocomplete.getPlace();
        if (place.formatted_address) {
          setOrigin(place.formatted_address);
        }
      });
    }

    if (destinationInputRef.current) {
      const destinationAutocomplete = new window.google.maps.places.Autocomplete(destinationInputRef.current, {
        types: ['address'],
        componentRestrictions: { country: 'br' }, // Restrict to Brazil
      });
      destinationAutocomplete.addListener('place_changed', () => {
        const place = destinationAutocomplete.getPlace();
        if (place.formatted_address) {
          setDestination(place.formatted_address);
        }
      });
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          googleMap.current?.setCenter(pos);
          addCurrentLocationMarker(pos);
          reverseGeocode(pos);
        },
        (error) => {
          console.error('Erro ao obter localização atual:', error);
          showError('Não foi possível obter sua localização atual. Por favor, insira manualmente.');
          // Fallback to default center if geolocation fails
          googleMap.current?.setCenter(defaultCenter);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 } // Options for geolocation
      );
    } else {
      showError('Seu navegador não suporta geolocalização.');
      // Fallback to default center if geolocation not supported
      googleMap.current?.setCenter(defaultCenter);
    }
  };

  const addCurrentLocationMarker = (position: google.maps.LatLngLiteral) => {
    if (currentMarker.current) {
      currentMarker.current.setMap(null);
    }
    currentMarker.current = new window.google.maps.Marker({
      position: position,
      map: googleMap.current,
      title: 'Sua Localização Atual',
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 7,
        fillColor: '#4CAF50', // Velox Green
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: '#FFFFFF',
      },
    });
  };

  const reverseGeocode = (position: google.maps.LatLngLiteral) => {
    geocoderService.current?.geocode({ location: position }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        setCurrentLocation(results[0].formatted_address);
        setOrigin(results[0].formatted_address);
      } else {
        console.error('Geocoder falhou devido a: ' + status);
        showError('Não foi possível determinar o endereço da sua localização.');
      }
    });
  };

  const handleConfirmDestination = (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin.trim() || !destination.trim()) {
      showError('Por favor, preencha a origem e o destino.');
      return;
    }
    setLoading(true);

    const request: google.maps.DirectionsRequest = {
      origin: origin,
      destination: destination,
      travelMode: google.maps.TravelMode.DRIVING,
    };

    directionsService.current?.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK && result) {
        directionsRenderer.current?.setDirections(result);
        const route = result.routes[0].legs[0];
        if (route.distance && route.duration) {
          navigate('/select-ride', {
            state: {
              origin,
              destination,
              distance: route.distance.value, // in meters
              duration: route.duration.value, // in seconds
            },
          });
        } else {
          showError('Não foi possível calcular a distância e duração da rota.');
        }
      } else {
        console.error('Solicitação de rotas falhou devido a ' + status);
        showError('Não foi possível encontrar uma rota para o destino selecionado.');
      }
      setLoading(false);
    });
  };

  if (loadError) {
    return <div className="min-h-screen flex items-center justify-center bg-veloxGreen-background text-veloxGreen-text">Erro ao carregar o mapa: {loadError.message}</div>;
  }

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center bg-veloxGreen-background text-veloxGreen-text">Carregando mapa...</div>;
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between bg-veloxGreen-background text-veloxGreen-text pb-20">
      {/* Mapa de fundo */}
      <div ref={mapRef} className="absolute inset-0 z-0" style={{ height: '100%', width: '100%' }}></div>

      {/* Conteúdo da página sobreposto ao mapa */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-md p-4">
        <h1 className="text-4xl font-bold mb-8 text-center text-white">Solicitar Corrida</h1>

        <div className="w-full bg-gray-800 p-6 rounded-lg shadow-lg mb-4">
          <div className="mb-4">
            <label htmlFor="current-location" className="block text-sm font-medium text-gray-300 mb-1">Localização Atual</label>
            <Input
              id="current-location"
              type="text"
              value={currentLocation}
              readOnly
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-md focus:ring-veloxGreen focus:border-veloxGreen cursor-not-allowed"
            />
          </div>
          <form onSubmit={handleConfirmDestination} className="space-y-4">
            <Input
              id="origin-input"
              ref={originInputRef}
              type="text"
              placeholder="Ponto de partida"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              required
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-md focus:ring-veloxGreen focus:border-veloxGreen"
            />
            <Input
              id="destination-input"
              ref={destinationInputRef}
              type="text"
              placeholder="Para onde vamos?"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-md focus:ring-veloxGreen focus:border-veloxGreen"
            />
            <Button type="submit" className="btn-velox w-full" disabled={loading}>
              {loading ? 'Confirmando...' : 'Confirmar Destino'}
            </Button>
          </form>
        </div>
      </div>
      <div className="relative z-10 w-full">
        <MadeWithDyad />
      </div>
      <BottomNavBar />
    </div>
  );
};

export default RequestRide;