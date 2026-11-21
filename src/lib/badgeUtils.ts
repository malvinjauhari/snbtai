export interface BadgeStyle {
  level: string;
  color: string;
  gradient: string;
  border: string;
  text: string;
  iconBg: string;
  glow: string;
  minCompleted: number;
}

export const BADGE_LEVELS: BadgeStyle[] = [
  {
    level: "Platinum",
    color: "from-slate-100 via-cyan-100 to-slate-200",
    gradient: "bg-gradient-to-br from-slate-800 via-cyan-900/30 to-slate-900",
    border: "border-cyan-500/40",
    text: "text-cyan-200",
    iconBg: "bg-gradient-to-tr from-cyan-400 via-slate-300 to-cyan-600",
    glow: "bg-cyan-500/30",
    minCompleted: 750
  },
  {
    level: "Elite",
    color: "from-rose-400 to-red-500",
    gradient: "bg-gradient-to-br from-slate-900 via-rose-900/30 to-slate-900",
    border: "border-rose-500/40",
    text: "text-rose-400",
    iconBg: "bg-gradient-to-tr from-rose-500 to-red-600",
    glow: "bg-rose-500/30",
    minCompleted: 400
  },
  {
    level: "Scholar",
    color: "from-emerald-400 to-teal-500",
    gradient: "bg-gradient-to-br from-slate-900 via-emerald-900/30 to-slate-900",
    border: "border-emerald-500/40",
    text: "text-emerald-400",
    iconBg: "bg-gradient-to-tr from-emerald-500 to-teal-600",
    glow: "bg-emerald-500/30",
    minCompleted: 200
  },
  {
    level: "Ambitious",
    color: "from-indigo-400 to-purple-500",
    gradient: "bg-gradient-to-br from-slate-900 via-indigo-900/30 to-slate-900",
    border: "border-indigo-500/40",
    text: "text-indigo-400",
    iconBg: "bg-gradient-to-tr from-indigo-500 to-purple-600",
    glow: "bg-indigo-500/30",
    minCompleted: 75
  },
  {
    level: "Fighter",
    color: "from-orange-400 to-amber-500",
    gradient: "bg-gradient-to-br from-slate-900 via-orange-900/30 to-slate-900",
    border: "border-orange-500/40",
    text: "text-orange-400",
    iconBg: "bg-gradient-to-tr from-orange-500 to-amber-600",
    glow: "bg-orange-500/30",
    minCompleted: 20
  },
  {
    level: "Newbie",
    color: "from-slate-400 to-blue-400",
    gradient: "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900",
    border: "border-blue-500/30",
    text: "text-blue-300",
    iconBg: "bg-gradient-to-tr from-slate-500 to-blue-500",
    glow: "bg-blue-500/20",
    minCompleted: 0
  }
];

export const getBadge = (completed: number): BadgeStyle => {
  return BADGE_LEVELS.find(b => completed >= b.minCompleted) || BADGE_LEVELS[BADGE_LEVELS.length - 1];
};
