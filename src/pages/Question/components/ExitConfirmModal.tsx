import { motion, AnimatePresence } from 'motion/react';
import { LogOut } from 'lucide-react';

interface ExitConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ExitConfirmModal({ isOpen, onConfirm, onCancel }: ExitConfirmModalProps) {
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
            role="dialog"
            aria-modal="true"
            aria-labelledby="exit-modal-title"
            aria-describedby="exit-modal-desc"
            className="relative w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[2rem] shadow-2xl p-6 md:p-8 overflow-hidden"
          >
            <div className="text-center space-y-6">
              <div className="w-16 h-16 mx-auto bg-rose-50 dark:bg-rose-500/10 rounded-2xl flex items-center justify-center border border-rose-100 dark:border-rose-500/20">
                <LogOut className="w-8 h-8 text-rose-500" />
              </div>

              <div>
                <h3 id="exit-modal-title" className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  Keluar dari latihan?
                </h3>
                <p id="exit-modal-desc" className="text-sm text-slate-500 dark:text-slate-400">
                  Progress jawabanmu mungkin belum tersimpan. Kamu bisa tetap lanjut mengerjakan atau keluar dari halaman ini.
                </p>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={onConfirm}
                  className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-bold transition-all shadow-md active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                >
                  Keluar
                </button>
                <button
                  onClick={onCancel}
                  className="w-full py-3.5 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-slate-500/50"
                >
                  Tetap di sini
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
