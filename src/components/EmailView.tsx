import { useState, useEffect, useRef } from 'react';
import { X, Reply, Forward, Trash2, Download } from 'lucide-react';
import { toast } from 'sonner';

interface Attachment {
  filename: string;
  content: string; // Base64 encoded content
  contentType: string;
  size: number;
}

interface EmailViewProps {
  email: {
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
    attachments: Attachment[];
    seen?: boolean;
  } | null;
  onClose: () => void;
}

export const EmailView = ({ email, onClose }: EmailViewProps) => {
  const [loading, setLoading] = useState(false);
  const [processedBody, setProcessedBody] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (email?.body) {
      // Process the email body to add target="_blank" to all links
      const parser = new DOMParser();
      const doc = parser.parseFromString(email.body, 'text/html');
      const links = doc.querySelectorAll('a');
      
      links.forEach(link => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      });
      
      setProcessedBody(doc.body.innerHTML);
    }
  }, [email?.body]);

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  if (!email) return null;

  const handleReply = () => {
    toast.info("Reply feature coming soon!");
  };

  const handleForward = () => {
    toast.info("Forward feature coming soon!");
  };

  const handleDownload = () => {
    try {
      const emailContent = `
From: ${email.sender_name} <${email.sender_email}>
Subject: ${email.subject}
Date: ${new Date(email.date).toLocaleString()}

${email.body || "No content available"}
      `.trim();

      const blob = new Blob([emailContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${email.subject.replace(/[^a-z0-9]/gi, '_')}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success('Email downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download email');
    }
  };

  const handleDelete = () => {
    console.log(`>>>>>asaaaaa`);
    toast.info("Delete feature coming soon!");
  };

  const handleDownloadAttachment = (attachment: Attachment) => {
    try {
      const byteCharacters = atob(attachment.content);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: attachment.contentType });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = attachment.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success(`Downloaded ${attachment.filename}`);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download attachment');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in p-2 sm:p-4">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-xl mx-4 animate-scale-in flex flex-col"
      >
        {/* Header */}
        <div className="border-b p-3 sm:p-4 flex items-center justify-between bg-gradient-to-r from-primary/10 to-purple-500/10">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 truncate">
            {email.subject}
          </h2>
          <button 
            onClick={onClose}
            className="p-1 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={18} className="sm:size-5" />
          </button>
        </div>

        {/* Email Details */}
        <div className="p-3 sm:p-4 border-b bg-gray-50">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-medium text-sm sm:text-base">
                {email.sender_name?.[0] || email.sender_email[0]}
              </span>
            </div>
            <div className="min-w-0">
              <p className="font-medium text-gray-800 text-sm sm:text-base truncate">
                {email.sender_name || email.sender_email}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 truncate">
                {email.sender_email}
              </p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-gray-500">
            {new Date(email.date).toLocaleString()}
          </p>
        </div>

        {/* Email Content */}
        <div className="p-4 overflow-auto flex-1 max-h-[50vh]">
          <div
            dangerouslySetInnerHTML={{ __html: processedBody || email.body }}
            className="prose prose-sm max-w-none text-sm sm:text-base"
          />
        </div>

        {/* Attachments */}
        {email.attachments && email.attachments.length > 0 && (
          <div className="p-3 sm:p-4 border-t bg-gray-50">
            <h3 className="text-xs sm:text-sm font-semibold mb-2">Attachments</h3>
            <ul className="space-y-1 sm:space-y-2">
              {email.attachments.map((attachment, index) => (
                <li key={index} className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-gray-700 truncate max-w-[60%]">
                    {attachment.filename}
                  </span>
                  <button
                    onClick={() => handleDownloadAttachment(attachment)}
                    className="text-xs sm:text-sm text-blue-500 hover:text-blue-700"
                  >
                    Download
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="border-t p-2 sm:p-4 bg-gray-50 flex flex-wrap justify-center gap-1 sm:gap-2">
          <button
            onClick={handleReply}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Reply size={14} className="sm:size-4" /> 
            <span className="hidden sm:inline">Reply</span>
          </button>
          <button
            onClick={handleForward}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Forward size={14} className="sm:size-4" /> 
            <span className="hidden sm:inline">Forward</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Download size={14} className="sm:size-4" /> 
            <span className="hidden sm:inline">Download Email</span>
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm text-red-600 hover:bg-red-50 rounded-full transition-colors"
          >
            <Trash2 size={14} className="sm:size-4" /> 
            <span className="hidden sm:inline">Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};