
import { useState } from 'react';
import { Clock } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';

interface EmailSettingsProps {
  onExpirationChange: (minutes: number) => void;
}

export const EmailSettings = ({ onExpirationChange }: EmailSettingsProps) => {
  const [selectedExpiration, setSelectedExpiration] = useState('60'); // Default 1 hour

  const handleExpirationChange = (value: string) => {
    setSelectedExpiration(value);
    onExpirationChange(parseInt(value));
    toast.success(`Email lifespan set to ${getExpirationLabel(value)}`);
  };

  const getExpirationLabel = (minutes: string) => {
    const mins = parseInt(minutes);
    if (mins < 60) return `${mins} minutes`;
    if (mins === 60) return '1 hour';
    if (mins === 1440) return '1 day';
    return `${mins / 60} hours`;
  };

  return (
    <div className="flex items-center gap-2 px-2 sm:px-4">
      <Clock className="w-4 h-4 text-gray-500" />
      <Select value={selectedExpiration} onValueChange={handleExpirationChange}>
        <SelectTrigger className="w-[120px] sm:w-[180px] text-sm sm:text-base h-[34px] sm:h-[42px]">
          <SelectValue placeholder="Select expiration" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="10">10 minutes</SelectItem>
          <SelectItem value="30">30 minutes</SelectItem>
          <SelectItem value="60">1 hour</SelectItem>
          <SelectItem value="180">3 hours</SelectItem>
          <SelectItem value="360">6 hours</SelectItem>
          <SelectItem value="1440">1 day</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
