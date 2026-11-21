import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'motion/react';
import { Layers, Zap, PenTool } from 'lucide-react';

export default function QuestionsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (isInView) {
      setTimeout(() => setPhase(1), 1000); // Select Category
      setTimeout(() => setPhase(2), 2000); // Generate Math Q
      setTimeout(() => setPhase(3), 3500); // Show Answer
    }
  }, [isInView]);

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto w-full flex flex-col items-center">
      <div className="text-center mb-16 max-w-2xl">
         <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-200 dark:border-emerald-500/30">
          <Layers className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6">
          Latihan yang <span className="text-slate-500 dark:text-slate-400">terasa relevan.</span>
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
          AI memastikan setiap pertanyaan dirancang sesuai format ujian terbaru, mencegah kamu belajar materi yang sudah usang.
        </p>
      </div>

      <div className="w-full max-w-3xl glass-panel rounded-[2rem] p-6 md:p-10 shadow-2xl relative overflow-hidden" ref={ref}>
        {/* Background Accent */}
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] glow-emerald pointer-events-none" />

        <div className="flex flex-col gap-6 relative z-10">
          {/* Phase 0 & 1: Selection */}
          <div className="flex gap-4">
             {['PK', 'PM', 'PBM', 'LBI', 'LBE', 'PPU', 'PU'].map((sub, i) => (
                <div 
                  key={sub}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-500 flex-shrink-0 ${
                    phase >= 1 && sub === 'PM' 
                      ? 'bg-emerald-600 dark:bg-emerald-500 text-white shadow-lg dark:shadow-[0_0_20px_rgba(16,185,129,0.4)] transform scale-110' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {sub}
                </div>
             ))}
          </div>

          <AnimatePresence mode="popLayout">
            {phase === 0 && (
               <motion.div
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="w-full h-48 bg-slate-100 dark:bg-slate-800/30 rounded-2xl animate-pulse"
               />
            )}
            {phase === 1 && (
               <motion.div
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.8 }}
                 className="flex flex-col items-center justify-center py-12 gap-4"
               >
                 <Zap className="w-8 h-8 text-emerald-500 dark:text-emerald-400 animate-pulse" />
                 <span className="text-slate-500 dark:text-slate-400 font-medium">Merancang skenario PM...</span>
               </motion.div>
            )}

            {phase >= 2 && (
               <motion.div
                 initial={{ opacity: 0, y: 30 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm"
               >
                 <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-4">
                    <PenTool className="w-5 h-5" />
                    <span className="font-bold text-sm">Target: Literasi Data</span>
                 </div>
                 <p className="text-slate-700 dark:text-slate-200 leading-relaxed mb-6">
                   Sebuah tangki air berbentuk tabung dengan jari-jari 7m dan tinggi 10m. Jika air mengalir masuk dengan kecepatan 5m³/menit, berapa lama waktu yang dibutuhkan...
                 </p>

                 {/* Options */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                    {['154 menit', '308 menit', '462 menit', '616 menit', '770 menit'].map((opt, i) => (
                      <div key={opt} className={`p-3 rounded-lg border ${phase >= 3 && i === 1 ? 'bg-emerald-50 dark:bg-emerald-500/20 border-emerald-200 dark:border-emerald-500 cursor-default' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-white/5 cursor-not-allowed'}`}>
                         <span className={phase >= 3 && i === 1 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-500 dark:text-slate-400'}>{String.fromCharCode(65+i)}. {opt}</span>
                      </div>
                    ))}
                 </div>

                 {/* Explanation Expansion */}
                 {phase >= 3 && (
                   <motion.div
                     initial={{ height: 0, opacity: 0 }}
                     animate={{ height: 'auto', opacity: 1 }}
                     className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-500/20 p-5 rounded-xl text-slate-700 dark:text-slate-300 text-sm leading-relaxed"
                   >
                     <div className="font-bold text-emerald-600 dark:text-emerald-400 mb-2">Pecahkan perlahan:</div>
                     <p className="mb-2">1. Hitung volume total tabung: V = π × r² × t = (22/7) × 7² × 10 = 1540 m³.</p>
                     <p>2. Waktu = Volume / Debit = 1540 / 5 = 308 menit.</p>
                   </motion.div>
                 )}
               </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
