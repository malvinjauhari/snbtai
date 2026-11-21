import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, HelpCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface FinishConfirmModalProps {
  isOpen: boolean;
  unansweredCount: number;
  flaggedCount: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export function FinishConfirmModal({ isOpen, unansweredCount, flaggedCount, onConfirm, onCancel }: FinishConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[2rem] shadow-2xl p-6 md:p-8 overflow-hidden"
          >
            <div className="text-center space-y-6">
              
              <div className="w-16 h-16 mx-auto bg-amber-50 dark:bg-amber-500/10 rounded-2xl flex items-center justify-center border border-amber-100 dark:border-amber-500/20">
                <AlertCircle className="w-8 h-8 text-amber-500" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Selesai Mengerjakan?</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Pastikan lu udah ngecek semua jawaban sebelum dikumpulin.
                </p>
              </div>

              {(unansweredCount > 0 || flaggedCount > 0) && (
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-3 text-left border border-slate-200 dark:border-white/5">
                  {unansweredCount > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-4 h-4 text-rose-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                          {unansweredCount} Soal kosong
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Belum diisi sama sekali</p>
                      </div>
                    </div>
                  )}
                  {flaggedCount > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center shrink-0">
                        <HelpCircle className="w-4 h-4 text-amber-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                          {flaggedCount} Soal Ragu-ragu
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Masih ditandai ragu</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {unansweredCount === 0 && flaggedCount === 0 && (
                <div className="bg-emerald-50 dark:bg-emerald-500/10 rounded-xl p-3 flex items-center justify-center gap-2 border border-emerald-100 dark:border-emerald-500/20">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Semua soal udah kejawab dan yakin!</p>
                </div>
              )}

              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={onConfirm}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all shadow-md active:scale-[0.98]"
                >
                  Ya, Kumpulkan
                </button>
                <button
                  onClick={onCancel}
                  className="w-full py-3.5 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-semibold transition-all active:scale-[0.98]"
                >
                  Cek Lagi
                </button>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
