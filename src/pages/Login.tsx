import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, LogIn } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login - in production this would validate credentials
    setTimeout(() => {
      setIsLoading(false);
      navigate("/classes");
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />

      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-10 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-3xl mb-6 shadow-xl shadow-primary/5">
            <GraduationCap className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-foreground mb-3 font-heading">IB Academic Planner</h1>
          <p className="text-lg text-muted-foreground font-medium italic">Empowering educators with precision planning.</p>
        </div>

        <Card className="border-border/50 shadow-2xl shadow-primary/5 rounded-[48px] overflow-hidden bg-background/80 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          <CardHeader className="space-y-2 pb-8 pt-12 text-center">
            <CardTitle className="text-2xl font-bold tracking-tight">Institutional Access</CardTitle>
            <CardDescription className="text-base">
              Use your academic credentials to unlock your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="px-10 pb-12">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Academic Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="k.aishwarya@ib-international.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-14 rounded-2xl bg-muted/30 border-border/50 focus:bg-background transition-all"
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Access Key</Label>
                  <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline">Forgot Access?</a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-14 rounded-2xl bg-muted/30 border-border/50 focus:bg-background transition-all"
                />
              </div>
              <Button
                type="submit"
                className="w-full h-16 rounded-[24px] text-base font-bold shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] mt-4"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-3">
                    <LogIn className="w-5 h-5 animate-pulse" />
                    Authenticating...
                  </span>
                ) : (
                  <span className="flex items-center gap-3">
                    <LogIn className="w-5 h-5" />
                    Enter Command Center
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-12 animate-in fade-in duration-1000 delay-500">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">
            Powered by GameUp
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
