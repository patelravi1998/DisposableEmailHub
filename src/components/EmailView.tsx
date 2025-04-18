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
    attachments: string | Attachment[];
    seen?: boolean;
  } | null;
  onClose: () => void;
}

export const EmailView = ({ email, onClose }: EmailViewProps) => {
  const [loading, setLoading] = useState(false);
  const [processedBody, setProcessedBody] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  // Parse and validate attachments
  const getAttachments = (): Attachment[] => {
    if (!email?.attachments) return [];
    
    try {
      // Handle both string and array cases
      const parsed = typeof email.attachments === 'string' 
        ? JSON.parse(email.attachments)
        : email.attachments;
  
      // Ensure we have an array
      const attachmentsArray = Array.isArray(parsed) ? parsed : [parsed];
      
      // Validate and normalize attachments
      return attachmentsArray
        .filter(att => att && typeof att === 'object')
        .map(att => ({
          filename: att.filename || 'unnamed-file',
          content: att.content || '',
          contentType: att.contentType || 'application/octet-stream',
          size: att.size || 0
        }));
    } catch (error) {
      console.error('Failed to parse attachments:', error);
      return [];
    }
  };

  const attachments = getAttachments();

  useEffect(() => {
    if (email?.body) {
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
Date: ${new Date(email.date).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}

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
    toast.info("Delete feature coming soon!");
  };

  const handleDownloadAttachment = (attachment: Attachment) => {
    try {
      if (!attachment.content) {
        throw new Error('No content available');
      }

      // Verify base64
      if (!/^[A-Za-z0-9+/=]+$/.test(attachment.content)) {
        throw new Error('Invalid file content');
      }

      // Decode properly
      const binaryString = atob(attachment.content);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const blob = new Blob([bytes], { type: attachment.contentType });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = attachment.filename || 'download';
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);

      toast.success(`Downloaded ${attachment.filename}`);
    } catch (error) {
      console.error('Download error:', error);
      toast.error(`Failed to download: ${error.message}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-0 sm:p-4">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg w-full h-full sm:max-w-4xl sm:max-h-[90vh] sm:h-auto overflow-hidden shadow-xl mx-0 sm:mx-4 flex flex-col"
      >
        {/* Header */}
        <div className="border-b p-2 sm:p-4 flex items-center justify-between bg-gradient-to-r from-primary/10 to-purple-500/10 sticky top-0 z-10">
          <div className="flex-1 min-w-0">
            <h2 className="text-sm sm:text-xl font-semibold text-gray-800 truncate">
              {email.subject}
            </h2>
            <p className="text-xs text-gray-500 truncate sm:hidden">
              {email.sender_name || email.sender_email}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1 ml-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Email Details */}
        <div className="p-2 sm:p-4 border-b bg-gray-50">
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-medium text-sm sm:text-base">
                {email.sender_name?.[0] || email.sender_email[0]}
              </span>
            </div>
            <div className="min-w-0">
              <p className="font-medium text-gray-800 text-sm sm:text-base">
                {email.sender_name || email.sender_email}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 break-all">
                {email.sender_email}
              </p>
              <p className="text-xs text-gray-500 mt-1 sm:mt-0">
                {new Date(email.date).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Email Content */}
        <div className="p-3 sm:p-4 overflow-auto flex-1">
          <div
            dangerouslySetInnerHTML={{ __html: processedBody || email.body }}
            className="prose prose-sm max-w-none text-sm sm:text-base break-words"
          />
        </div>

        {/* Attachments */}
        {attachments.length > 0 && (
          <div className="p-2 sm:p-4 border-t bg-gray-50">
            <h3 className="text-xs sm:text-sm font-semibold mb-2">Attachments</h3>
            <ul className="space-y-2">
              {attachments.map((attachment, index) => (
                <li key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded">
                  <div className="flex items-center gap-2 min-w-0">
                    <Download size={16} className="text-gray-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-gray-700 truncate">
                        {attachment.filename}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {Math.round(attachment.size / 1024)} KB • {attachment.contentType.split('/')[1] || attachment.contentType}
                      </p>
                    </div>
                  </div>
                  {attachment.content ? (
                    <button
                      onClick={() => handleDownloadAttachment(attachment)}
                      className="text-xs sm:text-sm text-blue-500 hover:text-blue-700 px-2 py-1"
                      disabled={!attachment.content}
                    >
                      <span className="hidden sm:inline">Download</span>
                      <span className="sm:hidden">Get</span>
                    </button>
                  ) : (
                    <span className="text-xs text-gray-400 px-2">Unavailable</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="border-t p-2 bg-gray-50 flex justify-around sm:justify-center gap-1 sm:gap-2 sticky bottom-0 z-10">
          <button
            onClick={handleReply}
            className="flex flex-col items-center justify-center p-2 text-xs text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Reply"
          >
            <Reply size={16} />
            <span>Reply</span>
          </button>
          <button
            onClick={handleForward}
            className="flex flex-col items-center justify-center p-2 text-xs text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Forward"
          >
            <Forward size={16} />
            <span>Forward</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex flex-col items-center justify-center p-2 text-xs text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Download"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Download</span>
            <span className="sm:hidden">Save</span>
          </button>
          <button
            onClick={handleDelete}
            className="flex flex-col items-center justify-center p-2 text-xs text-red-600 hover:bg-red-50 rounded-full transition-colors"
            aria-label="Delete"
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};