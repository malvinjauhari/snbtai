import { motion } from 'motion/react';
import { Trophy, ChevronLeft, Lock, Star, Sparkles, Shield, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProgress } from '@/src/context/ProgressContext';
import { getBadge } from '@/src/lib/badgeUtils';

const LEVELS = [
  {
    id: 1,
    title: "Bronze",
    requirement: 0,
    desc: "Awal perjalanan sebagai Pejuang PTN.",
    color: "bg-amber-700/20",
    border: "border-amber-700/30",
    textColor: "text-amber-700 dark:text-amber-500",
    iconBg: "bg-amber-700",
    icon: Shield
  },
  {
    id: 2,
    title: "Silver",
    requirement: 50,
    desc: "Mulai konsisten latihan soal harian.",
    color: "bg-slate-400/20",
    border: "border-slate-400/30",
    textColor: "text-slate-600 dark:text-slate-300",
    iconBg: "bg-slate-400",
    icon: Shield
  },
  {
    id: 3,
    title: "Gold",
    requirement: 150,
    desc: "Pesaing tangguh! Kecepatan meningkat.",
    color: "bg-yellow-400/20",
    border: "border-yellow-400/30",
    textColor: "text-yellow-600 dark:text-yellow-400",
    iconBg: "bg-yellow-400",
    icon: Star
  },
  {
    id: 4,
    title: "Platinum",
    requirement: 300,
    desc: "Elit Pejuang. Hampir menguasai seluruh materi.",
    color: "bg-cyan-400/20",
    border: "border-cyan-400/30",
    textColor: "text-cyan-600 dark:text-cyan-400",
    iconBg: "bg-cyan-500",
    icon: Sparkles
  },
  {
    id: 5,
    title: "Diamond",
    requirement: 500,
    desc: "Berada di puncak rantai makanan SNBT.",
    color: "bg-purple-500/20",
    border: "border-purple-500/30",
    textColor: "text-purple-600 dark:text-purple-400",
    iconBg: "bg-purple-600",
    icon: Trophy
  },
  {
    id: 6,
    title: "Radiant",
    requirement: 1000,
    desc: "Legenda hidup. Siap menaklukkan PTN manapun.",
    color: "bg-rose-500/20",
    border: "border-rose-500/30",
    textColor: "text-rose-600 dark:text-rose-400",
    iconBg: "bg-rose-600",
    icon: Crown
  },
];

export default function StudentLevels() {
  const { stats } = useProgress();
  const currentQ = stats.completedQuestions || 0;
  
  const currentLevelIndex = [...LEVELS].reverse().findIndex(l => currentQ >= l.requirement);
  const actualIndex = currentLevelIndex >= 0 ? LEVELS.length - 1 - currentLevelIndex : 0;
  const currentLevel = LEVELS[actualIndex];
  const nextLevel = LEVELS[actualIndex + 1];
  
  const progressPercent = nextLevel 
    ? Math.min(100, Math.max(0, ((currentQ - currentLevel.requirement) / (nextLevel.requirement - currentLevel.requirement)) * 100))
    : 100;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in pt-4">
      
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-slate-200 dark:border-white/5 pb-6">
        <Link to="/dashboard/overview" className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-slate-500">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Level Explorer</h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Pantau progres dan buka level tier barumu.</p>
        </div>
      </div>

      {/* Current Progress Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2rem] p-6 md:p-10 shadow-2xl relative overflow-hidden flex flex-col md:flex-row gap-8 items-center">
         
         {/* Background Glow based on current level */}
         <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full blur-[100px] opacity-20 dark:opacity-10 ${currentLevel.iconBg} pointer-events-none`} />

         <div className="relative shrink-0 text-center space-y-3">
            <div className={`w-32 h-32 rounded-3xl mx-auto flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-2xl relative overflow-hidden`}>
               <div className={`absolute inset-0 ${currentLevel.iconBg} opacity-20`} />
               <currentLevel.icon className={`w-16 h-16 ${currentLevel.textColor} drop-shadow-xl relative z-10`} />
            </div>
            <div>
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Current Rank</span>
               <h2 className={`text-2xl font-black ${currentLevel.textColor}`}>{currentLevel.title}</h2>
            </div>
         </div>

         <div className="flex-1 w-full space-y-6 relative z-10">
            <div>
              <div className="flex justify-between items-end mb-2">
                <div>
                  <span className="text-3xl font-black text-slate-900 dark:text-white">{currentQ}</span>
                  <span className="text-sm font-bold text-slate-500 ml-1">Soal Selesai</span>
                </div>
                {nextLevel && (
                  <div className="text-right">
                    <span className="text-sm font-bold text-slate-500">Target Selanjutnya</span>
                    <p className={`text-sm font-black ${nextLevel.textColor}`}>{nextLevel.title} ({nextLevel.requirement})</p>
                  </div>
                )}
              </div>
              <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-white/5 relative">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full ${currentLevel.iconBg} rounded-full`}
                />
              </div>
              {nextLevel && (
                 <p className="text-xs font-bold text-slate-400 mt-3 text-right">
                   Butuh <span className="text-slate-700 dark:text-slate-200">{nextLevel.requirement - currentQ} soal</span> lagi untuk naik tier.
                 </p>
              )}
            </div>
         </div>
      </div>

      {/* All Levels List */}
      <div className="space-y-4">
        <h3 className="text-xl font-black text-slate-900 dark:text-white px-2">Semua Tier</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {LEVELS.map((level, i) => {
            const isUnlocked = currentQ >= level.requirement;
            const isCurrent = currentLevel.id === level.id;

            return (
              <div 
                key={level.id} 
                className={`relative p-6 rounded-[2rem] border transition-all duration-300 ${
                  isUnlocked 
                    ? `bg-white dark:bg-slate-900 shadow-xl ${isCurrent ? `border-${level.iconBg.split('-')[1]}-500/50 scale-[1.02] ring-4 ring-${level.iconBg.split('-')[1]}-500/20` : 'border-slate-200 dark:border-white/5'}`
                    : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/50 opacity-60'
                }`}
              >
                {/* Locked Overlay */}
                {!isUnlocked && (
                  <div className="absolute top-4 right-4 z-20">
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center backdrop-blur-md border border-white/10 shadow-sm">
                      <Lock className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                )}

                {/* Current Indicator */}
                {isCurrent && (
                  <div className="absolute top-4 right-4 z-20">
                    <span className="flex h-3 w-3 relative">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${level.iconBg} opacity-75`}></span>
                      <span className={`relative inline-flex rounded-full h-3 w-3 ${level.iconBg} border border-white dark:border-slate-900`}></span>
                    </span>
                  </div>
                )}

                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 relative z-10 ${isUnlocked ? level.iconBg : 'bg-slate-200 dark:bg-slate-800'}`}>
                  <level.icon className={`w-7 h-7 ${isUnlocked ? 'text-white drop-shadow-md' : 'text-slate-400'}`} />
                </div>

                <div className="space-y-1 relative z-10">
                  <div className="flex items-center gap-2">
                    <h4 className={`text-lg font-black ${isUnlocked ? level.textColor : 'text-slate-500 dark:text-slate-400'}`}>
                      {level.title}
                    </h4>
                    {isCurrent && (
                       <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[9px] font-black uppercase tracking-wider rounded">Saat ini</span>
                    )}
                  </div>
                  <p className="text-xs font-bold text-slate-400 flex flex-col gap-1 mt-2">
                    <span className="text-slate-600 dark:text-slate-300">Min. {level.requirement} Soal</span>
                    <span className="leading-relaxed font-medium">{level.desc}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
