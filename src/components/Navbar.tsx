
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Logo from './Logo';
import { Eye, Layers, Image, Upload, Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Color Picker', icon: <Eye className="h-4 w-4" /> },
    { name: 'Noise Remover', icon: <Layers className="h-4 w-4" /> },
    { name: 'Compression', icon: <Image className="h-4 w-4" /> },
    { name: 'Segmentation', icon: <Layers className="h-4 w-4" /> },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Logo />
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              className="flex items-center gap-2 text-sm transition-all hover:text-colorscope-purple"
            >
              {item.icon}
              {item.name}
            </Button>
          ))}
          <Button className="ml-2 gradient-bg">
            <Upload className="h-4 w-4 mr-2" />
            Upload Image
          </Button>
        </nav>
        
        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="icon"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>
      
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 glass animate-fade-in py-4">
          <div className="flex flex-col gap-2 px-4">
            {navItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                className="flex justify-start items-center gap-2 text-sm"
              >
                {item.icon}
                {item.name}
              </Button>
            ))}
            <Button className="mt-2 gradient-bg">
              <Upload className="h-4 w-4 mr-2" />
              Upload Image
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
