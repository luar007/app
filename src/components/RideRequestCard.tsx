import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Send, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RideRequestCardProps {
  firstName: string;
  origin: string;
  setOrigin: (value: string) => void;
  destination: string;
  setDestination: (value: string) => void;
  loading: boolean;
  handleConfirmDestination: (e: React.FormEvent) => void;
  originInputRef: React.RefObject<HTMLInputElement>;
  destinationInputRef: React.RefObject<HTMLInputElement>;
}

const RideRequestCard: React.FC<RideRequestCardProps> = ({
  firstName,
  origin,
  setOrigin,
  destination,
  setDestination,
  loading,
  handleConfirmDestination,
  originInputRef,
  destinationInputRef,
}) => {
  return (
    <div className="relative z-10 w-full max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-2 text-gray-800">Olá, {firstName}! 👋</h2>
      <p className="text-gray-600 mb-6">Para onde você quer ir?</p>

      <form onSubmit={handleConfirmDestination} className="space-y-4">
        <div className="flex items-center bg-gray-100 rounded-lg p-3 border border-gray-200">
          <Send className="h-5 w-5 text-veloxPurpleDark mr-3" />
          <Input
            id="origin-input"
            ref={originInputRef}
            type="text"
            placeholder="De onde você vai? Sua localização"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            required
            className="flex-grow bg-transparent border-none text-gray-800 placeholder-gray-500 focus:ring-0 focus:border-0 p-0"
          />
        </div>
        <div className="flex items-center bg-gray-100 rounded-lg p-3 border border-gray-200">
          <MapPin className="h-5 w-5 text-veloxPurpleDark mr-3" />
          <Input
            id="destination-input"
            ref={destinationInputRef}
            type="text"
            placeholder="Para onde você vai? Para onde?"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
            className="flex-grow bg-transparent border-none text-gray-800 placeholder-gray-500 focus:ring-0 focus:border-0 p-0"
          />
        </div>
        <Button
          type="submit"
          className={cn(
            "w-full py-3 rounded-lg text-lg font-semibold",
            "bg-gradient-to-r from-veloxPurpleLight to-veloxPurpleDark text-white",
            "hover:from-veloxPurpleDark hover:to-veloxPurpleLight transition-all duration-200",
            loading && "opacity-70 cursor-not-allowed"
          )}
          disabled={loading}
        >
          <Search className="h-5 w-5 mr-2" /> {loading ? 'Buscando...' : 'Buscar Corrida'}
        </Button>
      </form>
    </div>
  );
};

export default RideRequestCard;