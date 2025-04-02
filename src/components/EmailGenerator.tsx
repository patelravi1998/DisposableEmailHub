import { useState, useEffect } from 'react';
import { Copy, Trash2, Loader, QrCode } from 'lucide-react';
import { toast } from 'sonner';
import { EmailSettings } from './EmailSettings';
import { BASE_URL } from '../common';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { QRCodeSVG } from 'qrcode.react';
import CryptoJS from 'crypto-js';
import { useTranslation } from "react-i18next";
import { EmailOrderForm } from './EmailOrderForm';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SECRET_KEY = "Cusatian@12345";

const encryptData = (data: string) => {
  return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
};

const decryptData = (ciphertext: string) => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
};

// ✅ Set Cookie
const setCookie = (name: string, value: string, days = 7) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; path=/; expires=${expires}; Secure`;
};

// ✅ Get Cookie
const getCookie = (name: string) => {
  return document.cookie
    .split('; ')
    .find(row => row.startsWith(name + "="))
    ?.split('=')[1] || null;
};

// ✅ Remove Cookie
const removeCookie = (name: string) => {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
};

interface EmailGeneratorProps {
  onEmailGenerated: (email: string) => void;
  currentEmail: string;
}

export const EmailGenerator = ({ onEmailGenerated, currentEmail }: EmailGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [userId, setUserId] = useState('');
  const { t } = useTranslation();



  useEffect(() => {
    const storedEmail = getCookie('temporaryEmail');
    if (storedEmail) {
      const decryptedEmail = decryptData(storedEmail);
      if (decryptedEmail) {
        onEmailGenerated(decryptedEmail);
        // checkEmailExpiration(decryptedEmail);
      }
    } else {
      fetchUserId().then(generateEmail);
    }
  }, []);

  const fetchUserId = async () => {
    try {
      const timestamp = Date.now().toString().slice(-6);
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const sessionId = `${timestamp}${randomNum}`;
      setUserId(sessionId);
      return sessionId;
    } catch (error) {
      console.error("Failed to generate Session ID:", error);
      return 'invalidSession';
    }
  };

  const generateEmail = async (deviceId?: string) => {
    setIsGenerating(true);
    try {
      const id = deviceId || userId;
      const response = await fetch(`${API_BASE_URL}/users/generateEmail`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ipadress: id }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate email: ${response.statusText}`);
      }

      const data = await response.json();
      const email = data.data;
      
      setCookie('temporaryEmail', encryptData(email));
      setCookie('userIp', encryptData(id));



      onEmailGenerated(email);
      toast.success(`New email generated: ${email}`);
      window.location.reload();
    } catch (error) {
      console.error("Email generation error:", error);
      toast.error(`Failed to generate email. Please try again. Error: ${error.message}`);
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
    
    removeCookie('temporaryEmail');
    removeCookie('userIp');

    onEmailGenerated('');
    toast.success("Email address deleted!");
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6">
      <div className="glass rounded-2xl mb-6 p-1.5 transition-all hover:shadow-lg hover:scale-[1.02] duration-300">
        <div className="flex flex-wrap sm:flex-nowrap items-center bg-white rounded-xl p-2 gap-2">
          <input
            type="text"
            value={currentEmail}
            readOnly
            placeholder="Your temporary email address"
            className="flex-1 px-4 py-3 text-sm sm:text-base rounded-xl border border-gray-100 w-full sm:w-auto"
          />
          <Sheet>
            <SheetTrigger>
              <button className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all whitespace-nowrap">
                <QrCode className="w-5 h-5" />
              </button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Scan QR Code</SheetTitle>
              </SheetHeader>
              <div className="flex justify-center p-4">
                {currentEmail ? <QRCodeSVG value={currentEmail} size={200} /> : <p>No email available</p>}
              </div>
            </SheetContent>
          </Sheet>
          <button 
            onClick={copyEmail} 
            disabled={!currentEmail} 
            className="bg-blue-500 text-white px-4 py-2 text-sm rounded-xl hover:opacity-90 transition-all whitespace-nowrap"
          >
            {t("Copy")}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 items-center mb-6">
        <button 
          onClick={() => fetchUserId().then(generateEmail)}
          disabled={isGenerating} 
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl hover:bg-gray-50 transition-all"
        >
          {isGenerating ? <Loader className="animate-spin w-4 h-4" /> : t("Generate")}
        </button>

        <button 
          onClick={deleteEmail} 
          disabled={!currentEmail} 
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl hover:bg-gray-50 transition-all"
        >
          <Trash2 className="w-4 h-4" />
          {t("Delete")}
        </button>
        <EmailOrderForm tempEmail={currentEmail} />
        <EmailSettings onExpirationChange={() => {}} />
      </div>
    </div>
  );
};