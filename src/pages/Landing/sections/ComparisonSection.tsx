import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { XCircle, CheckCircle2, RefreshCw } from 'lucide-react';

export default function ComparisonSection() {
  const [isSNBT, setIsSNBT] = useState(true);

  return (
    <section className="py-24 px-6 max-w-5xl mx-auto w-full flex flex-col items-center">
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-16 text-center tracking-tight">
        Kenapa <span className="text-indigo-600 dark:text-indigo-400">SNBT AI?</span>
      </h2>

      {/* Switcher */}
      <div className="flex bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-full p-2 mb-12 shadow-md dark:shadow-xl">
        <button 
          onClick={() => setIsSNBT(false)}
          className={`px-6 py-3 rounded-full text-sm font-bold transition-all ${!isSNBT ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
        >
          Platform Biasa
        </button>
        <button 
          onClick={() => setIsSNBT(true)}
          className={`px-6 py-3 rounded-full text-sm font-bold transition-all ${isSNBT ? 'bg-indigo-600 text-white shadow-lg dark:shadow-[0_0_20px_rgba(79,70,229,0.5)]' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
        >
          SNBT AI
        </button>
      </div>

      <div className="w-full relative min-h-[400px]">
        <AnimatePresence mode="wait">
          {!isSNBT ? (
            <motion.div
              key="normal"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ type: 'spring', bounce: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
               {[
                 { title: "Bank Soal Kaku", desc: "Soal yang sama diulang-ulang. Gampang dihafal." },
                 { title: "Pembahasan Template", desc: "Hanya teks panjang yang membosankan tanpa step-by-step." },
                 { title: "Satu Arah", desc: "Tidak bisa bertanya atau diskusi jika masih tidak paham." },
                 { title: "Tidak Adaptif", desc: "Semua murid mendapat porsi materi yang persis sama." }
               ].map((item, i) => (
                 <div key={i} className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-sm">
                   <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center mb-6">
                     <XCircle className="w-5 h-5 text-red-600 dark:text-red-500" />
                   </div>
                   <h3 className="text-xl font-bold text-slate-800 dark:text-slate-300 mb-3">{item.title}</h3>
                   <p className="text-slate-600 dark:text-slate-500">{item.desc}</p>
                 </div>
               ))}
            </motion.div>
          ) : (
            <motion.div
              key="snbtai"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ type: 'spring', bounce: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
               {[
                 { title: "Generate Tanpa Batas", desc: "AI membuat soal baru secara dinamis setiap kali kamu butuh." },
                 { title: "Tutor Interaktif", desc: "Minta AI jelaskan dengan cara berbeda kalau kamu masih bingung." },
                 { title: "Super Adaptif", desc: "Kurikulum otomatis menyesuaikan dengan kelemahan utamamu." },
                 { title: "Sistem Manajemen Habit", desc: "Bukan sekadar latihan, tapi membangun kebiasaan progresif." }
               ].map((item, i) => (
                 <div key={i} className="bg-indigo-50 dark:bg-indigo-600/10 border border-indigo-200 dark:border-indigo-500/20 p-8 rounded-3xl relative overflow-hidden group shadow-sm">
                   <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 dark:from-indigo-500/5 to-purple-100 dark:to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                   <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center mb-6 relative z-10">
                     <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                   </div>
                   <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 relative z-10">{item.title}</h3>
                   <p className="text-slate-700 dark:text-slate-400 relative z-10">{item.desc}</p>
                 </div>
               ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
