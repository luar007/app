import { MadeWithDyad } from "@/components/made-with-dyad";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/contexts/SessionContext";
import { useNavigate } from "react-router-dom";
import VeloXHero from "@/components/VeloXHero";
import { useEffect, useState } from "react";
import { showError } from "@/utils/toast";

const Index = () => {
  const { user, loading: sessionLoading } = useSession();
  const navigate = useNavigate();
  const [profileLoading, setProfileLoading] = useState(true);
  const [registrationStep, setRegistrationStep] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionLoading && user) {
      fetchRegistrationStep();
    } else if (!sessionLoading && !user) {
      // Se não houver usuário logado, o ProtectedRoute já redireciona para /login
      // ou o usuário pode clicar em "Sou Passageiro" para iniciar o registro
    }
  }, [user, sessionLoading]);

  const fetchRegistrationStep = async () => {
    setProfileLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('registration_step')
      .eq('id', user?.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found (new user)
      console.error('Erro ao buscar passo de registro:', error.message);
      showError('Erro ao carregar informações do perfil.');
      setRegistrationStep('initial'); // Assume initial if error
    } else if (data) {
      setRegistrationStep(data.registration_step);
    } else {
      setRegistrationStep('initial'); // New user, no profile yet
    }
    setProfileLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handlePassengerClick = () => {
    if (sessionLoading || profileLoading) return; // Prevent action while loading

    if (!user) {
      navigate('/register'); // Se não logado, vai para o registro
      return;
    }

    switch (registrationStep) {
      case 'initial':
        navigate('/register');
        break;
      case 'email_confirmed': // Esta etapa será pulada, mas mantida para consistência
      case 'phone_verified': // Agora, após a verificação de e-mail, vai para adicionar pagamento
        navigate('/add-payment');
        break;
      case 'payment_added':
        navigate('/registration-success');
        break;
      case 'completed':
        navigate('/request-ride'); // Redirecionar para a tela de solicitar corrida
        break;
      default:
        navigate('/register'); // Fallback
        break;
    }
  };

  const handleDriverClick = () => {
    console.log("Motorista clicado!");
    navigate('/tasks'); // Por enquanto, redireciona para tasks
  };

  if (sessionLoading || profileLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-veloxGreen-background text-veloxGreen-text">Carregando...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-veloxGreen-background p-4">
      <VeloXHero
        onPassengerClick={handlePassengerClick}
        onDriverClick={handleDriverClick}
      />

      <div className="text-center mt-8">
        {user ? (
          <>
            <p className="text-xl text-veloxGreen-text mb-2">Olá, {user.email}</p>
            <Button onClick={handleLogout} className="btn-velox">
              Sair
            </Button>
          </>
        ) : (
          <p className="text-xl text-veloxGreen-text">
            Você não está logado. Por favor, faça login para continuar.
          </p>
        )}
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;