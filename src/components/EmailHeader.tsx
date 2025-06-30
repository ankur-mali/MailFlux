
import { Button } from "@/components/ui/button";
import { Copy, RefreshCcw, Mail, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EmailHeaderProps {
  address: string;
  isLoading: boolean;
  onRefresh: () => void;
  onNewEmail: () => void;
  timeRemaining: number;
}

export const EmailHeader = ({ 
  address, 
  isLoading, 
  onRefresh, 
  onNewEmail, 
  timeRemaining 
}: EmailHeaderProps) => {
  const { toast } = useToast();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(address);
      toast({
        title: "Copied to clipboard",
        description: "Email address has been copied successfully",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="macbook-shadow rounded-2xl p-8 bg-card/50 backdrop-blur-xl border border-border/50 fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-primary/10 text-primary">
          <Mail className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-foreground">Your Temporary Email</h2>
          <p className="text-sm text-muted-foreground">
            Expires in {formatTime(timeRemaining)} • Auto-refreshes inbox
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onNewEmail}
          className="hover-lift rounded-xl gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          <span className="hidden sm:inline">New Email</span>
        </Button>
      </div>
      
      <div className="group relative">
        <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl border border-border/50 hover:border-primary/50 transition-all duration-300">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Email Address</p>
            <p className="font-mono text-sm text-foreground break-all select-all">{address}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              className="hover-lift rounded-xl opacity-60 group-hover:opacity-100 transition-opacity"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="hover-lift rounded-xl opacity-60 group-hover:opacity-100 transition-opacity"
            >
              <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </div>
      
      <p className="text-xs text-muted-foreground mt-4 text-center">
        This temporary email will automatically change every 10 minutes
      </p>
    </div>
  );
};
