import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, XCircle, Info } from 'lucide-react';
import { renderMath } from '@/src/utils/textParser';

interface ExplanationSectionProps {
  isCorrect: boolean;
  correctOption: string;
  explanation: string;
  showExplanation: boolean;
  onToggleExplanation: () => void;
}

export const ExplanationSection: React.FC<ExplanationSectionProps> = ({
  isCorrect,
  correctOption,
  explanation,
  showExplanation,
  onToggleExplanation
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-6 shadow-sm dark:shadow-xl"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isCorrect ? (
            <CheckCircle2 className="w-8 h-8 text-emerald-500 dark:text-emerald-400" />
          ) : (
            <XCircle className="w-8 h-8 text-rose-500 dark:text-rose-400" />
          )}
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">
            Opsi {correctOption} benar.
          </h3>
        </div>
        <button 
          onClick={onToggleExplanation}
          className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
        >
          <Info className="w-5 h-5" />
          {showExplanation ? "Hide Explanation" : "See Explanation"}
        </button>
      </div>
      
      {showExplanation && (
        <div className="p-5 md:p-6 lg:p-7 bg-slate-50 dark:bg-slate-800/40 rounded-2xl md:rounded-[1.5rem] border border-slate-200 dark:border-white/10 text-base">
          {renderMath(explanation)}
        </div>
      )}
    </motion.div>
  );
};
