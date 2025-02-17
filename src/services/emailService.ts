const API_URL = "https://api.mail.gw";
const TOKEN_URL = `${API_URL}/token`;

interface EmailResponse {
  id: string;
  address: string;
}

interface Domain {
  id: string;
  domain: string;
}

interface MessageResponse {
  'hydra:member': Message[];
  'hydra:totalItems': number;
}

interface Message {
  id: string;
  accountId: string;
  from: {
    name: string;
    address: string;
  };
  to: Array<{
    name: string;
    address: string;
  }>;
  subject: string;
  intro?: string;
  seen: boolean;
  createdAt: string;
  updatedAt: string;
  summary?: string;
}

interface MessageDetail extends Message {
  text?: string;
  html?: string[];
  attachments?: Array<{
    id: string;
    filename: string;
    contentType: string;
    size: number;
    downloadUrl: string;
  }>;
}

// Store credentials and expiration temporarily in memory
let currentEmail = "";
let currentPassword = "";
let expirationTime: number | null = null;
let expirationTimer: NodeJS.Timeout | null = null;

export const emailService = {
  setExpiration(minutes: number) {
    expirationTime = Date.now() + minutes * 60 * 1000;
    
    // Clear existing timer if any
    if (expirationTimer) {
      clearTimeout(expirationTimer);
    }
    
    // Set new timer
    expirationTimer = setTimeout(() => {
      this.deleteAccount();
    }, minutes * 60 * 1000);
  },

  async deleteAccount() {
    if (currentEmail) {
      // Clear stored credentials
      currentEmail = "";
      currentPassword = "";
      expirationTime = null;
      
      // Dispatch event to notify UI
      const event = new CustomEvent('emailDeleted');
      window.dispatchEvent(event);
    }
  },

  async generateEmail(): Promise<string> {
    try {
      const domainsResponse = await fetch(`${API_URL}/domains`);
      if (!domainsResponse.ok) {
        throw new Error('Failed to fetch domains');
      }
      const domainsData = await domainsResponse.json();
      const domains: Domain[] = domainsData['hydra:member'];
      const randomDomain = domains[Math.floor(Math.random() * domains.length)];
      
      const username = Math.random().toString(36).substring(2, 12);
      currentPassword = Math.random().toString(36).substring(2, 12);
      currentEmail = `${username}@${randomDomain.domain}`;
      
      const createResponse = await fetch(`${API_URL}/accounts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: currentEmail,
          password: currentPassword,
        }),
      });

      if (!createResponse.ok) {
        throw new Error('Failed to create email account');
      }
      
      const emailData: EmailResponse = await createResponse.json();
      
      // Set default expiration to 1 hour if not set
      if (!expirationTime) {
        this.setExpiration(60);
      }
      
      return emailData.address;
    } catch (error) {
      console.error('Error generating email:', error);
      throw error;
    }
  },

  async getToken(): Promise<string> {
    try {
      const authResponse = await fetch(TOKEN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: currentEmail,
          password: currentPassword,
        }),
      });

      if (!authResponse.ok) {
        console.error('Auth response status:', authResponse.status);
        const errorText = await authResponse.text();
        console.error('Auth response error:', errorText);
        throw new Error('Authentication failed');
      }

      const { token } = await authResponse.json();
      return token;
    } catch (error) {
      console.error('Error getting token:', error);
      throw error;
    }
  },

  async getMessages(email: string): Promise<Message[]> {
    try {
      const token = await this.getToken();
      
      const messagesResponse = await fetch(`${API_URL}/messages?page=1`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!messagesResponse.ok) {
        throw new Error('Failed to fetch messages');
      }

      const messagesData: MessageResponse = await messagesResponse.json();
      
      // Fetch detailed content and generate summaries for each message
      const detailedMessages = await Promise.all(
        messagesData['hydra:member'].map(async (message) => {
          try {
            const detailResponse = await fetch(`${API_URL}/messages/${message.id}`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });
            
            if (detailResponse.ok) {
              const detailData: MessageDetail = await detailResponse.json();
              
              // Generate AI summary of the email content
              const summary = await this.generateEmailSummary(detailData.text || detailData.html?.[0] || '');
              
              return {
                ...message,
                text: detailData.text,
                html: detailData.html?.[0],
                summary,
              };
            }
          } catch (error) {
            console.error(`Error fetching message detail for ${message.id}:`, error);
          }
          return message;
        })
      );

      return detailedMessages;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },

  async generateEmailSummary(content: string): Promise<string> {
    try {
      // Use a simple extractive summarization for now
      const sentences = content
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .split(/[.!?]+/)
        .filter(sentence => sentence.trim().length > 0)
        .slice(0, 2) // Take first two sentences
        .join('. ');
      
      return sentences.length > 0 ? `${sentences}.` : 'No summary available.';
    } catch (error) {
      console.error('Error generating summary:', error);
      return 'Error generating summary.';
    }
  },
};