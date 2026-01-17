import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background overflow-hidden selection:bg-primary/20">
      {/* Left Block - Image (Desktop only) */}
      <div className="hidden md:flex md:w-[45%] lg:w-[50%] relative overflow-hidden">
        <img
          src="/planning.jpg"
          alt="Abstract Planning"
          className="absolute inset-0 w-full h-full object-cover grayscale opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-background/90 backdrop-blur-[4px]" />

        <div className="relative z-10 flex flex-col justify-center h-full p-16 text-foreground">
          <div className="animate-in fade-in slide-in-from-top-8 duration-1000">
            <h1 className="text-8xl font-black tracking-tighter leading-none mb-4 opacity-10">
              404
            </h1>
            <h2 className="text-4xl font-black tracking-tight mb-6">
              LOST IN THE<br />CURRICULUM?
            </h2>
            <p className="text-lg font-medium text-muted-foreground max-w-sm border-l-2 border-primary/30 pl-6 py-2">
              The page you are looking for has been moved, removed, or never existed in this educational framework.
            </p>
          </div>
        </div>
      </div>

      {/* Right Block - Content */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#fdfdff] dark:bg-[#09090b] relative">
        <div className="w-full max-w-sm relative z-10 text-center md:text-left animate-in fade-in slide-in-from-right-8 duration-1000">
          <div className="md:hidden text-center mb-10">
            <h1 className="text-9xl font-black tracking-tighter leading-none text-primary/10">
              404
            </h1>
          </div>

          <div className="mb-10">
            <h3 className="text-2xl font-black tracking-tight text-foreground mb-3 font-heading uppercase">
              Page Not Found
            </h3>
            <p className="text-muted-foreground font-medium italic">
              Don't worry, even the best plans hit a snag sometimes. Let's get you back on track.
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={() => navigate("/classes")}
              className="w-full h-14 rounded-2xl text-base font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
            >
              <Home className="w-5 h-5" />
              Return to Dashboard
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="w-full h-14 rounded-2xl text-base font-bold border-border/50 hover:bg-muted transition-all flex items-center justify-center gap-3"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </Button>
          </div>

          <div className="mt-12 pt-8 border-t border-border/10">
            <div className="inline-flex items-center justify-center mb-4">
              <img src="/school_logo.png" alt="Logo" className="h-10 w-auto opacity-50" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/30">
              Academic Support Engineering
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
