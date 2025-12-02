import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 bg-transparent">
      <Button variant="ghost" size="icon" className="text-white hover:bg-gray-700">
        <Menu className="h-6 w-6" />
      </Button>
      <div className="flex items-center space-x-2">
        {/* Substitua por um logo real se tiver um */}
        <span className="text-2xl font-bold text-white">VeloX</span>
      </div>
      <Button variant="ghost" size="icon" className="text-white hover:bg-gray-700">
        <Bell className="h-6 w-6" />
      </Button>
    </header>
  );
};

export default Header;