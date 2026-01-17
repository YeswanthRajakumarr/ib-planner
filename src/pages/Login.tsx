import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { LogIn, ArrowRight } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      navigate("/classes");
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background overflow-hidden selection:bg-primary/20">
      {/* Left Block - Image & Branding (Desktop only) */}
      <div className="hidden md:flex md:w-[50%] lg:w-[55%] relative overflow-hidden">
        <img
          src="/planning.jpg"
          alt="Planning"
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        {/* Modern Overlay with Blur & Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/40 to-transparent backdrop-blur-[1px]" />

        {/* Aesthetic Branding on Image */}
        <div className="relative z-10 flex flex-col justify-between h-full p-12 text-white">
          <div className="animate-in fade-in slide-in-from-top-8 duration-1000">

          </div>

          <div className="animate-in fade-in slide-in-from-left-8 duration-1000 delay-300">
            <h1 className="text-6xl font-black tracking-tighter leading-none mb-6">
              STRATEGIC<br />EXCELLENCE.
            </h1>
            <p className="text-xl font-medium text-white/80 max-w-sm border-l-2 border-white/30 pl-6 py-2">
              Advanced curriculum orchestration for the modern International Baccalaureate educator.
            </p>
          </div>

          <div className="text-sm font-bold tracking-[0.3em] opacity-40">
            IB ACADEMIC PLANNER
          </div>
        </div>
      </div>

      {/* Right Block - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[#fdfdff] dark:bg-[#09090b] relative">
        {/* Subtle Background Elements for Form Side */}
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[100px]" />

        <div className="w-full max-w-[360px] relative z-10 animate-in fade-in slide-in-from-right-8 duration-1000">
          {/* Mobile Branding (Visible only on small screens) or School Logo for Context */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center mb-4">
              <img src="/school_full_logo.png" alt="Hillridge Logo" className="h-32 w-auto object-contain" loading="lazy" />
            </div>
            <h2 className="text-xl font-black tracking-tight text-foreground mb-1 font-heading">
              Institutional Access
            </h2>
            <p className="text-xs text-muted-foreground font-medium italic">
              Please authenticate to enter.
            </p>
          </div>

          <Card className="border-border/30 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.05)] rounded-[24px] overflow-hidden bg-white/40 dark:bg-card/20 backdrop-blur-2xl">
            <CardContent className="p-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80 px-1">Academic Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="k.aishwarya@ib-international.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-10 rounded-lg bg-white dark:bg-background/50 border-border/50 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between px-1">
                    <Label htmlFor="password" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80">Access Key</Label>
                    <a href="#" className="text-[10px] font-bold text-primary hover:underline transition-all uppercase tracking-wider">Reset Key</a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-10 rounded-lg bg-white dark:bg-background/50 border-border/50 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] mt-2 group"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-3">
                      <LogIn className="w-4 h-4 animate-pulse" />
                      Authenticating...
                    </span>
                  ) : (
                    <span className="flex items-center gap-3">
                      <LogIn className="w-4 h-4 mr-1" />
                      Enter Dashboard
                    </span>
                  )}
                </Button>
              </form>

              <div className="mt-6 pt-5 border-t border-border/10">
                <p className="text-[9px] font-bold text-center uppercase tracking-[0.3em] text-muted-foreground/40">
                  Powered by GameUp Technologies
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
