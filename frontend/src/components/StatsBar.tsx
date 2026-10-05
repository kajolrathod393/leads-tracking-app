import type { LeadStatus } from "../types";

interface StatsBarProps {
  total: number;
  counts: Record<LeadStatus, number>;
}

const STAT_CARDS: { key: LeadStatus | "total"; label: string; className: string }[] = [
  { key: "total", label: "Total Leads", className: "stat-total" },
  { key: "new", label: "New", className: "stat-new" },
  { key: "contacted", label: "Contacted", className: "stat-contacted" },
  { key: "qualified", label: "Qualified", className: "stat-qualified" },
  { key: "lost", label: "Lost", className: "stat-lost" },
];

export default function StatsBar({ total, counts }: StatsBarProps) {
  return (
    <div className="stats-bar">
      {STAT_CARDS.map((card, index) => (
        <div key={card.key} className={`stat-card ${card.className}`} style={{ animationDelay: `${index * 45}ms` }}>
          <span className="stat-value">{card.key === "total" ? total : counts[card.key]}</span>
          <span className="stat-label">{card.label}</span>
        </div>
      ))}
    </div>
  );
}
