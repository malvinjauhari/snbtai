import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'motion/react';
import { Search, GraduationCap, TrendingUp, Building2 } from 'lucide-react';

export default function PtnPediaSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (isInView) {
      setTimeout(() => setPhase(1), 800); // typing
      setTimeout(() => setPhase(2), 2000); // search
      setTimeout(() => setPhase(3), 2800); // graph
    }
  }, [isInView]);

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <div className="order-2 lg:order-1 relative p-6 glass-panel rounded-[2rem] shadow-2xl min-h-[400px]" ref={ref}>
        {/* Search Bar */}
        <div className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl p-4 flex items-center gap-3 relative z-10 shadow-sm dark:shadow-lg">
          <Search className="w-5 h-5 text-slate-500" />
          <span className="text-slate-700 dark:text-slate-300 font-medium">
            {phase >= 1 ? "Ilmu Komputer UI" : (
               <motion.span
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ repeat: Infinity, duration: 0.8 }}
                 className="inline-block w-0.5 h-5 bg-indigo-500"
               />
            )}
          </span>
        </div>

        {/* Results Area */}
        <div className="mt-6 flex flex-col gap-4">
          {phase === 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-indigo-50 dark:bg-indigo-600/5 rounded-2xl p-6 h-56 animate-pulse"
            />
          )}

          {phase >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring' }}
              className="bg-indigo-50 dark:bg-indigo-600/10 border border-indigo-200 dark:border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden shadow-sm"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Ilmu Komputer</h3>
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 text-sm">
                    <Building2 className="w-4 h-4" /> Universitas Indonesia
                  </div>
                </div>
                <div className="bg-indigo-100 dark:bg-indigo-500/20 px-3 py-1.5 rounded-lg border border-indigo-200 dark:border-indigo-500/30 font-semibold text-indigo-600 dark:text-indigo-400">
                  Sangat Ketat
                </div>
              </div>

              {/* Acceptance Graph Simulation */}
              {phase >= 3 && (
                <div className="space-y-4">
                   <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                      <span>Keketatan 2024</span>
                      <span>Target Skor</span>
                   </div>
                   <div className="flex items-end justify-between h-20 gap-2">
                      {[40, 60, 50, 80, 95].map((height, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ duration: 0.6, delay: i * 0.1 }}
                          className={`w-full rounded-t-sm ${i === 4 ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-800'}`}
                        />
                      ))}
                   </div>
                   <div className="flex items-center gap-2 mt-4 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm">
                     <TrendingUp className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> Estimasi Skor Aman: <span className="text-slate-900 dark:text-white">720+</span>
                   </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      <div className="order-1 lg:order-2">
        <div className="w-12 h-12 bg-sky-100 dark:bg-sky-500/20 rounded-2xl flex items-center justify-center mb-6 border border-sky-200 dark:border-sky-500/30">
          <GraduationCap className="w-6 h-6 text-sky-600 dark:text-sky-400" />
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6">
          Cari peluang <span className="text-slate-500 dark:text-slate-400">kampus impianmu.</span>
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
          Jangan menebak-nebak. Analisis tingkat keketatan, prediksi skor aman, dan pantau daya tampung secara logis.
        </p>
      </div>
    </section>
  );
}
