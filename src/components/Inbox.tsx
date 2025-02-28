import { useState, useEffect } from "react";
import { toast } from "sonner";
import { emailService } from "@/services/emailService";
import { EmailView } from "./EmailView";
import { InboxHeader } from "./inbox/InboxHeader";
import { EmailList } from "./inbox/EmailList";
import { encryptData, decryptData } from "./encryption";
import Cookies from "js-cookie";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;



interface Email {
  id: string;
  from: {
    address: string;
    name: string;
  };
  subject: string;
  text?: string;
  html?: string;
  seen: boolean;
  createdAt: string;
}

interface InboxProps {
  currentEmail: string;
}

export const Inbox: React.FC<InboxProps> = ({ currentEmail }) => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (currentEmail) {
      refreshInbox();
    }
  }, [currentEmail]);

  useEffect(() => {
    if (currentEmail) {
      const refreshInterval = setInterval(refreshInbox, 10000);
      return () => clearInterval(refreshInterval);
    }
  }, [currentEmail]);

  const refreshInbox = async () => {
    if (!currentEmail || loading) return;
    setLoading(true);
    setIsRefreshing(true);
    try {
      const messages = await emailService.getMessages(currentEmail);
      setEmails(messages);
      if (messages.length > 0) {
        toast.success(`Inbox refreshed: ${messages.length} messages found`);
      }
    } catch (error) {
      console.error("Error refreshing inbox:", error);
      setEmails([]);
    } finally {
      setLoading(false);
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  };

  const deleteAllEmails = async () => {
    console.log(`>>>> Attempting to delete emails...`);
    const encryptedEmail = Cookies.get("temporaryEmail");
    if (!encryptedEmail) {
      toast.error("No temporary email found!");
      return;
    }

    const storedEmail = decryptData(encryptedEmail);

    try {
      const response = await fetch(
        `${API_BASE_URL}/users/delete_mails`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ mail: storedEmail }),
        }
      );

      const result = await response.json();
      console.log("Delete API Response:", response.status, result);

      if (response.ok) {
        toast.success("All emails deleted!");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error(result.message || `Failed to delete emails (Status: ${response.status})`);
      }
    } catch (error) {
      console.error("Error deleting emails:", error);
      toast.error(`Error: ${error.message || "An error occurred while deleting emails."}`);
    }
  };

  const handleViewEmail = (email: Email) => {
    setSelectedEmail(email);
  };

  const filteredEmails = emails.filter(
    (email) =>
      email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.from.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (email.from.name && email.from.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-4xl mx-auto mt-12 transform transition-all duration-500 hover:translate-y-[-2px]">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
        <InboxHeader
          currentEmail={currentEmail}
          loading={loading}
          isRefreshing={isRefreshing}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          refreshInbox={refreshInbox}
          deleteAllEmails={deleteAllEmails}
        />

        <div className="min-h-[400px] bg-gradient-to-b from-white to-gray-50/30">
          <EmailList emails={filteredEmails} onViewEmail={handleViewEmail} />
        </div>
      </div>

      {selectedEmail && <EmailView email={selectedEmail} onClose={() => setSelectedEmail(null)} />}
    </div>
  );
};
