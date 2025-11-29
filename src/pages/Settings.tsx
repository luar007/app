import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MadeWithDyad } from '@/components/made-with-dyad';
import BottomNavBar from '@/components/BottomNavBar';
import { User, CreditCard, MapPin, Bell, Lock, HelpCircle, LogOut } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { supabase } from '@/integrations/supabase/client';

const Settings = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Erro ao sair:', error.message);
      showError('Erro ao sair da conta.');
    } else {
      showSuccess('Você saiu da sua conta.');
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-veloxGreen-background p-4 text-veloxGreen-text pb-20">
      <h1 className="text-4xl font-bold mb-8">Configurações</h1>

      <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
        <div className="space-y-3">
          <Button variant="ghost" onClick={() => navigate('/edit-profile')} className="w-full justify-start text-veloxGreen-text hover:bg-gray-700">
            <User className="h-5 w-5 mr-3" /> Informações Pessoais
          </Button>
          <Button variant="ghost" onClick={() => navigate('/payments')} className="w-full justify-start text-veloxGreen-text hover:bg-gray-700">
            <CreditCard className="h-5 w-5 mr-3" /> Pagamento
          </Button>
          <Button variant="ghost" onClick={() => navigate('/saved-addresses')} className="w-full justify-start text-veloxGreen-text hover:bg-gray-700">
            <MapPin className="h-5 w-5 mr-3" /> Endereços Salvos
          </Button>
          <Button variant="ghost" className="w-full justify-start text-veloxGreen-text hover:bg-gray-700">
            <Bell className="h-5 w-5 mr-3" /> Notificações
          </Button>
          <Button variant="ghost" className="w-full justify-start text-veloxGreen-text hover:bg-gray-700">
            <Lock className="h-5 w-5 mr-3" /> Privacidade e Segurança
          </Button>
          <Button variant="ghost" className="w-full justify-start text-veloxGreen-text hover:bg-gray-700">
            <HelpCircle className="h-5 w-5 mr-3" /> Central de Ajuda
          </Button>
          <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-red-500 hover:bg-gray-700">
            <LogOut className="h-5 w-5 mr-3" /> Sair da Conta
          </Button>
        </div>
      </div>
      <MadeWithDyad />
      <BottomNavBar />
    </div>
  );
};

export default Settings;