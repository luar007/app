import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MadeWithDyad } from '@/components/made-with-dyad';
import BottomNavBar from '@/components/BottomNavBar';
import { Car, DollarSign, Clock } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

interface RideOption {
  id: string;
  name: string;
  basePrice: number; // Base price in BRL
  pricePerKm: number; // Price per kilometer in BRL
  pricePerMinute: number; // Price per minute in BRL
  icon: React.ElementType;
}

const rideOptionsConfig: RideOption[] = [
  { id: 'economic', name: 'Econômico', basePrice: 5.00, pricePerKm: 1.50, pricePerMinute: 0.30, icon: Car },
  { id: 'premium', name: 'Premium', basePrice: 8.00, pricePerKm: 2.00, pricePerMinute: 0.40, icon: Car },
  { id: 'xl', name: 'VeloX XL', basePrice: 10.00, pricePerKm: 2.50, pricePerMinute: 0.50, icon: Car },
];

const SelectRide = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { origin, destination, distance, duration } = location.state || {}; // distance in meters, duration in seconds

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [calculatedRideOptions, setCalculatedRideOptions] = useState<any[]>([]);

  useEffect(() => {
    if (distance && duration) {
      calculateRidePrices(distance, duration);
    } else {
      showError('Não foi possível obter os detalhes da rota. Por favor, tente novamente.');
      navigate('/request-ride'); // Redirect back if no route data
    }
  }, [distance, duration, navigate]);

  const calculateRidePrices = (distMeters: number, durSeconds: number) => {
    const distKm = distMeters / 1000;
    const durMinutes = durSeconds / 60;

    const calculatedOptions = rideOptionsConfig.map(option => {
      const price = option.basePrice + (option.pricePerKm * distKm) + (option.pricePerMinute * durMinutes);
      const etaMinutes = Math.ceil(durMinutes + (Math.random() * 5)); // Add some variability for ETA
      return {
        ...option,
        price: price.toFixed(2),
        eta: `${etaMinutes} min`,
      };
    });
    setCalculatedRideOptions(calculatedOptions);
  };

  const handleConfirmRide = () => {
    if (!selectedOption) {
      showError('Por favor, selecione uma opção de viagem.');
      return;
    }
    setLoading(true);
    const chosenRide = calculatedRideOptions.find(option => option.id === selectedOption);
    showSuccess(`Viagem ${chosenRide?.name} confirmada!`);
    // Simular o tempo de confirmação e redirecionar para a tela de acompanhamento
    setTimeout(() => {
      setLoading(false);
      navigate('/tracking');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-veloxGreen-background p-4 text-veloxGreen-text pb-20">
      <h1 className="text-4xl font-bold mb-8 text-center">Selecione sua Viagem</h1>

      <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
        <div className="space-y-4">
          {calculatedRideOptions.length === 0 ? (
            <p className="text-center text-gray-400">Calculando opções de viagem...</p>
          ) : (
            calculatedRideOptions.map((option) => (
              <div
                key={option.id}
                className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-colors
                  ${selectedOption === option.id ? 'bg-veloxGreen-dark border-2 border-veloxGreen' : 'bg-gray-700 hover:bg-gray-600'}`}
                onClick={() => setSelectedOption(option.id)}
              >
                <div className="flex items-center">
                  <option.icon className="h-6 w-6 mr-3 text-veloxGreen" />
                  <div>
                    <h2 className="text-xl font-semibold">{option.name}</h2>
                    <p className="text-gray-400 flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-1" /> {option.eta}
                    </p>
                  </div>
                </div>
                <p className="text-xl font-bold flex items-center">
                  <DollarSign className="h-5 w-5 mr-1" /> {option.price}
                </p>
              </div>
            ))
          )}
        </div>

        <Button onClick={handleConfirmRide} className="btn-velox w-full mt-6" disabled={loading || !selectedOption}>
          {loading ? 'Confirmando...' : `Confirmar ${calculatedRideOptions.find(opt => opt.id === selectedOption)?.name || 'Viagem'}`}
        </Button>
      </div>

      <MadeWithDyad />
      <BottomNavBar />
    </div>
  );
};

export default SelectRide;