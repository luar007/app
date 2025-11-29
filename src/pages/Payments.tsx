import React from 'react';
import { MadeWithDyad } from '@/components/made-with-dyad';
import BottomNavBar from '@/components/BottomNavBar';
import { CreditCard, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Payments = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center bg-veloxGreen-background p-4 text-veloxGreen-text">
      <h1 className="text-4xl font-bold mb-8">Meus Pagamentos</h1>
      <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
        <p className="text-center text-gray-400 mb-4">Nenhum método de pagamento adicionado.</p>
        <Button onClick={() => navigate('/add-payment')} className="btn-velox w-full">
          <PlusCircle className="h-5 w-5 mr-2" /> Adicionar Cartão
        </Button>
        {/* Aqui você pode listar os métodos de pagamento existentes */}
      </div>
      <MadeWithDyad />
      <BottomNavBar />
    </div>
  );
};

export default Payments;