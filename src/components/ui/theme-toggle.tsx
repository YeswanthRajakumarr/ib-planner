import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export const ThemeToggle = () => {
    const [isDark, setIsDark] = useState(() => {
        if (typeof window !== "undefined") {
            return document.documentElement.classList.contains("dark");
        }
        return false;
    });

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [isDark]);

    useEffect(() => {
        const stored = localStorage.getItem("theme");
        if (stored === "dark") {
            setIsDark(true);
        } else if (stored === "light") {
            setIsDark(false);
        } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            setIsDark(true);
        }
    }, []);

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDark(!isDark)}
            className="rounded-full h-9 w-9 text-muted-foreground hover:text-foreground transition-colors"
        >
            {isDark ? (
                <Sun className="w-4 h-4" />
            ) : (
                <Moon className="w-4 h-4" />
            )}
        </Button>
    );
};
