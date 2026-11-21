import { useCreditBalance } from '../../hooks/useCreditBalance';
import { Zap, Info, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export function CreditBalanceCard() {
  const { balance, dailyUsed, dailyLimit, nextBonusAt, bonusAmount } = useCreditBalance();

  if (balance === null) {
    return <div className="glass-card animate-pulse h-32" />;
  }

  const percentUsed = Math.min(100, Math.max(0, (dailyUsed / dailyLimit) * 100));
  const isLimitNear = percentUsed > 80;

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass-card p-6 h-full flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Kredit Belajar</h3>
          </div>
          <button className="text-slate-400 hover:text-slate-800 dark:text-slate-500 dark:hover:text-white transition-colors">
            <Info className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex items-end gap-2 mb-6">
          <span className="text-4xl font-black text-slate-800 dark:text-white">{balance}</span>
          <span className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">tersisa</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Daily Limit */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-slate-500 dark:text-slate-400">Pemakaian Hari Ini</span>
            <span className={isLimitNear ? 'text-rose-500 dark:text-rose-400 font-bold' : 'text-slate-600 dark:text-slate-300'}>
              {dailyUsed} / {dailyLimit} kredit
            </span>
          </div>
          <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${isLimitNear ? 'bg-rose-500' : 'bg-emerald-500'}`}
              style={{ width: `${percentUsed}%` }}
            />
          </div>
        </div>

        {/* Next Bonus */}
        {nextBonusAt && (
          <div className="pt-4 border-t border-slate-200 dark:border-white/5 flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
            <span>Bonus <strong className="text-emerald-600 dark:text-emerald-400">+{bonusAmount} kredit</strong> pada {nextBonusAt.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
