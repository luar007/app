import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Camera, UploadCloud, CheckCircle } from 'lucide-react';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { showSuccess, showError } from '@/utils/toast';
import BottomNavBar from '@/components/BottomNavBar';

const DocumentVerification = () => {
  const { user } = useSession();
  const [idFront, setIdFront] = useState<File | null>(null);
  const [idBack, setIdBack] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileUpload = (setter: React.Dispatch<React.SetStateAction<File | null>>) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setter(event.target.files[0]);
    }
  };

  const uploadFile = async (file: File, folder: string) => {
    if (!user) {
      throw new Error('Usuário não autenticado.');
    }
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('verification-documents')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }
    return filePath;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idFront || !idBack || !selfie) {
      showError('Por favor, envie todos os documentos.');
      return;
    }
    if (!user) {
      showError('Você precisa estar logado para enviar documentos.');
      return;
    }

    setLoading(true);
    try {
      const idFrontPath = await uploadFile(idFront, 'id-front');
      const idBackPath = await uploadFile(idBack, 'id-back');
      const selfiePath = await uploadFile(selfie, 'selfie');

      // Aqui você pode registrar os caminhos dos arquivos no banco de dados do perfil do usuário
      // ou em uma tabela separada de verificações.
      // Por simplicidade, vamos apenas mostrar sucesso.
      console.log('Documentos enviados:', { idFrontPath, idBackPath, selfiePath });

      showSuccess('Documentos enviados para análise com sucesso!');
      navigate('/settings'); // Redirecionar de volta para configurações ou para uma tela de status
    } catch (error: any) {
      console.error('Erro ao enviar documentos:', error.message);
      showError(`Erro ao enviar documentos: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const FileInput = ({ label, file, setter, icon: Icon }: { label: string; file: File | null; setter: React.Dispatch<React.SetStateAction<File | null>>; icon: React.ElementType }) => (
    <div className="flex flex-col items-center space-y-2">
      <label htmlFor={`file-upload-${label}`} className="cursor-pointer flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors text-veloxGreen-text">
        {file ? (
          <div className="flex flex-col items-center">
            <CheckCircle className="h-8 w-8 text-veloxGreen mb-2" />
            <span className="text-sm text-center">{file.name}</span>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Icon className="h-8 w-8 mb-2" />
            <span className="text-sm text-center">{label}</span>
          </div>
        )}
      </label>
      <Input
        id={`file-upload-${label}`}
        type="file"
        accept="image/*"
        onChange={handleFileUpload(setter)}
        className="hidden"
        disabled={loading}
      />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center bg-veloxGreen-background p-4 text-veloxGreen-text pb-20">
      <h1 className="text-4xl font-bold mb-8 text-center">Verificação de Documentos</h1>

      <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <FileInput label="Documento de Identidade (Frente)" file={idFront} setter={setIdFront} icon={UploadCloud} />
          <FileInput label="Documento de Identidade (Verso)" file={idBack} setter={setIdBack} icon={UploadCloud} />
          <FileInput label="Selfie para Comparação Facial" file={selfie} setter={setSelfie} icon={Camera} />

          <Button type="submit" className="btn-velox w-full" disabled={loading || !idFront || !idBack || !selfie}>
            {loading ? 'Enviando...' : 'Enviar para Análise'}
          </Button>
        </form>
      </div>
      <MadeWithDyad />
      <BottomNavBar />
    </div>
  );
};

export default DocumentVerification;