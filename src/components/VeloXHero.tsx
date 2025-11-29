import React from 'react';
import { Car, User } from 'lucide-react'; // Usando ícones Lucide para representar carro e usuário
import { Button } from '@/components/ui/button';

const VeloXHero = ({ onPassengerClick, onDriverClick }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 text-veloxGreen-text">
      {/* Ícone do robô/carro (usando um ícone de carro como representação) */}
      <div className="mb-8">
        <Car className="h-24 w-24 text-veloxGreen" />
      </div>

      <h1 className="text-5xl font-extrabold mb-8 text-center">VeloX</h1>

      <div className="flex space-x-4">
        <Button onClick={onPassengerClick} className="btn-velox">
          <User className="mr-2 h-5 w-5" /> Sou Passageiro
        </Button>
        <Button onClick={onDriverClick} className="btn-velox">
          <Car className="mr-2 h-5 w-5" /> Sou Motorista
        </Button>
      </div>
    </div>
  );
};

export default VeloXHero;