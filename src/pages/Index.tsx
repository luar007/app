import { MadeWithDyad } from "@/components/made-with-dyad";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/contexts/SessionContext";
import { useNavigate } from "react-router-dom";
import VeloXHero from "@/components/VeloXHero"; // Importar o novo componente

const Index = () => {
  const { user } = useSession();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handlePassengerClick = () => {
    console.log("Passageiro clicado!");
    navigate('/tasks'); // Redirecionar para /tasks
  };

  const handleDriverClick = () => {
    console.log("Motorista clicado!");
    navigate('/tasks'); // Redirecionar para /tasks
  };

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