// mail.tm API client with comprehensive comments for easy provider swapping

export interface MailTmAccount {
  id: string;
  address: string;
  quota: number;
  used: number;
  isDisabled: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MailTmMessage {
  id: string;
  accountId: string;
  msgid: string;
  subject: string;
  intro: string;
  from: {
    address: string;
    name: string;
  };
  to: Array<{
    address: string;
    name: string;
  }>;
  cc?: Array<{
    address: string;
    name: string;
  }>;
  bcc?: Array<{
    address: string;
    name: string;
  }>;
  flagged: boolean;
  isDeleted: boolean;
  verifications: string[];
  retention: boolean;
  retentionDate: string;
  text: string;
  html: string[];
  hasAttachments: boolean;
  size: number;
  downloadUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface MailTmDomain {
  id: string;
  domain: string;
  isActive: boolean;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

// Hydra collection response format
interface HydraCollection<T> {
  '@context': string;
  '@id': string;
  '@type': string;
  'hydra:totalItems': number;
  'hydra:member': T[];
}

const BASE_URL = 'https://api.mail.tm';

class MailTmClient {
  private token: string | null = null;

  // ACCOUNT MANAGEMENT
  // Create a new temporary email account
  // Provider swap note: Replace with equivalent account creation endpoint
  async createAccount(password: string = 'temppass123'): Promise<MailTmAccount> {
    try {
      // First, get available domains - Fix: Handle Hydra collection format
      const domainsResponse = await fetch(`${BASE_URL}/domains`);
      if (!domainsResponse.ok) {
        throw new Error('Failed to fetch domains');
      }
      
      const domainsData: HydraCollection<MailTmDomain> = await domainsResponse.json();
      const domains = domainsData['hydra:member'] || [];
      const activeDomain = domains.find(d => d.isActive);
      
      if (!activeDomain) {
        throw new Error('No active domains available');
      }

      // Generate random username for the email
      const username = `temp${Date.now()}${Math.random().toString(36).substring(2, 8)}`;
      const address = `${username}@${activeDomain.domain}`;

      console.log('Creating mail.tm account with address:', address);
      
      const response = await fetch(`${BASE_URL}/accounts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address,
          password,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create account: ${errorText}`);
      }

      const account: MailTmAccount = await response.json();
      console.log('Successfully created mail.tm account:', account.address);
      return account;
    } catch (error) {
      console.error('Error creating mail.tm account:', error);
      throw error;
    }
  }

  // Authenticate and get bearer token for API requests
  // Provider swap note: Replace with authentication flow for new provider
  async authenticate(address: string, password: string = 'temppass123'): Promise<string> {
    try {
      console.log('Authenticating with mail.tm for address:', address);
      
      const response = await fetch(`${BASE_URL}/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address,
          password,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Authentication failed: ${errorText}`);
      }

      const data = await response.json();
      this.token = data.token;
      console.log('Successfully authenticated with mail.tm');
      return data.token;
    } catch (error) {
      console.error('Error authenticating with mail.tm:', error);
      throw error;
    }
  }

  // Delete the temporary account
  // Provider swap note: Replace with account deletion endpoint for new provider
  async deleteAccount(accountId: string): Promise<void> {
    try {
      if (!this.token) {
        throw new Error('Not authenticated');
      }

      console.log('Deleting mail.tm account:', accountId);
      
      const response = await fetch(`${BASE_URL}/accounts/${accountId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete account: ${errorText}`);
      }

      console.log('Successfully deleted mail.tm account');
    } catch (error) {
      console.error('Error deleting mail.tm account:', error);
      throw error;
    }
  }

  // INBOX MANAGEMENT
  // Fetch all messages in the inbox - Fix: Handle Hydra collection format
  // Provider swap note: Replace with inbox/messages endpoint for new provider
  async getMessages(): Promise<MailTmMessage[]> {
    try {
      if (!this.token) {
        throw new Error('Not authenticated');
      }

      console.log('Fetching messages from mail.tm inbox');
      
      const response = await fetch(`${BASE_URL}/messages`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired, need to re-authenticate
          throw new Error('Authentication token expired');
        }
        const errorText = await response.text();
        throw new Error(`Failed to fetch messages: ${errorText}`);
      }

      const data: HydraCollection<MailTmMessage> = await response.json();
      const messages = data['hydra:member'] || [];
      console.log(`Successfully fetched ${messages.length} messages from mail.tm`);
      return messages;
    } catch (error) {
      console.error('Error fetching messages from mail.tm:', error);
      throw error;
    }
  }

  // Get full message content including HTML body
  // Provider swap note: Replace with message detail endpoint for new provider
  async getMessage(messageId: string): Promise<MailTmMessage> {
    try {
      if (!this.token) {
        throw new Error('Not authenticated');
      }

      console.log('Fetching message details from mail.tm:', messageId);
      
      const response = await fetch(`${BASE_URL}/messages/${messageId}`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication token expired');
        }
        const errorText = await response.text();
        throw new Error(`Failed to fetch message: ${errorText}`);
      }

      const message: MailTmMessage = await response.json();
      console.log('Successfully fetched message details from mail.tm');
      return message;
    } catch (error) {
      console.error('Error fetching message from mail.tm:', error);
      throw error;
    }
  }

  // Utility method to check if authenticated
  isAuthenticated(): boolean {
    return !!this.token;
  }

  // Clear authentication token
  clearAuth(): void {
    this.token = null;
  }

  // Set token manually (for reuse)
  setToken(token: string): void {
    this.token = token;
  }
}

// Export singleton instance
export const mailClient = new MailTmClient();
