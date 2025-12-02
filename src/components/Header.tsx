import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 bg-white shadow-sm">
      <Button variant="ghost" size="icon" className="text-gray-700 hover:bg-gray-100">
        <Menu className="h-6 w-6" />
      </Button>
      <div className="flex items-center space-x-2">
        <span className="text-2xl font-bold bg-gradient-to-r from-veloxPurpleLight to-veloxPurpleDark text-transparent bg-clip-text">VeloX</span>
      </div>
      <Button variant="ghost" size="icon" className="text-gray-700 hover:bg-gray-100">
        <Bell className="h-6 w-6" />
      </Button>
    </header>
  );
};

export default Header;