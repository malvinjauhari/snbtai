import { useState } from 'react';
import { useCreditBalance } from '../../hooks/useCreditBalance';
import { Zap, ChevronDown, Check } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export function CreditMiniBadge() {
  const { balance, dailyUsed, dailyLimit } = useCreditBalance();
  const [open, setOpen] = useState(false);

  // If user unauth or data not loaded, show nothing or skeleton
  if (balance === null) return null;

  const isLow = balance < 10;
  const isLimitNear = dailyUsed > dailyLimit * 0.8;

  return (
    <div className="relative">
      <button 
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all
          ${isLow || isLimitNear 
            ? 'bg-rose-500/10 border-rose-500/30 text-rose-500 hover:bg-rose-500/20' 
            : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20'
          }`}
      >
        <Zap className="w-4 h-4" />
        <span>{balance}</span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40" onClick={() => setOpen(false)} 
            />
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full right-0 mt-2 w-64 p-4 rounded-2xl glass-panel border border-slate-200 dark:border-white/10 shadow-2xl z-50 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Kredit Belajar</span>
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold text-lg"><Zap className="w-5 h-5"/> {balance}</span>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Limit Harian</span>
                  <span className={isLimitNear ? 'text-rose-500 dark:text-rose-400 font-bold' : ''}>{dailyUsed} / {dailyLimit}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${isLimitNear ? 'bg-rose-500' : 'bg-emerald-500'}`}
                    style={{ width: `${Math.min(100, Math.max(0, (dailyUsed / dailyLimit) * 100))}%` }}
                  />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
