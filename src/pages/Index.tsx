import { MadeWithDyad } from "@/components/made-with-dyad";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/contexts/SessionContext";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { user } = useSession();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Your App!</h1>
        {user ? (
          <>
            <p className="text-xl text-gray-600 mb-2">Hello, {user.email}</p>
            <Button onClick={handleLogout} className="mt-4">
              Logout
            </Button>
          </>
        ) : (
          <p className="text-xl text-gray-600">
            You are not logged in. Please log in to continue.
          </p>
        )}
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;