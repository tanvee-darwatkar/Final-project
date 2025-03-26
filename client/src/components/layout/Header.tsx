import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navigationItems = [
    { name: 'Features', path: '/features' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Demo', path: '/demo' },
  ];

  return (
    <header className="sticky top-0 bg-white shadow-sm z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <BarChart2 className="text-primary mr-2" />
              <span className="text-2xl font-bold text-secondary">KeywordInsight</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            {navigationItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.path}
                className={`text-neutral-700 hover:text-primary font-medium ${
                  location === item.path ? 'text-primary' : ''
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center space-x-4">
            <Link href="/#waitlist">
              <Button className="bg-primary hover:bg-primary/90">Join Waitlist</Button>
            </Link>
            <button 
              className="md:hidden text-neutral-700" 
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white pb-4 px-4">
          <nav className="flex flex-col space-y-4">
            {navigationItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.path}
                className={`text-neutral-700 hover:text-primary font-medium ${
                  location === item.path ? 'text-primary' : ''
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
