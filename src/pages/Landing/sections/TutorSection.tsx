import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'motion/react';
import { ScanSearch, Image as ImageIcon, LineChart, ChevronDown } from 'lucide-react';

export default function TutorSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (isInView) {
      setTimeout(() => setPhase(1), 1000); // Image uploaded
      setTimeout(() => setPhase(2), 2500); // Scan complete -> Question expands
      setTimeout(() => setPhase(3), 4000); // Explanation reveals
    }
  }, [isInView]);

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <div className="order-2 lg:order-1 relative h-[500px] w-full flex items-center p-8 premium-card rounded-[2rem] shadow-2xl overflow-hidden" ref={ref}>
        {/* Abstract Background pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }} />

        {/* The Phone/Simulation Container */}
        <div className="relative w-full max-w-sm mx-auto bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[2rem] shadow-2xl h-full flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-slate-200 dark:border-white/5 flex gap-2 items-center">
             <div className="w-2 h-2 rounded-full bg-red-400" />
             <div className="w-2 h-2 rounded-full bg-amber-400" />
             <div className="w-2 h-2 rounded-full bg-emerald-400" />
             <span className="text-xs text-slate-500 ml-2 font-mono">ocr_solver.js</span>
          </div>

          <div className="flex-1 p-4 overflow-y-auto custom-scrollbar flex flex-col gap-4">
             {/* Phase 0 & 1: Uploading Image */}
             <motion.div 
               className="relative border-2 border-dashed border-slate-300 dark:border-white/10 rounded-xl bg-white dark:bg-white/5 h-32 flex items-center justify-center overflow-hidden"
             >
               {phase === 0 ? (
                 <ImageIcon className="w-8 h-8 text-slate-600" />
               ) : (
                 <>
                   <span className="text-xs text-slate-400 font-mono">foto_soal_matematika.jpg</span>
                   {phase === 1 && (
                     <motion.div 
                       initial={{ top: 0 }}
                       animate={{ top: "100%" }}
                       transition={{ duration: 1.5, repeat: Infinity }}
                       className="absolute left-0 right-0 h-1 bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,1)] z-10"
                     />
                   )}
                 </>
               )}
             </motion.div>

             {/* Phase 2: Parsed Question */}
             {phase === 1 && (
               <motion.div
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="flex flex-col gap-2"
               >
                 <div className="w-3/4 h-8 bg-slate-200 dark:bg-slate-800/50 rounded-lg animate-pulse" />
               </motion.div>
             )}
             
             {phase >= 2 && (
               <motion.div
                 initial={{ opacity: 0, height: 0 }}
                 animate={{ opacity: 1, height: 'auto' }}
                 className="bg-indigo-50 dark:bg-indigo-600/10 border border-indigo-200 dark:border-indigo-500/20 p-3 rounded-xl"
               >
                 <p className="text-xs text-indigo-700 dark:text-indigo-200 font-mono leading-relaxed">
                   diketahui f(x) = 2x + 5, nilai f(3)...<br/>
                 </p>
               </motion.div>
             )}

             {/* Phase 3: Step explanation */}
             {phase === 2 && (
               <motion.div
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="flex flex-col gap-3 mt-2"
               >
                 <div className="w-full h-16 bg-slate-200 dark:bg-slate-800/40 rounded-lg animate-pulse" />
                 <div className="w-full h-16 bg-slate-200 dark:bg-slate-800/40 rounded-lg animate-pulse" />
               </motion.div>
             )}
             
             {phase >= 3 && (
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="flex flex-col gap-3"
               >
                 <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-white/5 shadow-sm">
                   <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Langkah 1:</div>
                   <p className="text-sm font-medium text-slate-900 dark:text-white">Ganti nilai x dengan 3 ke dalam fungsi.</p>
                 </div>
                 <div className="bg-slate-800 p-3 rounded-lg border border-white/5">
                   <div className="text-xs text-slate-400 mb-1">Langkah 2:</div>
                   <p className="text-sm font-medium text-white">f(3) = 2(3) + 5</p>
                 </div>
                 <div className="bg-emerald-50 dark:bg-emerald-500/10 p-3 rounded-lg border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-sm shadow-sm">
                   Jawaban: 11
                 </div>
               </motion.div>
             )}
          </div>
        </div>
      </div>

      <div className="order-1 lg:order-2">
        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 border border-purple-200 dark:border-purple-500/30">
          <ScanSearch className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6">
          AI yang ngajarin <span className="text-slate-500 dark:text-slate-400">cara mikir.</span>
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
          Foto soal yang bikin kamu mentok, sistem akan memecahnya menjadi langkah-langkah logika yang mudah dipahami.
        </p>
        <ul className="flex flex-col gap-3 text-slate-700 dark:text-slate-300 font-medium">
          <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-500 dark:bg-purple-400"/> Bukan sekadar ngasih kunci jawaban</li>
          <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-500 dark:bg-purple-400"/> Pembahasan runtut step-by-step</li>
          <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-500 dark:bg-purple-400"/> Support LaTeX untuk Math</li>
        </ul>
      </div>
    </section>
  );
}
