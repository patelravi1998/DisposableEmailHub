import { useState, useEffect } from 'react';
import { Copy, Trash2, Loader, QrCode } from 'lucide-react';
import { toast } from 'sonner';
import { EmailSettings } from './EmailSettings';
import { BASE_URL } from '../common';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { QRCodeSVG } from 'qrcode.react';
import CryptoJS from 'crypto-js';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

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

interface EmailGeneratorProps {
  onEmailGenerated: (email: string) => void;
  currentEmail: string;
}

export const EmailGenerator = ({ onEmailGenerated, currentEmail }: EmailGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('temporaryEmail');
    if (storedEmail) {
      const decryptedEmail = decryptData(storedEmail);
      if (decryptedEmail) {
        onEmailGenerated(decryptedEmail);
      }
    } else {
      fetchUserId().then(generateEmail);
    }
  }, []);

  const fetchUserId = async () => {
    try {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      setUserId(result.visitorId); // Unique ID for the user
      return result.visitorId;
    } catch (error) {
      console.error("Failed to generate user ID:", error);
      return 'unknown-user';
    }
  };

  const generateEmail = async (deviceId?: string) => {
    setIsGenerating(true);
    try {
      const id = deviceId || userId;
      const response = await fetch(`${BASE_URL}/users/generateEmail`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ipadress: id }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate email: ${response.statusText}`);
      }

      const data = await response.json();
      const email = data.data;
      sessionStorage.setItem('temporaryEmail', encryptData(email));
      sessionStorage.setItem('userIp', encryptData(id));
      onEmailGenerated(email);
      toast.success(`New email generated: ${email}`);
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
    sessionStorage.removeItem('temporaryEmail');
    onEmailGenerated('');
    toast.success("Email address deleted!");
    setTimeout(() => {
      window.location.reload(); // Reload the page after successful deletion
    }, 1000);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6">
      {/* Email Display Box */}
      <div className="glass rounded-2xl mb-6 p-1.5 transition-all hover:shadow-lg hover:scale-[1.02] duration-300">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-white rounded-xl">
          <input
            type="text"
            value={currentEmail}
            readOnly
            placeholder="Your temporary email address"
            className="flex-1 px-4 py-3 text-sm sm:text-base rounded-t-xl sm:rounded-l-xl sm:rounded-tr-none border-b sm:border-r border-gray-100"
          />
          <Sheet>
            <SheetTrigger>
              <button className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all">
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
          <div className="flex items-center justify-end gap-2 p-2">
            <button 
              onClick={copyEmail} 
              disabled={!currentEmail} 
              className="bg-blue-500 text-white px-4 py-2 text-sm rounded-xl hover:opacity-90 transition-all"
            >
              Copy
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-4 items-center mb-6">
        {/* Generate Button */}
        <button 
          onClick={() => fetchUserId().then(generateEmail)}
          disabled={isGenerating} 
  className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl hover:bg-gray-50 transition-all"
>
  {isGenerating ? <Loader className="animate-spin w-4 h-4" /> : "Generate"}
</button>


        {/* Refresh Button (Newly Added) */}
        {/* <button 
          onClick={refreshInbox}
          disabled={isRefreshing || !currentEmail} 
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl hover:bg-gray-50 transition-all"
        >
          <RefreshCw className={w-4 h-4 ${isRefreshing ? "animate-spin" : ""}} />
          Refresh
        </button> */}

        {/* Delete Button */}
        <button 
          onClick={deleteEmail} 
          disabled={!currentEmail} 
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl hover:bg-gray-50 transition-all"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>

        {/* Email Settings (No changes, assuming it works) */}
        <EmailSettings onExpirationChange={() => {}} />
      </div>
    </div>
  );
};
