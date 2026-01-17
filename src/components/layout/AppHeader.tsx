import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Home, Bell, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { setAuthenticated } from "@/lib/demoStorage";

export const AppHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isOnClassList = location.pathname === "/classes";
  const isOnCurriculum = location.pathname === "/curriculum";
  const isOnAnalytics = location.pathname === "/analytics";
  const isOnCalendar = location.pathname === "/calendar";

  return (
    <header className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate("/classes")}
          >
            <div>
              <img src="/school_logo.png" alt="school logo" className="h-12 w-auto object-contain" loading="lazy" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-foreground text-base tracking-tight leading-tight">
                The Hillridge International School
              </h1>
              <p className="text-[10px] uppercase tracking-widest font-semibold text-primary/70">
                IB Academic Planner
              </p>
            </div>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-1 bg-muted/50 p-1 rounded-full border border-border/50">
          <Button
            variant={isOnClassList ? "secondary" : "ghost"}
            size="sm"
            onClick={() => navigate("/classes")}
            className={`rounded-full px-4 ${isOnClassList ? "shadow-sm text-foreground" : "text-muted-foreground"}`}
          >
            <Home className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
          <Button
            variant={isOnCurriculum ? "secondary" : "ghost"}
            size="sm"
            onClick={() => navigate("/curriculum")}
            className={`rounded-full px-4 ${isOnCurriculum ? "shadow-sm text-foreground" : "text-muted-foreground"}`}
          >
            Curriculum
          </Button>
          <Button
            variant={isOnAnalytics ? "secondary" : "ghost"}
            size="sm"
            onClick={() => navigate("/analytics")}
            className={`rounded-full px-4 ${isOnAnalytics ? "shadow-sm text-foreground" : "text-muted-foreground"}`}
          >
            Analytics
          </Button>
          <Button
            variant={isOnCalendar ? "secondary" : "ghost"}
            size="sm"
            onClick={() => navigate("/calendar")}
            className={`rounded-full px-4 ${isOnCalendar ? "shadow-sm text-foreground" : "text-muted-foreground"}`}
          >
            Calendar
          </Button>
        </nav>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 pr-3 border-r border-border/50">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="text-muted-foreground rounded-full h-9 w-9">
              <Bell className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/profile")}
              className="text-muted-foreground rounded-full h-9 w-9"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>

          <div
            className="flex items-center gap-3 pl-1 cursor-pointer group"
            onClick={() => navigate("/profile")}
          >
            <div className="text-right hidden lg:block">
              <p className="text-sm font-medium leading-none group-hover:text-primary transition-colors">Ms. K Aishwarya</p>
              <p className="text-xs text-muted-foreground mt-1">Facilitator</p>
            </div>
            <Avatar className="h-9 w-9 border border-border group-hover:border-primary/50 transition-colors">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">KA</AvatarFallback>
            </Avatar>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                setAuthenticated(false);
                navigate("/");
              }}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-full h-9 w-9"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
