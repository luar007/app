import React from 'react';
import { MadeWithDyad } from '@/components/made-with-dyad';
import BottomNavBar from '@/components/BottomNavBar';
import { Car, User, Phone, Star } from 'lucide-react';

const Tracking = () => {
  // Dados simulados do motorista e da viagem
  const driver = {
    name: 'João Silva',
    carModel: 'Toyota Corolla',
    licensePlate: 'ABC-1234',
    rating: 4.8,
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg', // Imagem de avatar aleatória
  };

  // URL do Google Maps Embed API para simular o acompanhamento
  const mapEmbedUrl = `https://www.google.com/maps/embed/v1/directions?key=YOUR_GOOGLE_MAPS_API_KEY&origin=Sua+Localização&destination=Destino+da+Viagem&mode=driving`;

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between bg-veloxGreen-background text-veloxGreen-text pb-20">
      {/* Mapa de fundo para acompanhamento */}
      <div className="absolute inset-0 z-0">
        <iframe
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={mapEmbedUrl}
          title="Acompanhamento da Viagem"
        ></iframe>
      </div>

      {/* Detalhes do motorista e da viagem */}
      <div className="relative z-10 w-full max-w-md p-4 bg-gray-800 rounded-t-lg shadow-lg mt-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">Seu VeloX está a caminho!</h1>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <img src={driver.avatar} alt={driver.name} className="h-16 w-16 rounded-full mr-4 border-2 border-veloxGreen" />
            <div>
              <h2 className="text-xl font-semibold">{driver.name}</h2>
              <p className="text-gray-400 flex items-center text-sm">
                <Star className="h-4 w-4 mr-1 text-yellow-400" fill="currentColor" /> {driver.rating}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-medium">{driver.carModel}</p>
            <p className="text-gray-400 text-sm">{driver.licensePlate}</p>
          </div>
        </div>

        <div className="flex justify-around mt-4">
          <Button className="btn-velox flex-1 mx-1">
            <Phone className="h-5 w-5 mr-2" /> Ligar
          </Button>
          <Button className="btn-velox flex-1 mx-1">
            <Car className="h-5 w-5 mr-2" /> Cancelar
          </Button>
        </div>
      </div>

      <MadeWithDyad />
      <BottomNavBar />
    </div>
  );
};

export default Tracking;