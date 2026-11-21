import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { GraduationCap, BarChart3, Search, ArrowRight, Library, ShieldCheck, MapPin } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function PTNPediaHub() {
  return (
    <div className="w-full h-full min-h-screen relative animate-in fade-in duration-500 overflow-hidden flex flex-col">
      {/* Background aesthetics */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-tl from-emerald-500/5 to-cyan-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="flex-1 w-full max-w-6xl mx-auto px-6 py-6 lg:py-12 relative z-10 flex flex-col shrink-0">
        <div className="text-center max-w-3xl mx-auto space-y-6 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400">
             <Library size={16} />
             <span className="text-xs font-black uppercase tracking-widest">Database SNPMB</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            PTN Pedia
          </h1>
          <p className="text-base lg:text-lg text-slate-600 dark:text-slate-400 font-medium">
            Pilih cara terbaik untuk mengenal kampus tujuanmu. Bandingkan prodi secara kuantitatif atau telusuri profil mendalam dari setiap universitas negeri di Indonesia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Card 1: PTN Grade */}
          <Link to="/ptnpedia/ptn-grade" className="group block">
             <motion.div 
               whileHover={{ y: -4 }}
               className="h-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-3xl p-8 lg:p-10 transition-all duration-300 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col justify-between"
             >
                <div className="space-y-6">
                   <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                      <BarChart3 size={32} />
                   </div>
                   <div className="space-y-3">
                     <h3 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                       PTN Grade
                     </h3>
                     <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                       Jelajahi daftar PTN berdasarkan data grade rasio keketatan, peminat, daya tampung, peluang lulus, dan informasi akademik terbaru yang tersedia.
                     </p>
                   </div>
                </div>
                
                <div className="mt-12 flex items-center text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-widest text-xs gap-2 group-hover:gap-4 transition-all">
                  Lihat PTN Grade <ArrowRight size={16} />
                </div>
             </motion.div>
          </Link>

          {/* Card 2: PTN Insight */}
          <Link to="/ptnpedia/ptn-insight" className="group block">
             <motion.div 
               whileHover={{ y: -4 }}
               className="h-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-3xl p-8 lg:p-10 transition-all duration-300 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10 flex flex-col justify-between"
             >
                <div className="space-y-6">
                   <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                      <Search size={32} />
                   </div>
                   <div className="space-y-3">
                     <h3 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                       PTN Insight
                     </h3>
                     <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                       Lihat profil lengkap PTN, mulai dari ringkasan kampus, prospek kerja, lingkungan pendukung, rekam jejak alumni, ciri khas, hingga sumber data yang dijamin keakuratannya.
                     </p>
                   </div>
                </div>
                
                <div className="mt-12 flex items-center text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest text-xs gap-2 group-hover:gap-4 transition-all">
                  Lihat PTN Insight <ArrowRight size={16} />
                </div>
             </motion.div>
          </Link>
        </div>
      </div>
    </div>
  );
}
