import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSession } from '@/contexts/SessionContext';

const Login = () => {
  const navigate = useNavigate();
  const { session, loading } = useSession();

  useEffect(() => {
    if (session && !loading) {
      navigate('/'); // Redirecionar para a rota '/' (tela de seleção) após o login
    }
  }, [session, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-veloxGreen-background">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-veloxGreen-text">Login VeloX</h2>
        <Auth
          supabaseClient={supabase}
          providers={[]}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'hsl(var(--velox-green))',
                  brandAccent: 'hsl(var(--velox-green-dark))',
                  inputBackground: 'hsl(var(--velox-background))',
                  inputBorder: 'hsl(var(--velox-green-dark))',
                  inputBorderHover: 'hsl(var(--velox-green))',
                  inputBorderFocus: 'hsl(var(--velox-green))',
                  inputText: 'hsl(var(--velox-text))',
                },
              },
            },
          }}
          theme="dark" // Usar tema escuro para combinar com o fundo
        />
      </div>
    </div>
  );
};

export default Login;