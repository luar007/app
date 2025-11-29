import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { showSuccess, showError } from '@/utils/toast';
import BottomNavBar from '@/components/BottomNavBar';
import { useNavigate } from 'react-router-dom';

const RequestRide = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleConfirmDestination = (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin.trim() || !destination.trim()) {
      showError('Por favor, preencha a origem e o destino.');
      return;
    }
    setLoading(true);
    // Simular o tempo de confirmação e redirecionar para a tela de seleção de viagem
    setTimeout(() => {
      setLoading(false);
      navigate('/select-ride');
    }, 1000);
  };

  // URL do Google Maps Embed API. Você pode personalizar o centro e o zoom.
  // Para um mapa mais dinâmico, seria necessário o Google Maps JavaScript API com uma chave.
  const mapEmbedUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=Brazil`;

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between bg-veloxGreen-background text-veloxGreen-text pb-20"> {/* Adicionado padding-bottom para a nav bar */}
      {/* Mapa de fundo */}
      <div className="absolute inset-0 z-0">
        <iframe
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={mapEmbedUrl}
          title="Mapa Interativo"
        ></iframe>
      </div>

      {/* Conteúdo da página sobreposto ao mapa */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-md p-4">
        <h1 className="text-4xl font-bold mb-8 text-center text-white">Solicitar Corrida</h1>

        <div className="w-full bg-gray-800 p-6 rounded-lg shadow-lg mb-4">
          <form onSubmit={handleConfirmDestination} className="space-y-4">
            <Input
              type="text"
              placeholder="Ponto de partida"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              required
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-md focus:ring-veloxGreen focus:border-veloxGreen"
            />
            <Input
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