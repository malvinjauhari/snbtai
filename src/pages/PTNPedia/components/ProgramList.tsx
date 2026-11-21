import React from 'react';
import { Search, Loader, Sparkles } from 'lucide-react';
import { Program } from '../types';

interface ProgramListProps {
  universityName?: string;
  programSearchQuery: string;
  setProgramSearchQuery: (query: string) => void;
  sortedPrograms: Program[];
  loading: boolean;
  hasPrograms: boolean;
  expandedUniversity: string | null;
}

export const ProgramList: React.FC<ProgramListProps> = ({
  universityName,
  programSearchQuery,
  setProgramSearchQuery,
  sortedPrograms,
  loading,
  hasPrograms,
  expandedUniversity
}) => {
  if (!expandedUniversity) {
    return (
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center p-12 text-center space-y-6 opacity-70">
        <div className="w-32 h-32 bg-slate-100 dark:bg-slate-900 rounded-[2.5rem] flex items-center justify-center border border-slate-200 dark:border-white/5 relative">
          <Search size={40} className="text-slate-300 dark:text-slate-600" />
        </div>
        <div className="space-y-3 max-w-sm">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Pilih Universitas</h3>
          <p className="text-slate-500 font-normal leading-relaxed">
            Pilih salah satu universitas di daftar sebelah kiri untuk melihat informasi lengkap daya tampung dan rasio keketatan program studi.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50/20 dark:bg-slate-950/20 relative pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-white/5">
      <div className="p-6 lg:p-10 border-b border-slate-100 dark:border-white/5 bg-gradient-to-r from-white dark:from-slate-900/80 to-transparent">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 max-w-6xl">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
              <Sparkles size={12} />
              DATA AKREDITASI
            </div>
            <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {universityName}
            </h3>
          </div>
          <div className="relative w-full lg:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Cari program studi..."
              value={programSearchQuery}
              onChange={(e) => setProgramSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-500/50 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar">
        {loading && !hasPrograms ? (
          <div className="h-full flex flex-col items-center justify-center space-y-4">
            <Loader className="animate-spin text-indigo-600 dark:text-indigo-500" size={32} />
            <span className="text-slate-500 font-medium">Memuat data program studi...</span>
          </div>
        ) : (
          <div className="max-w-6xl space-y-4 pb-24">
            {sortedPrograms.map((prog, idx) => (
              <div key={idx} className="p-5 lg:p-6 bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-white/5 rounded-2xl relative overflow-hidden group hover:border-indigo-500/30 dark:hover:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                  <div className="space-y-2 flex-1 relative z-10">
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/10 text-indigo-600 dark:text-slate-300 text-[10px] font-black rounded-md uppercase tracking-wider">{prog.jenjang || 'S1'}</span>
                      <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">KODE: {prog.code}</span>
                    </div>
                    <h4 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">{prog.name}</h4>
                  </div>

                  <div className="grid grid-cols-2 xl:grid-cols-4 gap-2 lg:gap-4 w-full xl:w-auto relative z-10 shrink-0">
                    <div className="p-3 lg:p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-white/5 flex flex-col justify-center min-w-[80px]">
                      <div className="text-[9px] lg:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Kuota</div>
                      <div className="text-lg lg:text-xl font-bold text-slate-900 dark:text-white">{prog.capacity}</div>
                    </div>
                    <div className="p-3 lg:p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-white/5 flex flex-col justify-center min-w-[80px]">
                      <div className="text-[9px] lg:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Peminat</div>
                      <div className="text-lg lg:text-xl font-bold text-slate-600 dark:text-slate-300">{prog.applicants}</div>
                    </div>
                    <div className="p-3 lg:p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-white/5 flex flex-col justify-center min-w-[80px]">
                      <div className="text-[9px] lg:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Rasio</div>
                      <div className="text-lg lg:text-xl font-bold text-orange-500 dark:text-orange-400">1:{prog.ratio}</div>
                    </div>
                    <div className="p-3 lg:p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex flex-col justify-center min-w-[90px] group-hover:bg-indigo-600 transition-colors">
                      <div className="text-[9px] lg:text-[10px] font-black text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-200 uppercase tracking-widest mb-1 transition-colors">Peluang</div>
                      <div className="text-lg lg:text-xl font-black text-slate-900 dark:text-white group-hover:text-white transition-colors">{prog.admissionChance}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {sortedPrograms.length === 0 && (
              <div className="py-20 text-center">
                <div className="w-16 h-16 mx-auto bg-slate-100 dark:bg-slate-900 rounded-2xl flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                </div>
                <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Program Studi Tidak Ditemukan</h4>
                <p className="text-slate-500">Coba gunakan kata kunci pencarian yang lain.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
