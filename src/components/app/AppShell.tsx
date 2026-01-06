import { ReactNode, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, LayoutDashboard, User, Bell, BellOff, Dumbbell, BookOpen, Sun, Moon } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { useTheme } from "@/hooks/useTheme";

interface AppShellProps {
  children: ReactNode;
}

const navItems = [
  { to: "/app", icon: Home, label: "Home" },
  { to: "/neuro-lab", icon: Dumbbell, label: "Lab" },
  { to: "/app/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/brain-science", icon: BookOpen, label: "Science" },
  { to: "/app/account", icon: User, label: "Account" },
];

export function AppShell({ children }: AppShellProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { permission, isSupported, checkReminders } = useNotifications();
  const { theme, toggleTheme } = useTheme();
  
  // Swipe navigation
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  
  const minSwipeDistance = 80;

  const getCurrentIndex = () => {
    return navItems.findIndex(item => item.to === location.pathname);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) {
      setIsSwiping(false);
      return;
    }
    
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    const currentIndex = getCurrentIndex();
    
    if (currentIndex === -1) {
      setIsSwiping(false);
      return;
    }
    
    if (isLeftSwipe && currentIndex < navItems.length - 1) {
      // Swipe left = go to next tab
      navigate(navItems[currentIndex + 1].to);
    } else if (isRightSwipe && currentIndex > 0) {
      // Swipe right = go to previous tab
      navigate(navItems[currentIndex - 1].to);
    }
    
    touchStartX.current = null;
    touchEndX.current = null;
    setIsSwiping(false);
  };

  // Check for reminders on mount
  useEffect(() => {
    if (permission === "granted") {
      checkReminders();
    }
  }, [permission]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border/30">
        <div className="container px-4">
          <div className="flex items-center justify-between h-12">
            {/* Theme toggle */}
            <button 
              onClick={toggleTheme}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted/50 transition-colors"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
              ) : (
                <Moon className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
              )}
            </button>
            
            <Link to="/app" className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-semibold text-[10px]">N</span>
              </div>
              <span className="font-semibold tracking-tight text-sm">NeuroLoop</span>
            </Link>
            
            <Link to="/app/install" className="w-8 flex justify-end">
              {isSupported && permission !== "granted" ? (
                <BellOff className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Bell className={cn(
                  "w-4 h-4",
                  permission === "granted" ? "text-primary" : "text-muted-foreground"
                )} />
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Main content with swipe support */}
      <main 
        className="flex-1 pb-20 touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border/30 safe-area-pb">
        <div className="flex items-center justify-around h-14 max-w-md mx-auto px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors min-w-[52px]",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[9px] font-medium uppercase tracking-wider">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}