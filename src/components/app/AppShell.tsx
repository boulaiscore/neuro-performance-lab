import { ReactNode, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, LayoutDashboard, User, Bell, BellOff, Dumbbell, BookOpen, Sun, Moon, ChevronLeft, ChevronRight } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { useTheme } from "@/hooks/useTheme";
import { motion, AnimatePresence } from "framer-motion";

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
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [swipeProgress, setSwipeProgress] = useState(0);
  
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
    
    if (touchStartX.current && touchEndX.current) {
      const distance = touchStartX.current - touchEndX.current;
      const progress = Math.min(Math.abs(distance) / minSwipeDistance, 1);
      setSwipeProgress(progress);
      
      if (Math.abs(distance) > 20) {
        setSwipeDirection(distance > 0 ? 'left' : 'right');
      } else {
        setSwipeDirection(null);
      }
    }
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
    setSwipeDirection(null);
    setSwipeProgress(0);
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
        className="flex-1 pb-20 touch-pan-y relative"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
        
        {/* Swipe indicator overlay */}
        <AnimatePresence>
          {isSwiping && swipeDirection && swipeProgress > 0.3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center"
            >
              {/* Direction indicator */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: swipeProgress }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="absolute top-1/2 -translate-y-1/2 flex items-center gap-2 px-4 py-2 bg-background/90 backdrop-blur-md rounded-full border border-border/50 shadow-lg"
                style={{
                  left: swipeDirection === 'right' ? '16px' : 'auto',
                  right: swipeDirection === 'left' ? '16px' : 'auto',
                }}
              >
                {swipeDirection === 'right' && getCurrentIndex() > 0 && (
                  <>
                    <ChevronLeft className="w-4 h-4 text-primary" />
                    <span className="text-xs font-medium text-foreground">
                      {navItems[getCurrentIndex() - 1]?.label}
                    </span>
                  </>
                )}
                {swipeDirection === 'left' && getCurrentIndex() < navItems.length - 1 && (
                  <>
                    <span className="text-xs font-medium text-foreground">
                      {navItems[getCurrentIndex() + 1]?.label}
                    </span>
                    <ChevronRight className="w-4 h-4 text-primary" />
                  </>
                )}
              </motion.div>

              {/* Tab dots indicator */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                className="absolute bottom-24 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-2 bg-background/90 backdrop-blur-md rounded-full border border-border/50"
              >
                {navItems.map((item, index) => {
                  const currentIdx = getCurrentIndex();
                  const isActive = index === currentIdx;
                  const isTarget = 
                    (swipeDirection === 'left' && index === currentIdx + 1) ||
                    (swipeDirection === 'right' && index === currentIdx - 1);
                  
                  return (
                    <motion.div
                      key={item.to}
                      className={cn(
                        "w-2 h-2 rounded-full transition-all duration-200",
                        isActive && "bg-primary w-4",
                        isTarget && "bg-primary/60 scale-125",
                        !isActive && !isTarget && "bg-muted-foreground/30"
                      )}
                      animate={{
                        scale: isTarget ? 1.3 : isActive ? 1.1 : 1,
                      }}
                    />
                  );
                })}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
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