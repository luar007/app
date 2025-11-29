import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MadeWithDyad } from '@/components/made-with-dyad';
import BottomNavBar from '@/components/BottomNavBar';
import { Car, DollarSign, Clock } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

interface RideOption {
  id: string;
  name: string;
  price: string;
  eta: string; // Estimated Time of Arrival
  icon: React.ElementType;
}

const rideOptions: RideOption[] = [
  { id: 'economic', name: 'Econômico', price: 'R$ 15.00', eta: '5 min', icon: Car },
  { id: 'premium', name: 'Premium', price: 'R$ 25.00', eta: '7 min', icon: Car },
  { id: 'xl', name: 'VeloX XL', price: 'R$ 35.00', eta: '8 min', icon: Car },
];

const SelectRide = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleConfirmRide = () => {
    if (!selectedOption) {
      showError('Por favor, selecione uma opção de viagem.');
      return;
    }
    setLoading(true);
    const chosenRide = rideOptions.find(option => option.id === selectedOption);
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
          {rideOptions.map((option) => (
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
          ))}
        </div>

        <Button onClick={handleConfirmRide} className="btn-velox w-full mt-6" disabled={loading || !selectedOption}>
          {loading ? 'Confirmando...' : `Confirmar ${rideOptions.find(opt => opt.id === selectedOption)?.name || 'Viagem'}`}
        </Button>
      </div>

      <MadeWithDyad />
      <BottomNavBar />
    </div>
  );
};

export default SelectRide;