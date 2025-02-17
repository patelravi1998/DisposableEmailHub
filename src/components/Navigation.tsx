
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Logo } from './Logo';
import { Link, useLocation } from 'react-router-dom';

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'TempMail' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
    { path: '/blog', label: 'Blog' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'glass premium-shadow backdrop-blur-xl' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Logo />
          
          <div className="hidden md:flex items-center space-x-12">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative py-2 text-base font-medium transition-all duration-300 group ${
                  location.pathname === item.path
                    ? 'text-primary'
                    : 'text-gray-600 hover:text-primary'
                }`}
              >
                <span className="relative">
                  {item.label}
                  <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-primary transform origin-left transition-transform duration-300 ${
                    location.pathname === item.path ? 'scale-x-100' : 'scale-x-0'
                  } group-hover:scale-x-100`} />
                </span>
              </Link>
            ))}
          </div>
          
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-gray-100/80 transition-colors glass"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden absolute top-20 left-0 right-0 transition-all duration-300 transform ${
        isOpen 
          ? 'translate-y-0 opacity-100 visible' 
          : '-translate-y-4 opacity-0 invisible'
      }`}>
        <div className="glass backdrop-blur-xl premium-shadow px-4 py-6">
          <div className="container mx-auto space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`block py-3 px-4 text-base font-medium rounded-xl transition-all duration-300 ${
                  location.pathname === item.path
                    ? 'text-primary bg-primary/5'
                    : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};
