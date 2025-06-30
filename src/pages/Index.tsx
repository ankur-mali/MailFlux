import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { mailClient, MailTmAccount, MailTmMessage } from "@/lib/api";
import { EmailHeader } from "@/components/EmailHeader";
import { MessageList } from "@/components/MessageList";
import { MessageView } from "@/components/MessageView";
import { PremiumSheet } from "@/components/PremiumSheet";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Sparkles, LogIn } from "lucide-react";
import { Footer } from "@/components/Footer";

const Index = () => {
  const [account, setAccount] = useState<MailTmAccount | null>(null);
  const [messages, setMessages] = useState<MailTmMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<MailTmMessage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes in seconds
  const { toast } = useToast();

  // Initialize account on page load
  const initializeAccount = useCallback(async () => {
    try {
      setIsInitializing(true);
      console.log('Initializing new temporary email account...');
      
      const newAccount = await mailClient.createAccount();
      const token = await mailClient.authenticate(newAccount.address);
      
      setAccount(newAccount);
      setTimeRemaining(600); // Reset timer to 10 minutes
      console.log('Account initialized successfully:', newAccount.address);
      
      toast({
        title: "Account Ready!",
        description: `Your temporary email ${newAccount.address} is ready to use.`,
      });
    } catch (error) {
      console.error('Failed to initialize account:', error);
      toast({
        title: "Setup Failed",
        description: "Could not create temporary email account. Please refresh the page.",
        variant: "destructive",
      });
    } finally {
      setIsInitializing(false);
    }
  }, [toast]);

  // Fetch messages from inbox
  const fetchMessages = useCallback(async () => {
    if (!account || !mailClient.isAuthenticated()) return;
    
    try {
      setIsLoading(true);
      console.log('Fetching inbox messages...');
      
      const fetchedMessages = await mailClient.getMessages();
      setMessages(fetchedMessages);
      console.log(`Fetched ${fetchedMessages.length} messages`);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      
      // If token expired, try to re-authenticate
      if (error instanceof Error && error.message.includes('token expired')) {
        try {
          await mailClient.authenticate(account.address);
          const fetchedMessages = await mailClient.getMessages();
          setMessages(fetchedMessages);
        } catch (reAuthError) {
          toast({
            title: "Connection Error",
            description: "Failed to refresh inbox. Please reload the page.",
            variant: "destructive",
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [account, toast]);

  // Select and load full message content
  const handleMessageSelect = async (message: MailTmMessage) => {
    try {
      console.log('Loading full message content...');
      const fullMessage = await mailClient.getMessage(message.id);
      setSelectedMessage(fullMessage);
    } catch (error) {
      console.error('Failed to load message:', error);
      toast({
        title: "Error",
        description: "Could not load message content.",
        variant: "destructive",
      });
    }
  };

  // Delete account and create new one
  const handleNewEmail = async () => {
    if (!account) return;
    
    try {
      console.log('Creating new email account...');
      await mailClient.deleteAccount(account.id);
      
      // Reset state
      setMessages([]);
      setSelectedMessage(null);
      mailClient.clearAuth();
      
      // Initialize new account
      await initializeAccount();
    } catch (error) {
      console.error('Failed to create new email:', error);
      toast({
        title: "Error",
        description: "Could not create new email. Please refresh the page.",
        variant: "destructive",
      });
    }
  };

  // Initialize account on component mount
  useEffect(() => {
    initializeAccount();
  }, [initializeAccount]);

  // Set up polling for new messages
  useEffect(() => {
    if (!account) return;

    // Initial fetch
    fetchMessages();

    // Poll every 12 seconds for new messages
    const interval = setInterval(fetchMessages, 12000);
    return () => clearInterval(interval);
  }, [account, fetchMessages]);

  // Timer countdown for email expiration
  useEffect(() => {
    if (!account || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Time's up, create new email
          handleNewEmail();
          return 600;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [account, timeRemaining]);

  // Cleanup on page unload
  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (account && mailClient.isAuthenticated()) {
        try {
          await mailClient.deleteAccount(account.id);
        } catch (error) {
          console.error('Failed to cleanup account on page unload:', error);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [account]);

  // Format timer display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md macbook-shadow bg-card/50 backdrop-blur-xl">
          <div className="pulse-slow h-12 w-12 border-4 border-primary/30 border-t-primary rounded-full mx-auto mb-6"></div>
          <h2 className="text-xl font-semibold mb-2">Setting up your inbox</h2>
          <p className="text-muted-foreground">Creating your temporary email address...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Modern Header */}
      <header className="sticky top-0 z-50 glass-effect border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent">
                Mailflux
              </div>
              <div className="hidden sm:block text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                Temporary Email Service
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                {formatTime(timeRemaining)}
              </div>
              <ThemeToggle />
              <PremiumSheet />
              <Button variant="ghost" className="hover-lift gap-2">
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Login</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Email Address Section */}
          {account && (
            <EmailHeader
              address={account.address}
              isLoading={isLoading}
              onRefresh={fetchMessages}
              onNewEmail={handleNewEmail}
              timeRemaining={timeRemaining}
            />
          )}

          {/* Inbox Section */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Message List */}
            <div className="lg:col-span-2">
              <Card className="macbook-shadow bg-card/50 backdrop-blur-xl border border-border/50 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-foreground">
                    Inbox
                  </h3>
                  <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                    {messages.length}
                  </div>
                </div>
                <MessageList
                  messages={messages}
                  selectedMessage={selectedMessage}
                  onMessageSelect={handleMessageSelect}
                  isLoading={isLoading}
                />
              </Card>
            </div>

            {/* Message View */}
            <div className="lg:col-span-3">
              <MessageView
                message={selectedMessage}
                onDeleteAccount={handleNewEmail}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
