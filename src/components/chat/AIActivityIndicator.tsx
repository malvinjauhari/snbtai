import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Loader2 } from 'lucide-react';

const STEPS = [
  "Menganalisis permintaan...",
  "Mencari konteks dan riwayat belajar...",
  "Memproses data pengetahuan...",
  "Merangkai respons terbaik...",
  "Melakukan finalisasi jawaban..."
];

export function AIActivityIndicator({ isGenerating }: { isGenerating: boolean }) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!isGenerating) {
      setCurrentStep(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        }
        return prev; // Stay at the last step if still generating
      });
    }, 1500); // Progress to next step every 1.5 seconds

    return () => clearInterval(interval);
  }, [isGenerating]);

  if (!isGenerating) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="max-w-[85%] md:max-w-[70%] glass-panel rounded-2xl p-4 md:p-5 shadow-lg border border-slate-200 dark:border-white/10 mb-4"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center">
          <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
        </div>
        <span className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">
          AI Memproses...
        </span>
      </div>
      <div className="space-y-2">
        {STEPS.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isUpcoming = index > currentStep;

          if (isUpcoming) return null; // Only show current and completed

          return (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-xs md:text-sm font-medium"
            >
              {isCompleted ? (
                 <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : (
                 <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse ml-1 mr-1.5 shrink-0" />
              )}
              <span className={isCompleted ? "text-slate-500 dark:text-slate-400" : "text-slate-800 dark:text-indigo-200 animate-pulse"}>
                {step}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
