import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface ToolbarProps {
  backgroundColor: string;
  onColorChange: (color: string) => void;
}

export const Toolbar = ({ backgroundColor, onColorChange }: ToolbarProps) => {
  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className={`fixed bottom-0 left-0 right-0 transition-opacity duration-200 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="flex items-center justify-center gap-4 p-4 m-4 rounded-lg bg-toolbar-background backdrop-blur-sm">
        <input
          type="color"
          value={backgroundColor}
          onChange={(e) => onColorChange(e.target.value)}
          className="w-8 h-8 rounded cursor-pointer"
        />
        <button
          onClick={toggleVisibility}
          className="p-2 rounded-full hover:bg-toolbar-hover transition-colors"
        >
          {isVisible ? <Eye className="text-white" /> : <EyeOff className="text-white" />}
        </button>
      </div>
    </div>
  );
};