import { useEffect, useState } from "react";
import { Eye, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { decryptData } from "../encryption";
import { useTranslation } from "react-i18next";
import { EmailView } from "../EmailView";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Attachment {
  filename: string;
  content: string;
  contentType: string;
  size: number;
}


type EmailListProps = {
  currentEmail: string;
};





interface Email {
  id: string;
  generated_email: string;
  ipaddress: string;
  sender_email: string;
  date: string;
  subject: string;
  sender_name: string;
  body: string;
  status: number;
  created_at: string;
  updated_at: string;
  attachments?: string | Attachment[];
  seen?: boolean;
}

const getCookie = (name: string) => {
  return document.cookie
    .split('; ')
    .find(row => row.startsWith(name + "="))
    ?.split('=')[1] || null;
};

export const EmailList = ({ currentEmail }: EmailListProps) => {
  console.log(`>>>>>emailsDatahhhbbbbbb`,currentEmail)

  const { t } = useTranslation();
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [showSplash, setShowSplash] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [propdata, setPropData] = useState(null);
  console.log(`>>>>>emailshhhhhhhhhhhhh`,emails)


  useEffect(() => {
  setPropData(currentEmail)


    const fetchEmails = async () => {
    console.log(`>>>>>emailsDatahhh`,currentEmail)

      setError(null);
      setIsRefreshing(true);
      console.log(`>>>>>>selectedEmailhamamam`,selectedEmail)
      console.log(`>>>>>>emailskonkon`,emails)

      
      const authToken = localStorage.getItem('authToken');
      let temporaryEmail="";
      let ipaddress=""

        console.log(`>>>>>elelel`)

        if (authToken) {
          console.log(`>>>>>>auth`)
          const purchasedEmails = JSON.parse(localStorage.getItem('purchasedEmails') || '[]');
          console.log(`>>>>>>purchasedEmails`,purchasedEmails)
          
          if (purchasedEmails.length > 0) {
            console.log(`>>>>>>>>ravi`)
            const mailCurrent=localStorage.getItem('goat')
            for(let res of purchasedEmails){
              if(res.email===mailCurrent){
                temporaryEmail = res.email;
                ipaddress = res.ipaddress;
                break
              }
            }


          }
        } else {
          const encryptedEmail = getCookie('temporaryEmail');
          const storedIp = getCookie('userIp');
          
          if (!encryptedEmail || !storedIp) {
            setLoading(false);
            setIsRefreshing(false);
            return;
          }
          
          temporaryEmail = decryptData(encryptedEmail);
          ipaddress = decryptData(storedIp);
        }
  
        if (!temporaryEmail || !ipaddress) {
          console.log(`>>>>>akakaka`)
          setLoading(false);
          setIsRefreshing(false);
          return;
        }
        console.log(`>>>>>mmmmmmmmmmm`)




      try {
        console.log(`>>>>>>ipaddresslist`,ipaddress)
        console.log(`>>>>>>temporaryEmaillist`,temporaryEmail)


        const response = await fetch(
          `${API_BASE_URL}/users/userMails?ipadress=${ipaddress}&temporaryEmail=${temporaryEmail}`
        );

        if (!response.ok) throw new Error(`API Error: ${response.status}`);

        const result = await response.json();
        console.log(`>>>>>resultlist${JSON.stringify(result)}`)
        
        if (result?.status && Array.isArray(result?.data)) {
          setEmails(result.data);
        } else {
          throw new Error("Invalid data structure received.");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred.");
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    };

    fetchEmails();

    const interval = setInterval(() => {
      setShowSplash(true);
      fetchEmails();
      setTimeout(() => setShowSplash(false), 1000);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const onViewEmail = (email: Email) => {
    if (isRefreshing) return; // Don't open email view during refresh
    
    let parsedAttachments: Attachment[] = [];
    try {
      if (email.attachments && typeof email.attachments === "string") {
        if (email.attachments.trim().startsWith("{") && email.attachments.trim().endsWith("}")) {
          parsedAttachments = [JSON.parse(email.attachments)];
        }
      } else if (Array.isArray(email.attachments)) {
        parsedAttachments = email.attachments;
      }
    } catch (error) {
      console.error("Error processing attachments:", error);
    }

    setSelectedEmail({
      ...email,
      attachments: parsedAttachments,
    });
  };

  const closeEmailView = () => {
    setSelectedEmail(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-full max-w-md mx-auto">
          <div className="h-2 bg-blue-500 animate-pulse rounded-full"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Blue swipe loading animation */}
      <div className={cn(
        "absolute top-0 left-0 w-full h-1 bg-blue-500 transition-all duration-500",
        showSplash ? "opacity-100" : "opacity-0"
      )}></div>

      <Table>
        <TableHeader>
          <TableRow className="hover:bg-gray-50/50">
            <TableHead className="w-[200px]">{t("From")}</TableHead>
            <TableHead>{t("Subject")}</TableHead>
            <TableHead className="text-right w-[120px]">{t("Date")}</TableHead>
            <TableHead className="w-[80px]">{t("Actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {emails.map((email, index) => (
            <TableRow
              key={email.id}
              className={cn(
                "hover:bg-accent/30 transition-colors cursor-pointer",
                !email.seen && "font-medium"
              )}
              onClick={() => onViewEmail(email)}
            >
              <TableCell className="font-medium">
                {email.sender_name || "Unknown Sender"}
              </TableCell>
              <TableCell>{email.subject || "No Subject"}</TableCell>
              <TableCell className="text-right text-gray-500">
                {email.date
                  ? new Date(email.date).toLocaleString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: false,
                      timeZone: "UTC",
                    }).replace(",", "")
                  : "Unknown Date"}
              </TableCell>
              <TableCell>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewEmail(email);
                  }}
                  className="p-2 text-gray-600 hover:text-primary transition-all rounded-full hover:bg-white/80 transform hover:scale-110"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedEmail && (
        <EmailView email={selectedEmail} onClose={closeEmailView} />
      )}
    </div>
  );
};