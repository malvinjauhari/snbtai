import React from 'react';
import { ChevronLeft, Timer } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface QuestionHeaderProps {
  subtest: string;
  timeLeft: number | null;
  isFinished: boolean;
  formatTime: (seconds: number | null) => string;
  onBack: () => void;
  onFinish: () => void;
  onClose: () => void;
}

export const QuestionHeader: React.FC<QuestionHeaderProps> = ({
  subtest,
  timeLeft,
  isFinished,
  formatTime,
  onBack,
  onFinish,
  onClose
}) => {
  return (
    <header className="flex flex-wrap items-center justify-between py-4 border-b border-slate-200 dark:border-slate-800 gap-4">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm dark:shadow-none">
          <ChevronLeft className="w-5 h-5 dark:text-white" />
        </button>
        <div>
          <h2 className="font-black text-lg text-slate-900 dark:text-white">SNBT AI 2026</h2>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold rounded-md border border-indigo-500/20 uppercase letter-spacing-1">
              {subtest}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {timeLeft !== null && (
          <div className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-2xl border font-mono font-bold transition-colors",
            timeLeft < 300 && !isFinished 
              ? "bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500 text-rose-500 dark:text-rose-400" 
              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 shadow-sm dark:shadow-none"
          )}>
            <Timer className="w-4 h-4" />
            {isFinished ? "FINISHED" : formatTime(timeLeft)}
          </div>
        )}
        {!isFinished && (
          <button 
            onClick={onFinish}
            className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20"
          >
            Selesai
          </button>
        )}
        {isFinished && (
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-slate-800 text-white font-bold rounded-2xl hover:bg-slate-700 transition-all"
          >
            Tutup
          </button>
        )}
      </div>
    </header>
  );
};
