import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Play, Binary, PenTool, Languages, BookOpen } from 'lucide-react';
import { SubtestSession } from '../types';

interface SessionItemProps {
  session: SubtestSession;
  onDelete: (e: React.MouseEvent, id: string) => void;
}

const getSubtestIcon = (subtest: string) => {
  switch (subtest) {
    case 'PK': return Binary;
    case 'PM': return PenTool;
    case 'LBI':
    case 'LBE': return Languages;
    default: return BookOpen;
  }
};

export const SessionItem: React.FC<SessionItemProps> = ({ session, onDelete }) => {
  const Icon = getSubtestIcon(session.subtest);

  return (
    <div className="p-4 md:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl md:rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 hover:border-indigo-500 transition-all group shadow-sm relative overflow-hidden">
      <div className="flex items-center gap-4 md:gap-6">
        <div className="shrink-0 w-12 h-12 md:w-14 md:h-14 bg-slate-50 dark:bg-slate-800 rounded-xl md:rounded-2xl flex items-center justify-center border border-slate-100 dark:border-transparent shadow-sm">
           <Icon className="w-5 h-5 md:w-7 md:h-7 text-indigo-500 dark:text-indigo-400" />
        </div>
        <div className="min-w-0 flex-1">
           <div className="flex items-center gap-2 mb-1">
              <span className="text-[9px] md:text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest truncate">{session.id.substring(0, 8)}</span>
              <span className="shrink-0 w-1 h-1 bg-slate-200 dark:bg-slate-700 rounded-full" />
              <span className="text-[9px] md:text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest shrink-0">{session.subtest}</span>
           </div>
           <h4 className="text-base md:text-lg font-bold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-white transition-colors truncate">Simulasi {session.subtest} Level {session.level}</h4>
           <p className="text-[10px] md:text-xs text-slate-500 font-medium mt-0.5 md:mt-1">{session.questions?.length || 0} Soal • AI</p>
        </div>
      </div>
      <div className="flex items-center justify-end gap-2 md:gap-3 relative z-10 w-full sm:w-auto mt-2 sm:mt-0 border-t border-slate-100 dark:border-slate-800 sm:border-0 pt-3 sm:pt-0">
        <button 
          onClick={(e) => onDelete(e, session.id)}
          className="flex-1 sm:flex-none w-auto sm:w-10 md:w-12 h-10 md:h-12 bg-white dark:bg-slate-900 text-rose-500 rounded-xl md:rounded-2xl flex items-center justify-center hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all shadow-sm border border-slate-200 dark:border-slate-800 cursor-pointer gap-2"
          title="Hapus Simulasi"
        >
          <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
          <span className="sm:hidden text-xs font-bold">Hapus</span>
        </button>
        <Link to={`/question/${session.id}`} className="flex-[2] sm:flex-none w-auto sm:w-10 md:w-12 h-10 md:h-12 bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-slate-400 rounded-xl md:rounded-2xl flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all sm:group-hover:scale-110 shadow-sm border border-transparent gap-2">
           <Play className="w-4 h-4 md:w-5 md:h-5 fill-current" />
           <span className="sm:hidden text-xs font-bold">Mulai</span>
        </Link>
      </div>
    </div>
  );
};
