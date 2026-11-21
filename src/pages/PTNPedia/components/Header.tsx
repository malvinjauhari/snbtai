import React from 'react';
import { ArrowLeft, BookOpen, Sparkles, Zap, Globe, BarChart3, AlertCircle } from 'lucide-react';
import { KlasterTab } from '../types';

interface HeaderProps {
  onBack?: () => void;
  klaster: string;
  setKlaster: (klaster: string) => void;
  viewMode: 'browse' | 'compare';
  setViewMode: (mode: 'browse' | 'compare') => void;
  setShowInfoModal: (show: boolean) => void;
}

const KLASTER_TABS: KlasterTab[] = [
  { id: 'akademik', label: 'Akademik', icon: Sparkles }
];

export const Header: React.FC<HeaderProps> = ({
  onBack,
  klaster,
  setKlaster,
  viewMode,
  setViewMode,
  setShowInfoModal
}) => {
  return (
    <div className="flex-shrink-0 px-6 py-4 md:px-8 border-b border-white/5 dark:border-white/5 bg-white/40 dark:bg-white/5 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-20">
      <div className="flex items-center gap-4">
        {onBack && (
          <button onClick={onBack} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition-all">
            <ArrowLeft className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          </button>
        )}
        <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
          <BookOpen className="text-indigo-600 dark:text-indigo-400 w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white leading-tight">PTNPedia.</h2>
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">SNPMB Database 2026</p>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row items-center gap-3 xl:gap-4 w-full md:w-auto overflow-hidden">
        <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1 rounded-xl border border-slate-200 dark:border-white/5 w-full sm:w-auto overflow-x-auto custom-scrollbar">
          {KLASTER_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setKlaster(tab.id)}
              className={`flex-shrink-0 flex items-center justify-center gap-2 px-4 sm:px-6 py-2 rounded-lg transition-all text-[11px] font-black uppercase tracking-wider ${
                klaster === tab.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-500 hover:text-indigo-600 dark:hover:text-slate-300'
              }`}
            >
              <tab.icon size={14} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setShowInfoModal(true)}
            className="p-2.5 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 rounded-xl transition-all border border-slate-200 dark:border-white/10 shadow-sm"
            title="Informasi Metrik"
          >
            <AlertCircle className="text-indigo-600 dark:text-indigo-400 w-5 h-5 flex-shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
};
