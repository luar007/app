import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, Phone, Lock, Camera } from 'lucide-react';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { showSuccess, showError } from '@/utils/toast';
import BottomNavBar from '@/components/BottomNavBar';

interface ProfileData {
  first_name: string;
  last_name: string;
  avatar_url: string;
}

const PersonalInfo = () => {
  const { user, loading: sessionLoading } = useSession();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionLoading && user) {
      fetchProfile();
    } else if (!sessionLoading && !user) {
      navigate('/login');
    }
  }, [user, sessionLoading, navigate]);

  const fetchProfile = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('first_name, last_name, avatar_url')
      .eq('id', user?.id)
      .single();

    if (error) {
      console.error('Erro ao buscar perfil:', error.message);
      showError('Erro ao carregar perfil.');
      setProfile({ first_name: '', last_name: '', avatar_url: '' });
    } else {
      setProfile(data);
      setFirstName(data.first_name || '');
      setLastName(data.last_name || '');
      setAvatarUrl(data.avatar_url || '');
    }
    setLoading(false);
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) {
      showError('Você precisa estar logado para alterar o avatar.');
      return;
    }
    if (event.target.files && event.target.files[0]) {
      setLoading(true);
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Erro ao fazer upload do avatar:', uploadError.message);
        showError('Erro ao fazer upload do avatar.');
        setLoading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const newAvatarUrl = publicUrlData?.publicUrl;

      if (newAvatarUrl) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ avatar_url: newAvatarUrl })
          .eq('id', user.id);

        if (updateError) {
          console.error('Erro ao atualizar URL do avatar:', updateError.message);
          showError('Erro ao atualizar URL do avatar.');
        } else {
          setAvatarUrl(newAvatarUrl);
          showSuccess('Avatar atualizado com sucesso!');
        }
      }
      setLoading(false);
    }
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showError('Você precisa estar logado para salvar as alterações.');
      return;
    }
    setLoading(true);
    const { error } = await supabase
      .from('profiles')
      .update({ first_name: firstName, last_name: lastName })
      .eq('id', user.id);

    if (error) {
      console.error('Erro ao salvar alterações:', error.message);
      showError('Erro ao salvar alterações.');
    } else {
      showSuccess('Informações pessoais atualizadas com sucesso!');
    }
    setLoading(false);
  };

  if (loading || sessionLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-veloxGreen-background text-veloxGreen-text">Carregando informações pessoais...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-veloxGreen-background p-4 text-veloxGreen-text pb-20">
      <h1 className="text-4xl font-bold mb-8">Informações Pessoais</h1>

      <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
        <form onSubmit={handleSaveChanges} className="space-y-6">
          <div className="flex flex-col items-center">
            <label htmlFor="avatar-upload" className="cursor-pointer relative">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={avatarUrl || "https://github.com/shadcn.png"} alt="Avatar" />
                <AvatarFallback className="bg-veloxGreen text-white text-2xl">
                  {firstName ? firstName[0] : 'U'}
                </AvatarFallback>
              </Avatar>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
                disabled={loading}
              />
              <div className="absolute bottom-4 right-0 bg-veloxGreen rounded-full p-1">
                <Camera className="h-4 w-4 text-white" />
              </div>
            </label>
          </div>

          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-1">Nome</label>
            <Input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="bg-gray-700 border-gray-600 text-veloxGreen-text placeholder-gray-400 rounded-md focus:ring-veloxGreen focus:border-veloxGreen"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-1">Sobrenome</label>
            <Input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="bg-gray-700 border-gray-600 text-veloxGreen-text placeholder-gray-400 rounded-md focus:ring-veloxGreen focus:border-veloxGreen"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">E-mail</label>
            <Input
              id="email"
              type="email"
              value={user.email || ''}
              readOnly
              className="bg-gray-700 border-gray-600 text-gray-400 rounded-md cursor-not-allowed"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">Número de Telefone</label>
            <Input
              id="phone"
              type="tel"
              value={user.phone || 'Não informado'} // Supabase armazena o telefone no objeto user
              readOnly
              className="bg-gray-700 border-gray-600 text-gray-400 rounded-md cursor-not-allowed"
            />
          </div>

          <Button type="button" onClick={() => console.log('Atualizar Senha clicado')} className="btn-velox w-full">
            <Lock className="h-5 w-5 mr-2" /> Atualizar Senha
          </Button>

          <Button type="submit" className="btn-velox w-full" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </form>
      </div>
      <MadeWithDyad />
      <BottomNavBar />
    </div>
  );
};

export default PersonalInfo;