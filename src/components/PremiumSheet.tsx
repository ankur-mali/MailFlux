
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Card } from "@/components/ui/card";
import { Sparkles, Zap, Shield, Clock, Forward, Globe } from "lucide-react";

export const PremiumSheet = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="hover-lift gap-2">
          <Sparkles className="h-4 w-4" />
          <span className="hidden sm:inline">Premium</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md bg-card/95 backdrop-blur-xl border-border/50">
        <SheetHeader className="pb-6">
          <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Go Premium
          </SheetTitle>
        </SheetHeader>
        
        <div className="space-y-6">
          <Card className="p-6 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 macbook-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-primary/20 text-primary">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-primary">Premium Features</h3>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {[
                { icon: Globe, text: "Custom email addresses" },
                { icon: Clock, text: "Longer inbox retention" },
                { icon: Zap, text: "Priority support" },
                { icon: Shield, text: "Advanced filtering" },
                { icon: Forward, text: "Email forwarding" },
                { icon: Shield, text: "API access" },
              ].map(({ icon: Icon, text }, index) => (
                <div key={index} className="flex items-center gap-3 text-sm">
                  <Icon className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">{text}</span>
                </div>
              ))}
            </div>
          </Card>
          
          <Card className="p-6 macbook-shadow">
            <h4 className="font-semibold mb-3">Simple Pricing</h4>
            <div className="text-3xl font-bold text-primary mb-2">$0.0<span className="text-lg text-muted-foreground">/month</span></div>
            <p className="text-sm text-muted-foreground mb-4">Cancel anytime • 30-day money-back guarantee</p>
          </Card>
          
          <Button className="w-full hover-lift bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold py-3 rounded-xl macbook-shadow" size="lg">
            Comming Soon
          </Button>
          
          <p className="text-xs text-muted-foreground text-center">
            Join thousands of users who trust Mailflux for their temporary email needs
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
};
