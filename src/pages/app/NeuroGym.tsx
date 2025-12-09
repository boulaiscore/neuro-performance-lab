import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/app/AppShell";
import { NEURO_GYM_AREAS, NeuroGymArea } from "@/lib/neuroGym";
import { Target, Brain, Sliders, Lightbulb, Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const AREA_ICONS: Record<string, React.ElementType> = {
  Target,
  Brain,
  Sliders,
  Lightbulb,
  Sparkles,
  Zap,
};

export default function NeuroGym() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Determine thinking type label based on user preferences
  const getThinkingTypeLabel = () => {
    const goals = user?.trainingGoals || [];
    const hasFast = goals.includes("fast_thinking");
    const hasSlow = goals.includes("slow_thinking");
    
    if (hasFast && hasSlow) return { 
      label: "Fast & Slow", 
      color: "bg-primary/20 text-primary",
      description: "You're training both thinking systems: rapid intuitive responses and deliberate analytical reasoning."
    };
    if (hasFast) return { 
      label: "Fast Thinking", 
      color: "bg-amber-500/20 text-amber-400",
      description: "System 1: Quick, intuitive decisions. Pattern recognition and rapid responses under time pressure."
    };
    if (hasSlow) return { 
      label: "Slow Thinking", 
      color: "bg-blue-500/20 text-blue-400",
      description: "System 2: Deliberate, analytical reasoning. Deep analysis and careful decision-making."
    };
    return { 
      label: "All Types", 
      color: "bg-muted text-muted-foreground",
      description: "Set your thinking preference in onboarding to focus your training."
    };
  };

  const thinkingType = getThinkingTypeLabel();

  const handleEnterArea = (areaId: NeuroGymArea) => {
    navigate(`/neuro-gym/${areaId}`);
  };

  const handleNeuroActivation = () => {
    navigate("/neuro-gym/neuro-activation");
  };

  return (
    <AppShell>
      <div className="container px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Neuro Gym™</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Train your brain like an athlete trains their body.
          </p>
        </div>

        {/* Neuro Activation CTA */}
        <div className="mb-8">
          <button
            onClick={handleNeuroActivation}
            className={cn(
              "w-full p-5 rounded-xl border transition-all duration-300",
              "bg-gradient-to-br from-primary/20 via-primary/10 to-background",
              "border-primary/40 hover:border-primary/60",
              "hover:shadow-lg hover:shadow-primary/10"
            )}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
                <Zap className="w-7 h-7 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-lg">Neuro Activation Session™</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  7-min complete cognitive activation protocol
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-primary/80">
              <span className="px-2 py-0.5 bg-primary/20 rounded-full">Premium</span>
              <span>Focus • Memory • Control • Creativity • Reasoning</span>
            </div>
          </button>
        </div>

        {/* Section Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-border/50" />
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Training Zones</span>
          <div className="h-px flex-1 bg-border/50" />
        </div>

        {/* Area Cards */}
        <div className="grid gap-4">
          {NEURO_GYM_AREAS.map((area) => {
            const IconComponent = AREA_ICONS[area.icon] || Brain;
            
            return (
              <button
                key={area.id}
                onClick={() => handleEnterArea(area.id)}
                className={cn(
                  "w-full p-4 rounded-xl border transition-all duration-300 text-left",
                  "bg-card/50 hover:bg-card",
                  "border-border/50 hover:border-primary/40",
                  "hover:shadow-md hover:shadow-primary/5"
                )}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold">{area.title}</h3>
                      <TooltipProvider delayDuration={0}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span 
                              className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium cursor-help", thinkingType.color)}
                              onClick={(e) => e.stopPropagation()}
                            >
                              {thinkingType.label}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-[250px] text-center">
                            <p className="text-xs">{thinkingType.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <p className="text-xs text-primary/70 mt-0.5">{area.subtitle}</p>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {area.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer Quote */}
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground italic">
            "Your mind is your edge. Neuro Gym helps you sharpen it."
          </p>
        </div>
      </div>
    </AppShell>
  );
}
