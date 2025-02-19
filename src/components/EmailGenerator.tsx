import { useState, useEffect } from 'react';
import { Copy, Trash2, Loader, QrCode } from 'lucide-react';
import { toast } from 'sonner';
import { EmailSettings } from './EmailSettings';
import { BASE_URL } from '../common';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { QRCodeSVG } from 'qrcode.react';
import CryptoJS from 'crypto-js';

const SECRET_KEY = "Cusatian@12345";

const encryptData = (data) => {
  return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
};

const decryptData = (ciphertext) => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
};

interface EmailGeneratorProps {
  onEmailGenerated: (email: string) => void;
  currentEmail: string;
}

export const EmailGenerator = ({ onEmailGenerated, currentEmail }: EmailGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [userIp, setUserIp] = useState('');

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('temporaryEmail');
    if (storedEmail) {
      const decryptedEmail = decryptData(storedEmail);
      if (decryptedEmail) {
        onEmailGenerated(decryptedEmail);
      }
    } else {
      fetchUserIP().then(generateEmail).catch(error => {
        console.error("Failed to fetch IP or generate email:", error);
        toast.error("Failed to generate email. Please check your network connection.");
      });
    }
  }, []);

  const fetchUserIP = async () => {
    try {
      const response = await fetch('https://api64.ipify.org?format=json');
      const data = await response.json();
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
      // if (data.status) {
        const email = data.data;
        sessionStorage.setItem('temporaryEmail', encryptData(email));
        onEmailGenerated(email);
        toast.success(`New email generated: ${email}`);
      // } else {
      //   toast.error("Failed to generate email");
      // }
    } catch (error) {
      console.error("Email generation error:", error);
      toast.error("Failed to generate email. Please try again.",error);
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
    sessionStorage.removeItem('temporaryEmail');
    onEmailGenerated('');
    toast.success("Email address deleted!");
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4 sm:p-6">
      <div className="bg-white shadow-md rounded-lg p-4 flex flex-col sm:flex-row items-center">
        <input
          type="text"
          value={currentEmail}
          readOnly
          placeholder="Your temporary email address"
          className="flex-1 px-4 py-2 text-sm sm:text-base border rounded-lg focus:outline-none w-full sm:w-auto"
        />
        <div className="flex gap-2 mt-2 sm:mt-0 sm:ml-2">
          <Sheet>
            <SheetTrigger>
              <button className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                <QrCode className="w-5 h-5" />
              </button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Share via QR Code</SheetTitle>
                <SheetDescription>
                  Scan this code to quickly access your email
                </SheetDescription>
              </SheetHeader>
              <div className="flex justify-center items-center mt-8">
                <QRCodeSVG value={currentEmail || ''} size={200} level="H" includeMargin={true} />
              </div>
            </SheetContent>
          </Sheet>
          <button onClick={copyEmail} className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            <Copy className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="flex justify-center gap-4 mt-4">
        <button onClick={() => fetchUserIP().then(generateEmail).catch(error => {
          console.error("Failed to fetch IP or generate email:", error);
          toast.error("Failed to generate email. Please check your network connection.");
        })} disabled={isGenerating} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2">
          {isGenerating ? <Loader className="animate-spin w-4 h-4" /> : "Generate"}
        </button>
        <button onClick={deleteEmail} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
          <Trash2 className="w-5 h-5" />
        </button>
        <EmailSettings onExpirationChange={() => {}} />
      </div>
    </div>
  );
};