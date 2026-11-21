import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Sparkles, X } from 'lucide-react';
import { BadgeStyle } from '@/src/lib/badgeUtils';
import Confetti from 'react-confetti';
import { useState, useEffect } from 'react';

interface AchievementOverlayProps {
  badge: BadgeStyle | null;
  onClose: () => void;
}

export default function AchievementOverlay({ badge, onClose }: AchievementOverlayProps) {
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!badge) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md">
        <Confetti
          width={dimensions.width}
          height={dimensions.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.15}
        />
        
        <motion.div 
          initial={{ scale: 0.5, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.5, opacity: 0, y: -50 }}
          className="relative max-w-lg w-full bg-slate-900 border border-white/20 rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(91,80,214,0.5)]"
        >
          {/* Header Animation Bag */}
          <div className={`h-32 ${badge.gradient} relative flex items-center justify-center overflow-hidden`}>
             <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:16px_16px]" />
             <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className={`w-64 h-64 ${badge.glow} rounded-full blur-3xl`}
             />
             <Trophy className="w-16 h-16 text-white relative z-10 drop-shadow-2xl" />
          </div>

          <div className="p-10 text-center space-y-6">
             <div className="space-y-2">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className={`${badge.text} text-sm font-black uppercase tracking-[0.3em]`}
                >
                   Badge Unlocked!
                </motion.div>
                <motion.h2 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.3 }}
                   className="text-5xl font-black text-white tracking-tighter"
                >
                   {badge.level} Level.
                </motion.h2>
             </div>

             <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-slate-400 font-medium leading-relaxed"
             >
                Gila parah! Lu udah nyelesein lebih dari <span className="text-white font-bold">{badge.minCompleted} soal</span>. 
                Gelar <span className={`${badge.text} font-bold`}>{badge.level}</span> sekarang sah jadi milik lu! 🔥
             </motion.p>

             <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                onClick={onClose}
                className="w-full py-5 bg-white text-slate-900 font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3"
             >
                Lanjutkan Perjuangan <Sparkles className="w-5 h-5 text-indigo-500" />
             </motion.button>
          </div>

          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-white/50 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
