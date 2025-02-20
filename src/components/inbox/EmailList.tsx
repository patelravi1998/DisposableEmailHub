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

interface Email {
  id: string;
  from: { address: string; name?: string };
  subject: string;
  text?: string;
  body?: string;
  seen: boolean;
  date: string;
  sender_name: string;
}

export const EmailList = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    const fetchEmails = async () => {
      console.log(`>>>>>sacveee`)
      setError(null);
      const getCookie = (name: string) => {
        return document.cookie
          .split('; ')
          .find(row => row.startsWith(name + "="))
          ?.split('=')[1] || null;
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
          `https://email-geneartor-production.up.railway.app/api/users/userMails?ipadress=${ipaddress}&temporaryEmail=${temporaryEmail}`
        );

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const result = await response.json();
        console.log(`>>>> API Result: ${JSON.stringify(result)}`);

        if (result?.status && Array.isArray(result?.data)) {
          setEmails((prevEmails) => {
            const newEmails = result.data.filter(
              (newEmail: Email) => !prevEmails.some((email) => email.id === newEmail.id)
            );
            return [...prevEmails, ...newEmails];
          });
        } else {
          throw new Error("Invalid data structure received.");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred.");
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
    setSelectedEmail(email);
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
            <TableHead className="w-[200px]">From</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead className="text-right w-[120px]">Date</TableHead>
            <TableHead className="w-[80px]">Actions</TableHead>
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
                  ? new Date(email.date)
                      .toLocaleString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: false,
                        timeZone: "UTC",
                      })
                      .replace(",", "")
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-[600px] max-w-full p-6 relative">
            <button
              onClick={closeEmailView}
              className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-semibold mb-2">{selectedEmail.subject || "No Subject"}</h2>
            <p className="text-sm text-gray-500 mb-4">
              From: {selectedEmail.sender_name || "Unknown Sender"}
            </p>

            <div className="border-t pt-4">
              {selectedEmail.body ? (
                <div
                  className="max-h-80 overflow-auto p-2 border rounded bg-gray-100"
                  dangerouslySetInnerHTML={{
                    __html: selectedEmail.body.replace(
                      /<a /g,
                      '<a target="_blank" rel="noopener noreferrer" '
                    ),
                  }}
                />
              ) : (
                <p className="text-gray-700 whitespace-pre-line">
                  {selectedEmail.text || "No content available"}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
