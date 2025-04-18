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
import { decryptData } from "../encryption"; // Import decryption
import { useTranslation } from "react-i18next";
import { EmailView } from "../EmailView"; // Import EmailView component

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Attachment {
  filename: string;
  content: string; // Base64 encoded content
  contentType: string;
  size: number;
}

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
  attachments?: string | Attachment[]; // Can be a string or an array
  seen?: boolean; // Add the `seen` property if it exists in your data
}

export const EmailList = () => {
  const { t } = useTranslation();
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    const fetchEmails = async () => {
      console.log(`>>>>>sacveee`);
      setError(null);
      const getCookie = (name: string) => {
        return (
          document.cookie
            .split("; ")
            .find((row) => row.startsWith(name + "="))
            ?.split("=")[1] || null
        );
      };

      const storedIp = getCookie("userIp");
      console.log(`>>>>storedIp`, storedIp);

      const encryptedEmail = getCookie("temporaryEmail");
      if (!encryptedEmail) {
        // toast.error("No temporary email found!");
        return;
      }

      if (!storedIp || !encryptedEmail) {
        setLoading(false);
        return;
      }

      const temporaryEmail = decryptData(encryptedEmail); // Decrypt email before using
      const ipaddress = decryptData(storedIp); // Decrypt email before using

      try {
        const response = await fetch(
          `${API_BASE_URL}/users/userMails?ipadress=${ipaddress}&temporaryEmail=${temporaryEmail}`
        );

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const result = await response.json();
        console.log(`>>>> API Result: ${JSON.stringify(result)}`);

        if (result?.status && Array.isArray(result?.data)) {
          setEmails((prevEmails) => {
            const newEmails = result.data.filter(
              (newEmail: Email) =>
                !prevEmails.some((email) => email.id === newEmail.id)
            );
            return [...prevEmails, ...newEmails];
          });
        } else {
          throw new Error("Invalid data structure received.");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEmails(); // Initial fetch

    const interval = setInterval(() => {
      setShowSplash(true);
      setTimeout(() => setShowSplash(false), 1200);
      fetchEmails();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const onViewEmail = (email: Email) => {
    let parsedAttachments: Attachment[] = [];
  
    try {
      // Parse attachments if they are in string format
      if (email.attachments && typeof email.attachments === "string") {
        try {
          parsedAttachments = JSON.parse(email.attachments);
          // Ensure we have an array and add empty content if missing
          parsedAttachments = Array.isArray(parsedAttachments) 
            ? parsedAttachments.map(att => ({
                ...att,
                content: att.content || "" // Add empty content if missing
              }))
            : [];
        } catch (error) {
          console.error("Failed to parse attachments:", error);
        }
      } else if (Array.isArray(email.attachments)) {
        // Use as-is if already an array
        parsedAttachments = email.attachments.map(att => ({
          ...att,
          content: att.content || "" // Add empty content if missing
        }));
      }
    } catch (error) {
      console.error("Error processing attachments:", error);
    }
  
    setSelectedEmail({
      ...email,
      attachments: parsedAttachments
    });
  };

  const closeEmailView = () => {
    setSelectedEmail(null);
  };

  if (loading) {
    return <p className="text-center py-4">Loading emails...</p>;
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
      <div
        className={cn(
          "absolute top-0 left-0 w-0 h-2 bg-blue-500 transition-all duration-1000",
          showSplash && "w-full"
        )}
      />

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
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => onViewEmail(email)}
            >
              <TableCell className="font-medium">
                {email.sender_name || "Unknown Sender"}
              </TableCell>
              <TableCell>{email.subject || "No Subject"}</TableCell>
              <TableCell className="text-right text-gray-500">
                {email.date
                  ? new Date(email.date).toLocaleString()
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