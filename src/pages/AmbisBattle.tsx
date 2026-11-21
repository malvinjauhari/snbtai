import { motion } from 'motion/react';
import { Target, Star, Flame, Trophy, Lock, Users, Zap } from 'lucide-react';

export default function AmbisBattle() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-12 min-h-[calc(100vh-100px)] flex flex-col items-center justify-center">
      <div className="text-center space-y-6">
        <div className="w-20 h-20 bg-rose-600 rounded-[2rem] mx-auto flex items-center justify-center shadow-2xl shadow-rose-600/30">
          <Flame className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-5xl font-black tracking-tight">SNBT Battle.</h1>
        <p className="text-slate-400 font-medium text-lg max-w-xl">
          Duel 1v1 lawan pejuang seluruh Indonesia. Siapa yang paling cepet dan bener, dialah Rajanya Pejuang.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <div className="p-10 bg-slate-900 border border-slate-800 rounded-[2.5rem] space-y-6 text-center group cursor-pointer hover:border-indigo-500 transition-all">
          <div className="w-16 h-16 bg-slate-800 rounded-2xl mx-auto flex items-center justify-center mb-4">
             <Users className="w-8 h-8 text-indigo-400" />
          </div>
          <h3 className="text-2xl font-black text-white">Public Duel</h3>
          <p className="text-slate-500 text-sm font-medium">Lawan random pejuang yang lagi online sekarang.</p>
          <div className="pt-4">
            <span className="px-4 py-2 bg-indigo-500/10 text-indigo-400 text-[10px] font-black rounded-full border border-indigo-500/20 uppercase tracking-widest">
              Online: 1,420
            </span>
          </div>
        </div>

        <div className="p-10 bg-slate-900/40 border border-slate-800 rounded-[2.5rem] space-y-6 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-4">
             <Lock className="w-8 h-8 text-slate-600" />
             <span className="text-xs font-black text-slate-600 uppercase tracking-widest">Ranked Mode Coming Soon</span>
          </div>
          <div className="w-16 h-16 bg-slate-800 rounded-2xl mx-auto flex items-center justify-center mb-4">
             <Trophy className="w-8 h-8 text-amber-400" />
          </div>
          <h3 className="text-2xl font-black text-white">Monthly League</h3>
          <p className="text-slate-500 text-sm font-medium">Panjat leaderboard dan dapetin rewards premium.</p>
        </div>
      </div>

      <button className="flex items-center gap-3 px-12 py-5 bg-white text-slate-950 font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl group">
        Mulai Cari Lawan <Zap className="w-5 h-5 text-indigo-600 group-hover:animate-bounce" />
      </button>
    </div>
  );
}
