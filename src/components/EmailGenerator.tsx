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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import Cookies from "js-cookie";
import { EmailList } from './inbox/EmailList';

 
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
 
const setCookie = (name: string, value: string, days = 7) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; path=/; expires=${expires}; Secure`;
};
 
const getCookie = (name: string) => {
  return document.cookie
    .split('; ')
    .find(row => row.startsWith(name + "="))
    ?.split('=')[1] || null;
};
 
const removeCookie = (name: string) => {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
};
 
// Add helper function to set expiration date in localStorage
const setEmailExpiration = (email: string, days = 7) => {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + days);
  localStorage.setItem(`emailExpiration_${email}`, expirationDate.toString());
};
 
// Add helper function to check if email is expired
const isEmailExpired = (email: string) => {
  const expirationDateStr = localStorage.getItem(`emailExpiration_${email}`);
  if (!expirationDateStr) return true; // No expiration date means it's expired
  
  const expirationDate = new Date(expirationDateStr);
  return new Date() > expirationDate;
};
 
interface EmailGeneratorProps {
  onEmailGenerated: (email: string) => void;
  currentEmail: string;
}
 
// [Previous imports remain exactly the same...]
 
export const EmailGenerator = ({ onEmailGenerated, currentEmail }: EmailGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [userId, setUserId] = useState('');
  const [purchasedEmails, setPurchasedEmails] = useState<Array<{email: string, ipaddress: string}>>([]);
  const [selectedPurchasedEmail, setSelectedPurchasedEmail] = useState<string>('');
  const { t } = useTranslation();
  const [selectedEmailData, setSelectedEmailData] = useState<{email: string, ipaddress: string} | null>(null);

 
  // Add these helper functions
  const storePurchasedEmails = (emails: Array<{email: string, ipaddress: string}>) => {
    localStorage.setItem('purchasedEmails', JSON.stringify(emails));
  };
 
  const getPurchasedEmailsFromStorage = () => {
    const stored = localStorage.getItem('purchasedEmails');
    return stored ? JSON.parse(stored) : [];
  };
 
  useEffect(() => {
    const checkPurchasedEmails = async () => {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        // Existing non-logged-in flow
        const storedEmail = getCookie('temporaryEmail');
        if (storedEmail) {
          const decryptedEmail = decryptData(storedEmail);
          if (decryptedEmail) {
            if (!isEmailExpired(decryptedEmail)) {
              onEmailGenerated(decryptedEmail);
            } else {
              removeCookie('temporaryEmail');
              removeCookie('userIp');
              fetchUserId().then(generateEmail);
            }
          }
        } else {
          fetchUserId().then(generateEmail);
        }
        return;
      }
 
      // User is logged in - fetch purchased emails
      try {
        const response = await fetch(`${API_BASE_URL}/users/user_purchased_mails`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        });
 
        if (!response.ok) throw new Error(`Failed to fetch purchased emails`);
 
        let data = await response.json();
        console.log(`>>>>>data${JSON.stringify(data)}`)

 
        data = data.data;
            const encryptedEmail = Cookies.get("temporaryEmail");
            const ipAddres = Cookies.get("userIp");
            const storedIp = decryptData(ipAddres);

        
            const storedEmail = decryptData(encryptedEmail);
            let isLocalMailFound=false
            for(let res of data){
              if(res.email===storedEmail){
                isLocalMailFound=true
                break
              }
            }
            if(!isLocalMailFound){
              data=[...data,{email:storedEmail,ipaddress:storedIp}]
            }
            console.log(`>>>>>>datafinalll${JSON.stringify(data)}`)
        storePurchasedEmails(data); // Store in localStorage

 
        if (Array.isArray(data) && data.length > 0) {
          setPurchasedEmails(data);
        console.log(`>>>>>>purchasedemail${JSON.stringify(purchasedEmails)}`)

          setSelectedPurchasedEmail(data[0].email);
          onEmailGenerated(data[0].email);
          localStorage.setItem(`goat`, data[0].email);

          // Don't set cookies for logged-in users
        } else {
          // No purchased emails - use normal flow
          const storedEmail = getCookie('temporaryEmail');
          if (storedEmail) {
            const decryptedEmail = decryptData(storedEmail);
            if (decryptedEmail) {
              if (!isEmailExpired(decryptedEmail)) {
                onEmailGenerated(decryptedEmail);
              } else {
                removeCookie('temporaryEmail');
                removeCookie('userIp');
                fetchUserId().then(generateEmail);
              }
            }
          } else {
            fetchUserId().then(generateEmail);
          }
        }
      } catch (error) {
        console.error("Error fetching purchased emails:", error);
        // Fallback to normal flow
        const storedEmail = getCookie('temporaryEmail');
        if (storedEmail) {
          const decryptedEmail = decryptData(storedEmail);
          if (decryptedEmail) {
            if (!isEmailExpired(decryptedEmail)) {
              onEmailGenerated(decryptedEmail);
            } else {
              removeCookie('temporaryEmail');
              removeCookie('userIp');
              fetchUserId().then(generateEmail);
            }
          }
        } else {
          fetchUserId().then(generateEmail);
        }
      }
    };
 
    checkPurchasedEmails();
  }, []);
 
  // [Rest of the component remains exactly the same...]
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

      
      // Set cookies with encrypted data
      setCookie('temporaryEmail', encryptData(email));
      setCookie('userIp', encryptData(id));
      
      // Set expiration date for this email (7 days from now)
      setEmailExpiration(email);
 
      onEmailGenerated(email);
      toast.success(`New email generated: ${email}. It will expire in 7 days.`);
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
    
    // Remove cookies and expiration date
    removeCookie('temporaryEmail');
    removeCookie('userIp');
    localStorage.removeItem(`emailExpiration_${currentEmail}`);
 
    onEmailGenerated('');
    toast.success("Email address deleted!");
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };
 
  const handlePurchasedEmailChange = (email: string) => {
    setSelectedPurchasedEmail(email);
    console.log(`>>>>emailhandle`,email)
    const selectedEmailData = purchasedEmails.find(e => e.email === email);
    if (selectedEmailData) {
    console.log(`>>>>hamhairahi`,selectedEmailData)

      onEmailGenerated(selectedEmailData.email);
      setSelectedEmailData(selectedEmailData);
      localStorage.setItem(`goat`, selectedEmailData.email);


      // For logged-in users, we don't need to set cookies
      // window.location.reload();
    }
  };
 
  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6">
      <div className="glass rounded-2xl mb-6 p-1.5 transition-all hover:shadow-lg hover:scale-[1.02] duration-300">
        <div className="flex flex-wrap sm:flex-nowrap items-center bg-white rounded-xl p-2 gap-2">
          {purchasedEmails.length > 0 ? (
            <Select value={selectedPurchasedEmail} onValueChange={handlePurchasedEmailChange}>
              <SelectTrigger className="flex-1 px-4 py-3 text-sm sm:text-base rounded-xl border border-gray-100 w-full sm:w-auto">
                <SelectValue placeholder="Select your email" />
              </SelectTrigger>
              <SelectContent>
                {purchasedEmails.map((emailData, index) => (
                  <SelectItem key={index} value={emailData.email}>
                    {emailData.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <input
              type="text"
              value={currentEmail}
              readOnly
              placeholder="Your temporary email address"
              className="flex-1 px-4 py-3 text-sm sm:text-base rounded-xl border border-gray-100 w-full sm:w-auto"
            />
          )}
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
        {purchasedEmails.length === 0 && (
          <>
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
          </>
        )}
              {/* {selectedEmailData && (
        <div className="mt-8">
          <EmailList info={selectedEmailData} />
        </div>
      )} */}
        <EmailOrderForm tempEmail={currentEmail} />
        <EmailSettings onExpirationChange={() => {}} />
      </div>
    </div>
  );
};
 