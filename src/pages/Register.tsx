import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { showSuccess, showError } from '@/utils/toast';
import { MadeWithDyad } from '@/components/made-with-dyad';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showError('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          registration_step: 'email_confirmed', // Próximo passo após confirmar e-mail
        },
      },
    });

    if (error) {
      console.error('Erro ao registrar:', error.message);
      showError(`Erro ao registrar: ${error.message}`);
    } else {
      showSuccess('Registro bem-sucedido! Verifique seu e-mail para confirmar.');
      navigate('/verify-phone'); // Redirecionar para a próxima etapa
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-veloxGreen-background p-4">
      <h1 className="text-4xl font-bold mb-8 text-veloxGreen-text">Criar Conta VeloX</h1>
      <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg">
        <form onSubmit={handleRegister} className="space-y-4">
          <Input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-gray-700 border-gray-600 text-veloxGreen-text placeholder-gray-400 rounded-md focus:ring-veloxGreen focus:border-veloxGreen"
          />
          <Input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-gray-700 border-gray-600 text-veloxGreen-text placeholder-gray-400 rounded-md focus:ring-veloxGreen focus:border-veloxGreen"
          />
          <Input
            type="password"
            placeholder="Confirmar Senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="bg-gray-700 border-gray-600 text-veloxGreen-text placeholder-gray-400 rounded-md focus:ring-veloxGreen focus:border-veloxGreen"
          />
          <Button type="submit" className="btn-velox w-full" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrar'}
          </Button>
        </form>
        <p className="text-center text-veloxGreen-text mt-4">
          Já tem uma conta?{' '}
          <button onClick={() => navigate('/login')} className="text-veloxGreen hover:underline">
            Faça login
          </button>
        </p>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Register;