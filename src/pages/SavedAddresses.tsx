import React, { useState } from 'react';
import { MadeWithDyad } from '@/components/made-with-dyad';
import BottomNavBar from '@/components/BottomNavBar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Home, Briefcase, PlusCircle } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

interface Address {
  id: string;
  label: string;
  address: string;
}

const SavedAddresses = () => {
  const [newAddress, setNewAddress] = useState('');
  const [homeAddress, setHomeAddress] = useState<Address | null>({ id: 'home', label: 'Casa', address: 'Rua Exemplo, 123' });
  const [workAddress, setWorkAddress] = useState<Address | null>({ id: 'work', label: 'Trabalho', address: 'Av. Principal, 456' });
  const [otherAddresses, setOtherAddresses] = useState<Address[]>([]);

  const handleAddAddress = () => {
    if (!newAddress.trim()) {
      showError('Por favor, digite um endereço.');
      return;
    }
    // Simular adição de endereço
    const newId = `other-${otherAddresses.length + 1}`;
    setOtherAddresses([...otherAddresses, { id: newId, label: 'Outro', address: newAddress }]);
    setNewAddress('');
    showSuccess('Endereço adicionado com sucesso!');
  };

  const handleDeleteAddress = (id: string, type: 'home' | 'work' | 'other') => {
    if (type === 'home') setHomeAddress(null);
    if (type === 'work') setWorkAddress(null);
    if (type === 'other') setOtherAddresses(otherAddresses.filter(addr => addr.id !== id));
    showSuccess('Endereço removido.');
  };

  const AddressItem = ({ address, icon: Icon, type }: { address: Address; icon: React.ElementType; type: 'home' | 'work' | 'other' }) => (
    <div className="flex items-center justify-between bg-gray-700 p-3 rounded-md shadow-sm">
      <div className="flex items-center space-x-3">
        <Icon className="h-5 w-5 text-veloxGreen" />
        <div>
          <p className="font-semibold">{address.label}</p>
          <p className="text-gray-400 text-sm">{address.address}</p>
        </div>
      </div>
      <Button variant="ghost" size="sm" onClick={() => handleDeleteAddress(address.id, type)} className="text-red-500 hover:text-red-400">
        Remover
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center bg-veloxGreen-background p-4 text-veloxGreen-text pb-20">
      <h1 className="text-4xl font-bold mb-8">Endereços Salvos</h1>

      <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
        <div className="flex space-x-2 mb-6">
          <Input
            type="text"
            placeholder="Adicionar novo endereço..."
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
            className="flex-grow bg-gray-700 border-gray-600 text-veloxGreen-text placeholder-gray-400 rounded-md focus:ring-veloxGreen focus:border-veloxGreen"
          />
          <Button onClick={handleAddAddress} className="btn-velox">
            <PlusCircle className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-2">Meus Endereços</h2>
          {homeAddress && <AddressItem address={homeAddress} icon={Home} type="home" />}
          {workAddress && <AddressItem address={workAddress} icon={Briefcase} type="work" />}

          {otherAddresses.length > 0 && (
            <>
              <h2 className="text-xl font-semibold mt-6 mb-2">Outros Lugares</h2>
              {otherAddresses.map(addr => (
                <AddressItem key={addr.id} address={addr} icon={MapPin} type="other" />
              ))}
            </>
          )}

          {!homeAddress && !workAddress && otherAddresses.length === 0 && (
            <p className="text-center text-gray-400">Nenhum endereço salvo ainda.</p>
          )}
        </div>
      </div>

      <MadeWithDyad />
      <BottomNavBar />
    </div>
  );
};

export default SavedAddresses;