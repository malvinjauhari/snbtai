import { motion } from 'framer-motion';
import { Target, CheckCircle2, BookOpen, Clock, Zap, ArrowUpRight, Trophy, Sparkles, Bookmark } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useFirebase } from '../lib/FirebaseContext';
import { CreditBalanceCard } from '../components/credits/CreditBalanceCard';

export default function DashboardOverview() {
  const { profile } = useFirebase();

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h2 className="text-3xl font-bold mb-2">Welcome Back, {profile?.name?.split(' ')[0] || 'Pejuang'} 👋</h2>
           <p className="text-slate-400">Terus gaspol belajarnya! Target 750+ skor UTBK udah nunggu.</p>
        </div>
        <button className="premium-button flex items-center gap-2 w-fit">
           <Zap className="w-4 h-4" /> Mulai Simulasi Baru
        </button>
      </div>

      {/* Identity Card Mini & Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 h-full">
           <div className="glass-card h-full flex flex-col bg-gradient-to-br from-blue-600/10 to-transparent p-0 overflow-hidden">
              <div className="p-8 space-y-8 flex-1">
                 <div className="flex justify-between items-start">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-lg">S</div>
                    <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                       Pejuang {profile?.targetUni?.split(' ')[0] || 'PTN'} Verified
                    </div>
                 </div>
                 
                 <div>
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Target PTN</h3>
                    <p className="text-2xl font-bold">{profile?.targetMajor || 'Kedokteran'}, {profile?.targetUni || 'Universitas Indonesia'}</p>
                 </div>

                 <div className="space-y-4">
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Motivational Mantra</p>
                    <blockquote className="italic text-slate-300 text-lg border-l-2 border-blue-500 pl-4 py-1 leading-relaxed">
                       "{profile?.reason || 'Keluarga gue harus bangga pas ngeliat pengumuman nanti.'}"
                    </blockquote>
                 </div>
              </div>
              <div className="p-4 bg-white/5 border-t border-white/5 flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-slate-500">
                 <span>Member ID: {profile?.uid?.slice(-8).toUpperCase() || 'SNBT-XR22'}</span>
                 <span className="text-blue-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> 
                    {profile?.personalityType === 'ambis' ? 'Si Ambis Mode' : profile?.personalityType === 'sks' ? 'Penganut SKS' : 'Pasrah Mode'}
                 </span>
              </div>
           </div>
        </div>

        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
           <CreditBalanceCard />
           
           {[
             { label: 'Soal Dikerjakan', value: '1,240', sub: 'Top 5% Pejuang se-Nasional', icon: Target, color: 'emerald' },
             { label: 'Simulasi IRT', value: '8x', sub: 'Average Score: 712', icon: Zap, color: 'yellow' },
             { label: 'Ambis Battle Rank', value: '#123', sub: 'Division: Platinum I', icon: Trophy, color: 'indigo' },
           ].map((stat, i) => (
             <motion.div 
               key={i} 
               whileHover={{ y: -5 }}
               className="glass-card relative overflow-hidden group"
             >
               <div className={cn(
                 "absolute top-0 right-0 w-32 h-32 blur-[80px] -z-10 transition-opacity opacity-20 group-hover:opacity-40",
                 stat.color === 'blue' ? "bg-blue-600" :
                 stat.color === 'emerald' ? "bg-emerald-600" :
                 stat.color === 'yellow' ? "bg-yellow-600" : "bg-indigo-600"
               )} />
               <div className={cn(
                 "w-10 h-10 rounded-xl mb-6 flex items-center justify-center border",
                 stat.color === 'blue' ? "bg-blue-600/10 border-blue-500/20 text-blue-400" :
                 stat.color === 'emerald' ? "bg-emerald-600/10 border-emerald-500/20 text-emerald-400" :
                 stat.color === 'yellow' ? "bg-yellow-600/10 border-yellow-500/20 text-yellow-400" : "bg-indigo-600/10 border-indigo-500/20 text-indigo-400"
               )}>
                 <stat.icon className="w-5 h-5" />
               </div>
               <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
               <h4 className="text-3xl font-bold mb-2">{stat.value}</h4>
               <p className="text-[10px] text-slate-400 leading-tight">{stat.sub}</p>
             </motion.div>
           ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-6">
         <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" /> Recent Activity
            </h3>
            <button className="text-sm font-bold text-blue-400 hover:underline flex items-center gap-1 group">
               View All <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
         </div>
         
         <div className="space-y-4">
            {[
              { title: 'Simulasi Penalaran Matematika #Neraka', result: 'Skor 742/1000', time: '2 hours ago', icon: Sparkles },
              { title: 'Ambis Battle with @SiskaPejuang', result: 'Win! Earned +25 LP', time: '5 hours ago', icon: Trophy },
              { title: 'Added 12 Vocabulary in LBI', result: 'Saved to Wishlist', time: 'Yesterday', icon: Bookmark },
            ].map((activity, i) => (
              <div key={i} className="glass-card flex items-center justify-between hover:bg-white/[0.07] transition-all py-5">
                 <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-blue-400 shadow-inner">
                       <activity.icon className="w-6 h-6" />
                    </div>
                    <div>
                       <h4 className="font-bold text-lg mb-0.5">{activity.title}</h4>
                       <span className="text-emerald-500 text-xs font-semibold">{activity.result}</span>
                    </div>
                 </div>
                 <div className="flex flex-col items-end gap-2">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{activity.time}</span>
                    <button className="secondary-button !py-1.5 !px-4 text-[10px] uppercase font-bold tracking-widest">Detail</button>
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
}
