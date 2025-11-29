import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { showSuccess, showError } from '@/utils/toast';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { useSession } from '@/contexts/SessionContext';

const AddPayment = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useSession();

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Aqui você integraria com um provedor de pagamento real.
    // Por enquanto, vamos apenas simular o sucesso e atualizar o perfil.
    try {
      // Simulação de chamada a API de pagamento
      await new Promise(resolve => setTimeout(resolve, 1500));

      showSuccess('Informações de pagamento adicionadas com sucesso!');
      // Atualizar o registration_step no perfil do usuário
      if (user) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ registration_step: 'completed' }) // Marca como completo após o pagamento
          .eq('id', user.id);

        if (updateError) {
          console.error('Erro ao atualizar passo de registro:', updateError.message);
          showError('Erro ao atualizar passo de registro.');
        }
      }
      navigate('/request-ride'); // Redirecionar para a tela de solicitar corrida
    } catch (error: any) {
      console.error('Erro ao adicionar pagamento:', error.message);
      showError(`Erro ao adicionar pagamento: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-veloxGreen-background p-4">
      <h1 className="text-4xl font-bold mb-8 text-veloxGreen-text">Adicionar Pagamento</h1>
      <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg">
        <form onSubmit={handleAddPayment} className="space-y-4">
          <Input
            type="text"
            placeholder="Número do Cartão"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            required
            className="bg-gray-700 border-gray-600 text-veloxGreen-text placeholder-gray-400 rounded-md focus:ring-veloxGreen focus:border-veloxGreen"
          />
          <Input
            type="text"
            placeholder="Nome no Cartão"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            required
            className="bg-gray-700 border-gray-600 text-veloxGreen-text placeholder-gray-400 rounded-md focus:ring-veloxGreen focus:border-veloxGreen"
          />
          <div className="flex space-x-4">
            <Input
              type="text"
              placeholder="MM/AA"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              required
              className="flex-1 bg-gray-700 border-gray-600 text-veloxGreen-text placeholder-gray-400 rounded-md focus:ring-veloxGreen focus:border-veloxGreen"
            />
            <Input
              type="text"
              placeholder="CVV"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              required
              className="w-24 bg-gray-700 border-gray-600 text-veloxGreen-text placeholder-gray-400 rounded-md focus:ring-veloxGreen focus:border-veloxGreen"
            />
          </div>
          <Button type="submit" className="btn-velox w-full" disabled={loading}>
            {loading ? 'Adicionando...' : 'Adicionar Pagamento'}
          </Button>
        </form>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default AddPayment;