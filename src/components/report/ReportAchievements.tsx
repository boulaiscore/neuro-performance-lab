import React from "react";
import { Trophy, Target, Flame, Star, Award, Calendar, TrendingUp } from "lucide-react";

interface Badge {
  id?: string;
  badge_id?: string;
  badge_name?: string;
  badge_description?: string | null;
  badge_category?: string;
  earned_at?: string;
}

interface ReportAchievementsProps {
  badges: Badge[];
}

const categoryConfig: Record<string, { icon: any; color: string; label: string }> = {
  mastery: { icon: Trophy, color: "#ffc107", label: "Mastery" },
  milestone: { icon: Target, color: "#4db6ac", label: "Milestone" },
  streak: { icon: Flame, color: "#ff7043", label: "Consistency" },
  special: { icon: Star, color: "#7e57c2", label: "Special" },
  general: { icon: Award, color: "#42a5f5", label: "Achievement" },
};

export function ReportAchievements({ badges }: ReportAchievementsProps) {
  const sortedBadges = [...(badges || [])].sort((a, b) => {
    const dateA = a.earned_at ? new Date(a.earned_at).getTime() : 0;
    const dateB = b.earned_at ? new Date(b.earned_at).getTime() : 0;
    return dateB - dateA;
  });

  const badgesByCategory = sortedBadges.reduce((acc, badge) => {
    const cat = (badge.badge_category ?? "general").toLowerCase();
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(badge);
    return acc;
  }, {} as Record<string, Badge[]>);

  return (
    <section className="report-page">
      <h2 className="report-section-title">Achievement & Progress Markers</h2>
      <p className="report-subtitle">Behavioral indicators of training consistency and cognitive development milestones</p>

      {badges.length === 0 ? (
        <div className="achievements-empty">
          <div className="empty-icon">
            <Award size={48} color="#e0e0e0" />
          </div>
          <h3>No Achievements Yet</h3>
          <p>Complete training sessions to unlock achievement markers that demonstrate consistent cognitive engagement and skill development.</p>
        </div>
      ) : (
        <>
          <div className="achievements-summary">
            <div className="achievement-stat">
              <span className="stat-value">{badges.length}</span>
              <span className="stat-label">Total Achievements</span>
            </div>
            <div className="achievement-stat">
              <span className="stat-value">{Object.keys(badgesByCategory).length}</span>
              <span className="stat-label">Categories</span>
            </div>
            <div className="achievement-stat">
              <span className="stat-value">
                {badges.filter(b => {
                  if (!b.earned_at) return false;
                  const d = new Date(b.earned_at);
                  const now = new Date();
                  return (now.getTime() - d.getTime()) < 30 * 24 * 60 * 60 * 1000;
                }).length}
              </span>
              <span className="stat-label">Last 30 Days</span>
            </div>
          </div>

          <h3 className="report-subsection-title">Achievement Record</h3>
          <p className="achievements-intro">
            Achievements serve as objective markers of training engagement and cognitive progress. 
            Research indicates that gamification elements improve adherence to cognitive training programs (Lumsden et al., 2016).
          </p>

          <div className="achievements-grid">
            {sortedBadges.slice(0, 12).map((badge) => {
              const category = (badge.badge_category ?? "general").toLowerCase();
              const config = categoryConfig[category] ?? categoryConfig.general;
              const Icon = config.icon;
              
              return (
                <div key={badge.badge_id ?? badge.id} className="achievement-card">
                  <div className="achievement-icon" style={{ backgroundColor: `${config.color}15`, color: config.color }}>
                    <Icon size={20} />
                  </div>
                  <div className="achievement-content">
                    <span className="achievement-category" style={{ color: config.color }}>{config.label}</span>
                    <span className="achievement-name">{badge.badge_name ?? "Achievement"}</span>
                    {badge.earned_at && (
                      <span className="achievement-date">
                        <Calendar size={10} />
                        {new Date(badge.earned_at).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {badges.length > 12 && (
            <p className="achievements-more">+ {badges.length - 12} additional achievements</p>
          )}
        </>
      )}
    </section>
  );
}
