import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleHowItWorksClick = () => {
    if (location.pathname === "/") {
      // Already on home page, just scroll
      const element = document.getElementById('how-it-works');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Navigate to home first, then scroll after a short delay
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById('how-it-works');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <span className="text-foreground font-semibold text-sm">N</span>
            </div>
            <span className="font-semibold tracking-tight hidden sm:block">NeuroLoop Pro</span>
          </Link>

          {/* Nav links - hidden on mobile */}
          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={handleHowItWorksClick}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              How It Works
            </button>
            <Link to="/auth" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Sign In
            </Link>
          </div>

          {/* CTA */}
          <Button asChild size="sm" variant="hero" className="rounded-xl">
            <Link to="/auth">Start Training</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
