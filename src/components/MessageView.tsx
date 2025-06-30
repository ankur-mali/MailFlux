
import { MailTmMessage } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Delete } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface MessageViewProps {
  message: MailTmMessage | null;
  onDeleteAccount: () => void;
}

export const MessageView = ({ message, onDeleteAccount }: MessageViewProps) => {
  if (!message) {
    return (
      <Card className="p-8 text-center border-dashed">
        <div className="text-6xl mb-4">✉️</div>
        <h3 className="text-lg font-medium mb-2">Select an email</h3>
        <p className="text-muted-foreground">
          Choose a message from the inbox to read its contents
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-0 overflow-hidden fade-in">
      <div className="p-6 border-b border-border bg-card/50">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold mb-2 text-foreground">
              {message.subject || "(No Subject)"}
            </h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>
                <span className="font-medium">From:</span> {message.from.name || message.from.address}
              </p>
              <p>
                <span className="font-medium">To:</span> {message.to[0]?.address}
              </p>
              <p>
                <span className="font-medium">Date:</span>{" "}
                {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onDeleteAccount}
            className="hover-scale text-destructive border-destructive/50 hover:bg-destructive hover:text-destructive-foreground"
          >
            <Delete className="h-4 w-4 mr-2" />
            Delete Account
          </Button>
        </div>
      </div>
      
      <div className="p-6">
        {message.html && message.html.length > 0 ? (
          <div
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: message.html[0] }}
          />
        ) : (
          <div className="whitespace-pre-wrap font-mono text-sm bg-muted/30 p-4 rounded-lg">
            {message.text || "No content available"}
          </div>
        )}
      </div>
    </Card>
  );
};
