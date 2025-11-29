import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { showSuccess, showError } from '@/utils/toast';

const RequestRide = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestRide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin.trim() || !destination.trim()) {
      showError('Por favor, preencha a origem e o destino.');
      return;
    }
    setLoading(true);
    // Simular a solicitação de corrida
    setTimeout(() => {
      showSuccess(`Corrida solicitada de ${origin} para ${destination}!`);
      setLoading(false);
      setOrigin('');
      setDestination('');
    }, 2000);
  };

  // URL do Google Maps Embed API. Você pode personalizar o centro e o zoom.
  // Para um mapa mais dinâmico, seria necessário o Google Maps JavaScript API com uma chave.
  const mapEmbedUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=Brazil`;

  return (
    <div className="min-h-screen flex flex-col items-center bg-veloxGreen-background p-4 text-veloxGreen-text">
      <h1 className="text-4xl font-bold mb-8 text-center">Solicitar Corrida</h1>

      <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
        <div className="relative h-64 w-full mb-4 rounded-md overflow-hidden">
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

        <form onSubmit={handleRequestRide} className="space-y-4">
          <Input
            type="text"
            placeholder="Origem"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            required
            className="bg-gray-700 border-gray-600 text-veloxGreen-text placeholder-gray-400 rounded-md focus:ring-veloxGreen focus:border-veloxGreen"
          />
          <Input
            type="text"
            placeholder="Destino"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
            className="bg-gray-700 border-gray-600 text-veloxGreen-text placeholder-gray-400 rounded-md focus:ring-veloxGreen focus:border-veloxGreen"
          />
          <Button type="submit" className="btn-velox w-full" disabled={loading}>
            {loading ? 'Solicitando...' : 'Solicitar VeloX'}
          </Button>
        </form>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default RequestRide;