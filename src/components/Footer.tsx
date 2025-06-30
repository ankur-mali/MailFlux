
import { Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Footer = () => {
  return (
    <footer className="mt-16 border-t border-border/50 bg-card/30 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Left - Learning Purpose */}
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              Built for learning purposes
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Powered by{" "}
              <a 
                href="https://mail.tm" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors underline"
              >
                mail.tm API
              </a>
            </p>
          </div>

          {/* Center - Brand */}
          <div className="text-center">
            <div className="text-lg font-semibold bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent">
              Mailflux
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Temporary Email Service
            </p>
          </div>

          {/* Right - Developer Info */}
          <div className="text-center md:text-right">
            <p className="text-sm text-muted-foreground">
              Built by{" "}
              <span className="font-medium text-foreground">Ankur</span>
            </p>
            <div className="flex items-center justify-center md:justify-end gap-3 mt-2">
              <a
                href="https://ankurmali.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                Portfolio
              </a>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                asChild
              >
                <a
                  href="https://www.linkedin.com/in/ankur-mali-/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom divider */}
        <div className="mt-6 pt-6 border-t border-border/30">
          <p className="text-center text-xs text-muted-foreground/60">
            © 2025 Mailflux. For educational and learning purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
};
