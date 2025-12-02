import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { showSuccess, showError } from '@/utils/toast';
import BottomNavBar from '@/components/BottomNavBar';
import { useNavigate } from 'react-router-dom';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';
import { MapPin, Send, Search } from 'lucide-react';
import Header from '@/components/Header';
import RideRequestCard from '@/components/RideRequestCard'; // Importar o novo componente
import { useSession } from '@/contexts/SessionContext';
import { supabase } from '@/integrations/supabase/client';

declare var google: any;

const RequestRide = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('');
  const [firstName, setFirstName] = useState('Usuário');
  const navigate = useNavigate();
  const { isLoaded, loadError } = useGoogleMaps();
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMap = useRef<any | null>(null);
  const currentMarker = useRef<any | null>(null);
  const autocompleteService = useRef<any | null>(null);
  const geocoderService = useRef<any | null>(null);
  const placesService = useRef<any | null>(null);
  const directionsService = useRef<any | null>(null);
  const directionsRenderer = useRef<any | null>(null);

  const originInputRef = useRef<HTMLInputElement>(null);
  const destinationInputRef = useRef<HTMLInputElement>(null);

  const defaultCenter = { lat: -23.55052, lng: -46.633308 };

  const { user, loading: sessionLoading } = useSession();

  useEffect(() => {
    if (!sessionLoading && user) {
      fetchUserProfile();
    }
  }, [user, sessionLoading]);

  const fetchUserProfile = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('profiles')
      .select('first_name')
      .eq('id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Erro ao buscar perfil:', error.message);
    } else if (data) {
      setFirstName(data.first_name || 'Usuário');
    }
  };

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

    googleMap.current = new google.maps.Map(mapRef.current as HTMLElement, {
      center: defaultCenter,
      zoom: 12,
      disableDefaultUI: true,
    });

    autocompleteService.current = new google.maps.places.AutocompleteService();
    geocoderService.current = new google.maps.Geocoder();
    placesService.current = new google.maps.places.PlacesService(googleMap.current);
    directionsService.current = new google.maps.DirectionsService();
    directionsRenderer.current = new google.maps.DirectionsRenderer({ map: googleMap.current });

    getCurrentLocation();
  };

  const initializeAutocompletes = () => {
    if (!window.google || !window.google.maps.places) {
      showError('Google Places API não carregada.');
      return;
    }

    if (originInputRef.current) {
      const originAutocomplete = new google.maps.places.Autocomplete(originInputRef.current, {
        types: ['address'],
        componentRestrictions: { country: 'br' },
      });
      originAutocomplete.addListener('place_changed', () => {
        const place = originAutocomplete.getPlace();
        if (place.formatted_address) {
          setOrigin(place.formatted_address);
        }
      });
    }

    if (destinationInputRef.current) {
      const destinationAutocomplete = new google.maps.places.Autocomplete(destinationInputRef.current, {
        types: ['address'],
        componentRestrictions: { country: 'br' },
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
          googleMap.current?.setCenter(defaultCenter);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      showError('Seu navegador não suporta geolocalização.');
      googleMap.current?.setCenter(defaultCenter);
    }
  };

  const addCurrentLocationMarker = (position: any) => {
    if (currentMarker.current) {
      currentMarker.current.setMap(null);
    }
    currentMarker.current = new google.maps.Marker({
      position: position,
      map: googleMap.current,
      title: 'Sua Localização Atual',
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 7,
        fillColor: '#4CAF50',
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: '#FFFFFF',
      },
    });
  };

  const reverseGeocode = (position: any) => {
    geocoderService.current?.geocode({ location: position }, (results: any, status: any) => {
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

    const request: any = {
      origin: origin,
      destination: destination,
      travelMode: google.maps.TravelMode.DRIVING,
    };

    directionsService.current?.route(request, (result: any, status: any) => {
      if (status === google.maps.DirectionsStatus.OK && result) {
        directionsRenderer.current?.setDirections(result);
        const route = result.routes[0].legs[0];
        if (route.distance && route.duration) {
          navigate('/select-ride', {
            state: {
              origin,
              destination,
              distance: route.distance.value,
              duration: route.duration.value,
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
    <div className="relative min-h-screen flex flex-col items-center bg-veloxGreen-background text-veloxGreen-text">
      <Header />

      {/* Mapa de fundo */}
      <div ref={mapRef} className="absolute inset-0 z-0" style={{ height: '100%', width: '100%' }}></div>

      {/* Card flutuante de solicitação de corrida */}
      <RideRequestCard
        firstName={firstName}
        origin={origin}
        setOrigin={setOrigin}
        destination={destination}
        setDestination={setDestination}
        loading={loading}
        handleConfirmDestination={handleConfirmDestination}
        originInputRef={originInputRef}
        destinationInputRef={destinationInputRef}
      />

      <div className="relative z-10 w-full mt-auto"> {/* MadeWithDyad e BottomNavBar no final */}
        <MadeWithDyad />
      </div>
      <BottomNavBar />
    </div>
  );
};

export default RequestRide;