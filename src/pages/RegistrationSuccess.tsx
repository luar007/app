import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/contexts/SessionContext';

const RegistrationSuccess = () => {
  const navigate = useNavigate();
  const { user } = useSession();

  useEffect(() => {
    // Atualizar o registration_step para 'completed' no perfil do usuário
    const updateRegistrationStep = async () => {
      if (user) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ registration_step: 'completed' })
          .eq('id', user.id);

        if (updateError) {
          console.error('Erro ao finalizar passo de registro:', updateError.message);
        }
      }
    };
    updateRegistrationStep();
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-veloxGreen-background p-4 text-veloxGreen-text">
      <CheckCircle className="h-24 w-24 text-veloxGreen mb-8" />
      <h1 className="text-4xl font-bold mb-4 text-center">Cadastro Concluído!</h1>
      <p className="text-xl text-center mb-8">Bem-vindo(a) ao VeloX, seu cadastro foi finalizado com sucesso.</p>
      <Button onClick={() => navigate('/passenger-profile')} className="btn-velox">
        Ir para o Meu Perfil
      </Button>
      <MadeWithDyad />
    </div>
  );
};

export default RegistrationSuccess;