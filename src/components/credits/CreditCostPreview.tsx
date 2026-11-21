import React from 'react';
import { useCreditBalance } from '../../hooks/useCreditBalance';
import { Zap, ChevronRight, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  featureName: string;
  cost: number;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function CreditCostPreview({ featureName, cost, onConfirm, isLoading }: Props) {
  const { balance } = useCreditBalance();

  if (balance === null) return null;

  const isInsufficient = balance < cost;
  const newBalance = balance - cost;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5 border border-slate-200 dark:border-white/10 relative overflow-hidden"
    >
      {/* Decorative BG */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[40px] rounded-full -z-10" />

      <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-4">{featureName}</h4>
      
      <div className="space-y-2 mb-6">
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-500 dark:text-slate-400">Biaya:</span>
          <span className="font-bold text-rose-500 dark:text-rose-400 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" /> -{cost} kredit
          </span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-500 dark:text-slate-400">Sisa setelah generate:</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" /> {isInsufficient ? 'Kredit Tidak Cukup' : newBalance + ' kredit'}
          </span>
        </div>
      </div>

      {isInsufficient ? (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl p-3 flex items-start gap-2 text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <p>Kredit tidak cukup. Sisa kredit kamu saat ini {balance}. Tunggu bonus bulanan berikutnya.</p>
        </div>
      ) : (
        <button 
          onClick={onConfirm}
          disabled={isLoading}
          className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black rounded-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl shadow-black/10 uppercase tracking-wider text-xs disabled:opacity-50"
        >
          {isLoading ? (
             <span className="animate-pulse flex items-center gap-2">Memproses...</span>
          ) : (
             <>Generate Soal (-{cost} Kredit) <ChevronRight className="w-4 h-4" /></>
          )}
        </button>
      )}
    </motion.div>
  );
}
