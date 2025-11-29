import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { showSuccess, showError } from '@/utils/toast';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { useSession } from '@/contexts/SessionContext';

const VerifyPhone = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useSession();

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      phone: phoneNumber,
    });

    if (error) {
      console.error('Erro ao enviar OTP:', error.message);
      showError(`Erro ao enviar OTP: ${error.message}`);
    } else {
      showSuccess('OTP enviado para o seu telefone!');
      setOtpSent(true);
    }
    setLoading(false);
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      phone: phoneNumber,
      token: otp,
      type: 'sms',
    });

    if (error) {
      console.error('Erro ao verificar OTP:', error.message);
      showError(`Erro ao verificar OTP: ${error.message}`);
    } else {
      showSuccess('Telefone verificado com sucesso!');
      // Atualizar o registration_step no perfil do usuário
      if (user) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ registration_step: 'phone_verified' })
          .eq('id', user.id);

        if (updateError) {
          console.error('Erro ao atualizar passo de registro:', updateError.message);
          showError('Erro ao atualizar passo de registro.');
        }
      }
      navigate('/add-payment'); // Redirecionar para a próxima etapa
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-veloxGreen-background p-4">
      <h1 className="text-4xl font-bold mb-8 text-veloxGreen-text">Verificar Telefone</h1>
      <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg">
        {!otpSent ? (
          <form onSubmit={sendOtp} className="space-y-4">
            <Input
              type="tel"
              placeholder="Número de Telefone (ex: +5511987654321)"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              className="bg-gray-700 border-gray-600 text-veloxGreen-text placeholder-gray-400 rounded-md focus:ring-veloxGreen focus:border-veloxGreen"
            />
            <Button type="submit" className="btn-velox w-full" disabled={loading}>
              {loading ? 'Enviando OTP...' : 'Enviar OTP'}
            </Button>
          </form>
        ) : (
          <form onSubmit={verifyOtp} className="space-y-4">
            <Input
              type="text"
              placeholder="Código OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="bg-gray-700 border-gray-600 text-veloxGreen-text placeholder-gray-400 rounded-md focus:ring-veloxGreen focus:border-veloxGreen"
            />
            <Button type="submit" className="btn-velox w-full" disabled={loading}>
              {loading ? 'Verificando...' : 'Verificar OTP'}
            </Button>
          </form>
        )}
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default VerifyPhone;