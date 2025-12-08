import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { useSession } from "@/contexts/SessionContext";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { BarChart3, Brain, Clock, TrendingUp, Lock } from "lucide-react";

const Insights = () => {
  const { sessions, getSessionsByType } = useSession();
  const { user } = useAuth();
  const isPremium = user?.subscriptionStatus === "premium";

  const reasoningSessions = getSessionsByType("reasoning").length;
  const claritySessions = getSessionsByType("clarity").length;
  const decisionSessions = getSessionsByType("decision").length;
  const totalSessions = sessions.length;

  // Calculate most used duration
  const durationCounts = sessions.reduce((acc, session) => {
    acc[session.durationOption] = (acc[session.durationOption] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const mostUsedDuration = Object.entries(durationCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  const insights = [
    {
      condition: reasoningSessions > claritySessions && reasoningSessions > decisionSessions,
      text: "You favor Reasoning Workouts. Consider adding Clarity Lab sessions for balanced cognitive development.",
    },
    {
      condition: mostUsedDuration === "30s" && totalSessions > 5,
      text: "Most sessions are 30-second drills. Longer sessions may unlock deeper analytical benefits.",
    },
    {
      condition: totalSessions > 10 && decisionSessions < 3,
      text: "Decision Studio is underutilized. Strategic decision frameworks compound over time.",
    },
    {
      condition: totalSessions >= 3,
      text: "Consistent practice builds cognitive fitness. Aim for daily sessions to maximize compounding.",
    },
  ];

  const activeInsight = insights.find((i) => i.condition)?.text || 
    "Complete more sessions to generate personalized insights.";

  return (
    <AppShell>
      <div className="container px-6 py-10 sm:py-16">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-semibold mb-3 tracking-tight">
              Cognitive <span className="text-gradient">Insights</span>
            </h1>
            <p className="text-muted-foreground">
              Track your training patterns and optimize your practice.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-6 rounded-xl bg-card border border-border shadow-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/8 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-primary" />
                </div>
              </div>
              <p className="text-3xl font-semibold mb-1">{totalSessions}</p>
              <p className="text-sm text-muted-foreground">Total Sessions</p>
            </div>

            <div className="p-6 rounded-xl bg-card border border-border shadow-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/8 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
              </div>
              <p className="text-3xl font-semibold mb-1">{mostUsedDuration}</p>
              <p className="text-sm text-muted-foreground">Preferred Duration</p>
            </div>
          </div>

          {/* Module Breakdown */}
          <div className="p-6 rounded-xl bg-card border border-border mb-8 shadow-card">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              Training Distribution
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Reasoning Workout™</span>
                  <span className="text-muted-foreground">{reasoningSessions}</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-primary rounded-full transition-all"
                    style={{ width: `${totalSessions ? (reasoningSessions / totalSessions) * 100 : 0}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Clarity Lab™</span>
                  <span className="text-muted-foreground">{claritySessions}</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-primary rounded-full transition-all"
                    style={{ width: `${totalSessions ? (claritySessions / totalSessions) * 100 : 0}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Decision Studio™</span>
                  <span className="text-muted-foreground">{decisionSessions}</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-primary rounded-full transition-all"
                    style={{ width: `${totalSessions ? (decisionSessions / totalSessions) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Insight Card */}
          <div className="p-6 rounded-xl bg-gradient-surface border border-border mb-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/8 flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Pattern Insight</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{activeInsight}</p>
              </div>
            </div>
          </div>

          {/* Premium Upsell */}
          {!isPremium && (
            <div className="p-6 rounded-xl border border-primary/20 bg-primary/5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Weekly Performance Briefing</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Upgrade to Premium for detailed weekly analysis and personalized cognitive training recommendations.
                  </p>
                  <Button asChild size="sm" variant="hero" className="rounded-xl">
                    <Link to="/app/premium">Unlock Premium</Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
};

export default Insights;
