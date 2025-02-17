
import { Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Logo = () => {
  return (
    <Link 
      to="/" 
      className="flex items-center gap-3 group"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 rounded-xl transform rotate-6 transition-transform group-hover:rotate-12 group-hover:scale-110" />
        <div className="relative bg-gradient-to-r from-primary to-blue-600 text-white p-2.5 rounded-xl transform transition-all duration-300 group-hover:scale-110 premium-shadow">
          <Mail className="w-5 h-5" />
        </div>
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-xl bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          TempMail
        </span>
        <span className="text-xs text-gray-500 hidden sm:block">
          Secure Temporary Email
        </span>
      </div>
    </Link>
  );
};
