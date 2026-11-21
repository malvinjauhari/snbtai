import React from 'react';
import { ListFilter, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Question } from '../types';

interface QuestionSidebarProps {
  questions: Question[];
  currentIndex: number;
  userAnswers: Record<string, string>;
  isFinished: boolean;
  flagged: Record<string, boolean>;
  onNavigate: (index: number) => void;
}

export const QuestionSidebar: React.FC<QuestionSidebarProps> = ({
  questions,
  currentIndex,
  userAnswers,
  isFinished,
  flagged,
  onNavigate
}) => {
  const answeredCount = Object.keys(userAnswers).length;
  const currentQuestion = questions[currentIndex];

  return (
    <div className="w-full lg:w-80 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-[1.5rem] lg:rounded-[2rem] p-3 lg:p-6 flex flex-col shrink-0 shadow-sm dark:shadow-none order-first lg:order-last">
      
      {/* Mobile Top Row: Progress + Previous/Next */}
      <div className="flex lg:hidden items-center justify-between mb-3 gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">
            <span>Terjawab: {answeredCount}/{questions.length}</span>
            <span>Level {currentQuestion?.level}</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full transition-all duration-500",
                isFinished ? "bg-emerald-500" : "bg-indigo-500"
              )} 
              style={{ width: `${(answeredCount / questions.length) * 100}%` }} 
            />
          </div>
        </div>
        <div className="flex gap-1.5 shrink-0">
          <button 
            onClick={() => onNavigate(currentIndex - 1)}
            disabled={currentIndex === 0}
            className="w-8 h-8 md:w-10 md:h-10 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-white rounded-lg flex items-center justify-center disabled:opacity-30 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            aria-label="Soal sebelumnya"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <button 
            onClick={() => onNavigate(currentIndex + 1)}
            disabled={currentIndex === questions.length - 1}
            className="w-8 h-8 md:w-10 md:h-10 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-white rounded-lg flex items-center justify-center disabled:opacity-30 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            aria-label="Soal selanjutnya"
          >
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>

      <div className="hidden lg:flex items-center justify-between mb-8">
        <h3 className="font-black tracking-widest text-[10px] md:text-xs text-slate-400 dark:text-slate-500 uppercase">Question Nav</h3>
        <ListFilter className="w-4 h-4 text-slate-300 dark:text-slate-600" />
      </div>

      {/* Grid numbers */}
      <div className="flex lg:grid flex-nowrap lg:grid-cols-4 gap-2 lg:gap-2.5 flex-1 content-start overflow-x-auto lg:overflow-y-auto lg:overflow-x-hidden custom-scrollbar p-1 pb-2 lg:pb-1 lg:pr-2.5 max-h-[150px] lg:max-h-none mask-edges">
        {questions.map((q, i) => {
          let isCorrect = false;
          if (q.answerType === 'short_answer') {
            const cleanAns = userAnswers[q.id]?.toString().replace(/[\s.]/g, '').trim() || "";
            const cleanTruth = q.correctAnswer?.toString().replace(/[\s.]/g, '').trim() || "";
            isCorrect = cleanAns === cleanTruth && cleanTruth !== "";
          } else {
            isCorrect = userAnswers[q.id] === q.correctOption;
          }

          return (
            <button
              key={q.id}
              onClick={() => onNavigate(i)}
              className={cn(
                "w-10 h-10 lg:w-auto lg:h-auto shrink-0 lg:aspect-square rounded-xl flex items-center justify-center text-sm font-black transition-all duration-200 ease-out relative overflow-hidden",
                currentIndex === i 
                  ? "bg-indigo-600 text-white shadow-md ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 ring-indigo-500" 
                  : userAnswers[q.id] 
                    ? isFinished
                      ? isCorrect 
                        ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                        : "bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30"
                      : "bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30" 
                    : "bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-transparent"
              )}
            >
              {i + 1}
              {flagged[q.id] && <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-amber-500 rounded-full" />}
            </button>
          )
        })}
      </div>

      {/* Desktop Bottom portion */}
      <div className="hidden lg:block mt-8 space-y-4 pt-8 border-t border-slate-100 dark:border-slate-800/50">
         <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            <span>Terjawab: {answeredCount}/{questions.length}</span>
            <span>Level {currentQuestion?.level}</span>
         </div>
         <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full transition-all duration-500",
                isFinished ? "bg-emerald-500" : "bg-indigo-500"
              )} 
              style={{ width: `${(answeredCount / questions.length) * 100}%` }} 
            />
         </div>
         
         <div className="flex gap-2">
            <button 
              onClick={() => onNavigate(currentIndex - 1)}
              disabled={currentIndex === 0}
              className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-white rounded-2xl font-bold flex items-center justify-center disabled:opacity-30 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={() => onNavigate(currentIndex + 1)}
              disabled={currentIndex === questions.length - 1}
              className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-white rounded-2xl font-bold flex items-center justify-center disabled:opacity-30 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
         </div>
      </div>
    </div>
  );
};
