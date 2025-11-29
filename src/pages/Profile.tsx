import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, History, CreditCard, Bell, Lock, Settings, MapPin, LogOut } from 'lucide-react';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { showSuccess, showError } from '@/utils/toast';
import BottomNavBar from '@/components/BottomNavBar';

interface ProfileData {
  first_name: string;
  last_name: string;
  avatar_url: string;
}

const Profile = () => {
  const { user, loading: sessionLoading } = useSession();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionLoading && user) {
      fetchProfile();
    } else if (!sessionLoading && !user) {
      navigate('/login'); // Redirecionar se não houver usuário logado
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
      setProfile({ first_name: 'Usuário', last_name: 'VeloX', avatar_url: '' }); // Fallback
    } else {
      setProfile(data);
    }
    setLoading(false);
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setAvatarFile(event.target.files[0]);
      uploadAvatar(event.target.files[0]);
    }
  };

  const uploadAvatar = async (file: File) => {
    if (!user) {
      showError('Você precisa estar logado para alterar o avatar.');
      return;
    }

    setLoading(true);
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

    const publicUrl = publicUrlData?.publicUrl;

    if (publicUrl) {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) {
        console.error('Erro ao atualizar URL do avatar:', updateError.message);
        showError('Erro ao atualizar URL do avatar.');
      } else {
        setProfile(prev => prev ? { ...prev, avatar_url: publicUrl } : null);
        showSuccess('Avatar atualizado com sucesso!');
      }
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Erro ao sair:', error.message);
      showError('Erro ao sair da conta.');
    } else {
      showSuccess('Você saiu da sua conta.');
      navigate('/login');
    }
    setLoading(false);
  };

  if (loading || sessionLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-veloxGreen-background text-veloxGreen-text">Carregando perfil...</div>;
  }

  if (!user) {
    return null; // Já redirecionado pelo useEffect
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-veloxGreen-background p-4 text-veloxGreen-text pb-20">
      <h1 className="text-4xl font-bold mb-8">Meu Perfil</h1>

      <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg mb-8 flex flex-col items-center">
        <label htmlFor="avatar-upload" className="cursor-pointer relative">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={profile?.avatar_url || "https://github.com/shadcn.png"} alt="Avatar" />
            <AvatarFallback className="bg-veloxGreen text-white text-2xl">
              {profile?.first_name ? profile.first_name[0] : 'U'}
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
            <User className="h-4 w-4 text-white" />
          </div>
        </label>
        <h2 className="text-2xl font-semibold mb-2">{profile?.first_name} {profile?.last_name}</h2>
        <p className="text-gray-400 flex items-center mb-4">
          <Mail className="h-4 w-4 mr-2" /> {user.email}
        </p>
        <Button onClick={() => navigate('/edit-profile')} className="btn-velox mb-6">
          <User className="h-4 w-4 mr-2" /> Editar Perfil
        </Button>

        <div className="w-full space-y-3">
          <Button variant="ghost" onClick={() => navigate('/trips')} className="w-full justify-start text-veloxGreen-text hover:bg-gray-700">
            <History className="h-5 w-5 mr-3" /> Histórico de Viagens
          </Button>
          <Button variant="ghost" onClick={() => navigate('/payments')} className="w-full justify-start text-veloxGreen-text hover:bg-gray-700">
            <CreditCard className="h-5 w-5 mr-3" /> Meus Pagamentos
          </Button>
          <Button variant="ghost" onClick={() => navigate('/settings')} className="w-full justify-start text-veloxGreen-text hover:bg-gray-700">
            <Settings className="h-5 w-5 mr-3" /> Configurações
          </Button>
          <Button variant="ghost" className="w-full justify-start text-veloxGreen-text hover:bg-gray-700">
            <Bell className="h-5 w-5 mr-3" /> Notificações
          </Button>
          <Button variant="ghost" className="w-full justify-start text-veloxGreen-text hover:bg-gray-700">
            <Lock className="h-5 w-5 mr-3" /> Privacidade
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

export default Profile;