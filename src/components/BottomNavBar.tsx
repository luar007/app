import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Map, CreditCard, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const BottomNavBar = () => {
  const navItems = [
    { name: 'Início', icon: Home, path: '/request-ride' },
    { name: 'Viagens', icon: Map, path: '/trips' }, // Usando Map para Viagens por enquanto
    { name: 'Pagamento', icon: CreditCard, path: '/payments' },
    { name: 'Perfil', icon: User, path: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 shadow-lg z-50">
      <div className="flex justify-around h-16 items-center max-w-md mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center text-gray-400 hover:text-veloxGreen transition-colors",
                isActive && "text-veloxGreen"
              )
            }
          >
            <item.icon className="h-6 w-6 mb-1" />
            <span className="text-xs font-medium">{item.name}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavBar;