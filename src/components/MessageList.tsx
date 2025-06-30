
import { MailTmMessage } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";

interface MessageListProps {
  messages: MailTmMessage[];
  selectedMessage: MailTmMessage | null;
  onMessageSelect: (message: MailTmMessage) => void;
  isLoading: boolean;
}

export const MessageList = ({ 
  messages, 
  selectedMessage, 
  onMessageSelect, 
  isLoading 
}: MessageListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-4 border border-border rounded-lg">
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-3 w-1/2 mb-2" />
            <Skeleton className="h-3 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <div className="text-6xl mb-4">📭</div>
        <p className="text-lg font-medium mb-2">No emails yet</p>
        <p className="text-sm">Your temporary inbox is empty. Share your email address to receive messages!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {messages.map((message) => (
        <Button
          key={message.id}
          variant={selectedMessage?.id === message.id ? "secondary" : "ghost"}
          className="w-full p-4 h-auto text-left justify-start hover-scale fade-in"
          onClick={() => onMessageSelect(message)}
        >
          <div className="flex flex-col gap-1 min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="font-medium text-sm truncate">
                {message.from.name || message.from.address}
              </p>
              <p className="text-xs text-muted-foreground flex-shrink-0">
                {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
              </p>
            </div>
            <p className="font-medium text-sm truncate text-foreground">
              {message.subject || "(No Subject)"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {message.intro || "No preview available"}
            </p>
          </div>
        </Button>
      ))}
    </div>
  );
};
