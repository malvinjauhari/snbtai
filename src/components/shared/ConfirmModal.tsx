import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Hapus',
  cancelText = 'Batal',
  variant = 'danger'
}: ConfirmModalProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'warning':
        return {
          icon: 'bg-amber-500/10 text-amber-500',
          button: 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/20',
          accent: 'via-amber-500'
        };
      case 'info':
        return {
          icon: 'bg-indigo-500/10 text-indigo-500',
          button: 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20',
          accent: 'via-indigo-500'
        };
      default: // danger
        return {
          icon: 'bg-rose-500/10 text-rose-500',
          button: 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/20',
          accent: 'via-rose-500'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-modal-title"
            aria-describedby="confirm-modal-desc"
            className="w-[calc(100vw-32px)] md:w-full max-w-[420px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[2rem] p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden"
          >
            {/* Visual Accent */}
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent ${styles.accent} to-transparent opacity-50`} />
            
            <button 
              onClick={onClose}
              aria-label="Tutup modal"
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-3 text-center">
              <div className={`w-16 h-16 md:w-[72px] md:h-[72px] ${styles.icon} rounded-full flex items-center justify-center mx-auto mb-4 md:mb-5`}>
                <AlertTriangle className="w-7 h-7 md:w-8 md:h-8" />
              </div>
              <h2 id="confirm-modal-title" className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tighter">{title}</h2>
              <p id="confirm-modal-desc" className="text-sm md:text-base text-slate-500 dark:text-slate-400 leading-relaxed font-medium px-2">
                {message}
              </p>
            </div>

            <div className="flex flex-col gap-2.5 pt-2">
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`w-full py-[14px] md:py-4 ${styles.button} text-white font-bold rounded-xl md:rounded-2xl shadow-xl transition-all tracking-tight uppercase text-sm md:text-base active:scale-[0.98]`}
              >
                {confirmText}
              </button>
              <button
                onClick={onClose}
                className="w-full py-[14px] md:py-4 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 font-bold rounded-xl md:rounded-2xl hover:bg-slate-200 dark:hover:bg-white/10 transition-all tracking-tight active:scale-[0.98] text-sm md:text-base"
              >
                {cancelText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
