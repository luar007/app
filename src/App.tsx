import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Tasks from "./pages/Tasks";
import Register from "./pages/Register";
import VerifyPhone from "./pages/VerifyPhone";
import AddPayment from "./pages/AddPayment";
import RegistrationSuccess from "./pages/RegistrationSuccess";
import Profile from "./pages/Profile"; // Renomeado de PassengerProfile
import RequestRide from "./pages/RequestRide";
import Trips from "./pages/Trips"; // Nova rota
import Payments from "./pages/Payments"; // Nova rota
import { SessionContextProvider, useSession } from "./contexts/SessionContext";
import { useEffect } from "react";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session && !loading) {
      navigate('/login');
    }
  }, [session, loading, navigate]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-veloxGreen-background text-veloxGreen-text">Carregando autenticação...</div>;
  }

  if (!session) {
    return null; // Ou um spinner de carregamento, ou redirecionando
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SessionContextProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-phone" element={<ProtectedRoute><VerifyPhone /></ProtectedRoute>} />
            <Route path="/add-payment" element={<ProtectedRoute><AddPayment /></ProtectedRoute>} />
            <Route path="/registration-success" element={<ProtectedRoute><RegistrationSuccess /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} /> {/* Rota de perfil atualizada */}
            <Route path="/request-ride" element={<ProtectedRoute><RequestRide /></ProtectedRoute>} />
            <Route path="/trips" element={<ProtectedRoute><Trips /></ProtectedRoute>} /> {/* Nova rota */}
            <Route path="/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} /> {/* Nova rota */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks"
              element={
                <ProtectedRoute>
                  <Tasks />
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </SessionContextProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;