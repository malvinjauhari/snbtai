import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Sparkles, Star } from 'lucide-react';
import { Session } from '../types';

interface RecentHistoryProps {
  loading: boolean;
  sessions: Session[];
}

export const RecentHistory: React.FC<RecentHistoryProps> = ({ loading, sessions }) => {
  return (
    <div className="premium-card rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-8">
       <div className="flex items-center justify-between mb-4 md:mb-6">
          <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">Riwayat Terakhir</h3>
          <Link to="/dashboard/bank-soal" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 flex items-center gap-1">
             Lihat Semua <ChevronRight className="w-3 h-3" />
          </Link>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading ? (
            [1, 2, 3].map(i => (
              <div key={i} className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 p-5 rounded-2xl flex flex-col animate-pulse opacity-50">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="w-16 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
                </div>
                <div className="w-full h-5 bg-slate-200 dark:bg-slate-800 rounded mb-4" />
                <div className="mt-auto flex items-center justify-between border-t border-slate-100 dark:border-white/5 pt-4">
                  <div className="w-12 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="w-12 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
                </div>
              </div>
            ))
          ) : sessions.length > 0 ? (
            sessions.map((session) => (
              <div key={session.id} className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 p-5 rounded-2xl flex flex-col transition-all hover:border-slate-200 dark:hover:border-white/10">
                 <div className="flex items-center gap-2 mb-3">
                    <div className="px-2 py-1 bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-wider rounded">{session.subtest}</div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">
                      {session.createdAt?.toDate ? session.createdAt.toDate().toLocaleDateString() : 'Baru aja'}
                    </span>
                 </div>
                 <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-4">{session.subtest} Level {session.level}</h4>
                 <div className="mt-auto flex items-center justify-between border-t border-slate-100 dark:border-white/5 pt-4">
                    <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-500">
                       <Star className="w-4 h-4 fill-current" />
                       <span className="font-black text-sm text-slate-700 dark:text-amber-500">Skor IRT</span>
                    </div>
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">{session.isFinished ? 'Selesai' : 'Sedang Dikerjakan'}</span>
                 </div>
              </div>
            ))
          ) : (
              <div className="col-span-full py-10 flex flex-col items-center justify-center text-center space-y-4">
                 <div className="w-16 h-16 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-full flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-indigo-500/50" />
                 </div>
                 <div>
                    <p className="text-slate-600 dark:text-slate-400 font-bold">Waduh, belum ada soal yang lu buat nih</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Generate simulasi kustom lu pertama kali di menu AI Magic!</p>
                 </div>
                 <Link to="/chat" className="px-6 py-2 bg-indigo-600 text-white text-xs font-black rounded-xl hover:scale-105 transition-all">
                    Bikin Soal Sekarang
                 </Link>
              </div>
          )}
       </div>
    </div>
  );
};
