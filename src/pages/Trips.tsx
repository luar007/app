import React from 'react';
import { MadeWithDyad } from '@/components/made-with-dyad';
import BottomNavBar from '@/components/BottomNavBar';

const Trips = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-veloxGreen-background p-4 text-veloxGreen-text">
      <h1 className="text-4xl font-bold mb-8">Histórico de Viagens</h1>
      <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
        <p className="text-center text-gray-400">Nenhuma viagem registrada ainda.</p>
        {/* Aqui você pode adicionar a lógica para listar as viagens */}
      </div>
      <MadeWithDyad />
      <BottomNavBar />
    </div>
  );
};

export default Trips;