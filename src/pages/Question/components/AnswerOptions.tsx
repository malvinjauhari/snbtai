import React from 'react';
import { cn } from '@/src/lib/utils';
import { renderMath } from '@/src/utils/textParser';

interface AnswerOptionsProps {
  options?: Record<string, string> | string[];
  userAnswer: string | undefined;
  correctOption?: string;
  correctAnswer?: string;
  answerType?: string;
  isFinished: boolean;
  onAnswer: (val: string) => void;
}

export const AnswerOptions: React.FC<AnswerOptionsProps> = ({
  options,
  userAnswer,
  correctOption,
  correctAnswer,
  answerType,
  isFinished,
  onAnswer
}) => {
  if (answerType === 'short_answer') {
    const isCorrect = userAnswer?.replace(/[\s.]/g, '').trim() === correctAnswer?.replace(/[\s.]/g, '').trim();

    return (
      <div className="flex flex-col space-y-4 p-2">
        <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">
          JAWABAN SINGKAT (ANGKA SAJA)
        </label>
        <div className="relative">
          <input 
            type="text" 
            inputMode="numeric"
            value={userAnswer || ''}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9\s.-]/g, '');
              onAnswer(val);
            }}
            disabled={isFinished}
            placeholder="Masukkan jawaban..."
            className={cn(
              "w-full text-2xl font-black bg-white dark:bg-slate-900 border-2 rounded-2xl p-6 focus:outline-none transition-all",
              isFinished 
                ? isCorrect
                  ? "border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10"
                  : "border-rose-500 text-rose-600 bg-rose-50 dark:bg-rose-500/10"
                : "border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 shadow-sm"
            )}
          />
        </div>
        {isFinished && !isCorrect && (
          <div className="text-sm font-bold text-slate-500 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
             Jawaban benar: <span className="text-emerald-500">{correctAnswer}</span>
          </div>
        )}
      </div>
    );
  }

  // Handle options format whether it is array or old map
  const renderOptions = () => {
    if (!options) return null;
    let mappedOptions = Array.isArray(options) 
      ? options.map((opt, index) => ({ key: String.fromCharCode(65 + index), value: opt }))
      : Object.entries(options).map(([k, v]) => ({ key: k, value: v }));

    return mappedOptions.map(({key, value}) => (
        <button
          id={`opt-${key}`}
          key={key}
          onClick={() => onAnswer(key)}
          className={cn(
            "flex items-center gap-3 md:gap-4 p-4 md:p-5 rounded-[1.25rem] md:rounded-[1.5rem] border text-left transition-all duration-200 ease-out group shadow-sm dark:shadow-none outline-none",
            userAnswer === key 
              ? isFinished 
                ? key === correctOption 
                  ? "bg-emerald-500 border-emerald-400 text-white" 
                  : "bg-rose-500 border-rose-400 text-white"
                : "bg-indigo-600 border-transparent text-white shadow-lg shadow-indigo-600/20 ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 ring-indigo-500" 
              : isFinished && key === correctOption
                ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500 text-emerald-600 dark:text-emerald-400"
                : "bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300"
          )}
        >
          <div className={cn(
            "w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center font-black text-sm md:text-lg transition-all shrink-0",
            userAnswer === key ? "bg-white text-indigo-600" : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700"
          )}>
            {key}
          </div>
          <div className="text-sm md:text-base font-medium text-inherit">{renderMath(value)}</div>
        </button>
    ));
  };

  return (
    <div className="grid grid-cols-1 gap-3.5 p-1 md:p-2">
      {renderOptions()}
    </div>
  );
};
