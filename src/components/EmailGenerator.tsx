import { useState, useEffect } from 'react';
import { Copy, Trash2, Loader, QrCode } from 'lucide-react';
import { toast } from 'sonner';
import { EmailSettings } from './EmailSettings';
import { BASE_URL } from '../common';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { QRCodeSVG } from 'qrcode.react';

interface EmailGeneratorProps {
  onEmailGenerated: (email: string) => void;
  currentEmail: string;
}

export const EmailGenerator = ({ onEmailGenerated, currentEmail }: EmailGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [userIp, setUserIp] = useState('');

  useEffect(() => {
    const storedEmail = localStorage.getItem('temporaryEmail');
    if (storedEmail) {
      setTimeout(() => onEmailGenerated(storedEmail), 0);
    } else {
      fetchUserIP().then(generateEmail);
    }
  }, []);

  const fetchUserIP = async () => {
    try {
      const response = await fetch('https://api64.ipify.org?format=json');
      const data = await response.json();
      localStorage.setItem('userIp', data.ip);
      setUserIp(data.ip);
      return data.ip;
    } catch (error) {
      console.error("Failed to fetch IP address:", error);
      return '0.0.0.0';
    }
  };

  const generateEmail = async (ipAddress?: string) => {
    setIsGenerating(true);
    try {
      const ip = ipAddress || userIp;
      const response = await fetch(`${BASE_URL}/users/generateEmail`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ipadress: ip })
      });
      const data = await response.json();
      if (data.status) {
        localStorage.setItem('temporaryEmail', data.data);
        onEmailGenerated(data.data);
        toast.success(`New email generated: ${data.data}`);
        window.location.reload();
      } else {
        toast.error("Failed to generate email");
      }
    } catch (error) {
      toast.error("Failed to generate email");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyEmail = async () => {
    if (!currentEmail) return toast.error("No email address to copy");
    try {
      await navigator.clipboard.writeText(currentEmail);
      toast.success("Email copied to clipboard!");
    } catch {
      toast.error("Failed to copy email address");
    }
  };

  const deleteEmail = () => {
    if (!currentEmail) return toast.error("No email address to delete");
    localStorage.removeItem('temporaryEmail');
    onEmailGenerated('');
    toast.success("Email address deleted!");
    window.location.reload();
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6">
      <div className="glass rounded-2xl mb-6 p-1.5 transition-all hover:shadow-lg hover:scale-[1.02] duration-300">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-white rounded-xl">
          <input
            type="text"
            value={currentEmail}
            readOnly
            placeholder="Your temporary email address"
            className="flex-1 px-4 py-3 text-sm sm:text-base rounded-t-xl sm:rounded-l-xl sm:rounded-tr-none border-b sm:border-r border-gray-100"
          />
          <div className="flex items-center justify-end gap-2 p-2">
            <Sheet>
              <SheetTrigger>
                <button className="bg-gray-100 p-2 rounded-xl hover:bg-gray-200 transition-all">
                  <QrCode className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Share via QR Code</SheetTitle>
                  <SheetDescription>
                    Scan this code to quickly access your temporary email
                  </SheetDescription>
                </SheetHeader>
                <div className="flex justify-center items-center mt-8">
                  <div className="glass p-4 sm:p-6 rounded-2xl premium-shadow">
                    <QRCodeSVG
                      value={currentEmail || ''}
                      size={200}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <button onClick={copyEmail} disabled={!currentEmail} className="bg-blue-500 text-white px-4 py-2 text-sm rounded-xl hover:opacity-90 transition-all">
              Copy
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-4 items-center mb-6">
        <button onClick={() => fetchUserIP().then(generateEmail)} disabled={isGenerating} className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl hover:bg-gray-50 transition-all">
          {isGenerating ? <Loader className="animate-spin w-4 h-4" /> : "Generate"}
        </button>
        <button onClick={deleteEmail} disabled={!currentEmail} className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl hover:bg-gray-50 transition-all">
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
        <EmailSettings onExpirationChange={() => {}} />
      </div>
    </div>
  );
};
