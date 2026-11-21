import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, ArrowRight, Sparkles, BrainCircuit } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((s) => (s + 1) % 5);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative pt-24 px-6 max-w-7xl mx-auto w-full flex flex-col items-center text-center">
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[80%] h-96 hero-spotlight pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="max-w-4xl flex flex-col items-center relative z-10"
      >
        <span className="px-4 py-2 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-indigo-600 dark:text-indigo-400 text-sm font-black mb-8 glass-panel shadow-sm">
          Platform Belajar SNBT #1
        </span>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 leading-tight">
          Ubah gaya belajarmu dengan cara yang lebih <span className="text-gradient-premium font-black">seru.</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl leading-relaxed font-medium">
          Tulis atau rekam keresahanmu lalu AI mengubahnya menjadi soal SNBT dan panduan belajar.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Link to="/auth/login">
            <button className="px-8 py-4 rounded-full btn-premium font-black hover:scale-105 transition-all text-sm md:text-base">
              Mulai Belajar Gratis
            </button>
          </Link>
          <a href="#how-it-works" className="px-8 py-4 rounded-full glass-panel hover:bg-slate-200 dark:hover:bg-white/10 text-slate-900 dark:text-white font-bold transition-all flex items-center gap-2 text-sm md:text-base shadow-sm">
            Lihat Cara Kerjanya <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </motion.div>

      {/* Interactive Simulation Visual */}
      <div id="how-it-works" className="mt-24 w-full max-w-3xl glass-panel rounded-[2rem] p-6 md:p-10 shadow-2xl relative overflow-hidden">
        {/* Background glow for the mock interface */}
        <div className="absolute top-[-50%] right-[-50%] w-[200%] h-[200%] glow-indigo pointer-events-none" />
        
        <div className="flex flex-col gap-6 min-h-[320px] relative z-10">
          {/* Skeleton Loader State */}
          <AnimatePresence mode="popLayout">
            {step === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full flex flex-col gap-4 items-end"
              >
                  <div className="w-1/2 h-14 premium-skeleton rounded-[1rem]" />
                  <div className="w-full flex gap-4 mt-6">
                     <div className="flex-1 h-32 premium-skeleton rounded-[1rem]" />
                     <div className="flex-1 h-32 premium-skeleton rounded-[1rem]" />
                  </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* User Input Bubble */}
          <AnimatePresence mode="popLayout">
            {step >= 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                className="self-end bg-indigo-600 text-white p-4 rounded-2xl rounded-tr-sm max-w-[80%] flex items-center gap-3 shadow-lg"
              >
                <div className="flex gap-1 items-center h-4">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: ['4px', '16px', '4px'] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                      className="w-1 bg-white/70 rounded-full"
                    />
                  ))}
                </div>
                <span className="font-medium text-sm md:text-base">"Gue sering panik lihat soal Penalaran Matematika"</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* AI Processing Bubble */}
          <AnimatePresence mode="popLayout">
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="self-start premium-card text-slate-900 dark:text-white p-4 rounded-[1rem] rounded-tl-sm flex items-center gap-3"
              >
                <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 animate-pulse" />
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Merancang sistem belajar...</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Generated Result */}
          <AnimatePresence mode="popLayout">
            {step >= 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="self-start w-full grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {/* Generated Question Card */}
                <div className="premium-card p-5 rounded-[1.5rem] relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-3 relative z-10">
                    <BrainCircuit className="w-4 h-4" />
                    <span className="text-xs font-bold tracking-wider">LATIHAN PM</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-200 text-sm mb-4 font-medium leading-relaxed relative z-10">
                    Sebuah pabrik menghasilkan $x$ unit barang. Biaya produksi: $C(x) = x^2 + 50x + 1000$. Jika harga jual...
                  </p>
                  <div className="w-full h-8 premium-skeleton rounded-lg relative z-10" />
                </div>

                {/* Recommendation Card */}
                <div className="premium-card p-5 rounded-[1.5rem] flex flex-col justify-between">
                  <div>
                     <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-400/10 px-2 py-1 rounded-md">Rekomendasi</span>
                     </div>
                     <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">Fokus ke pemahaman konsep limit dan fungsi kuadrat sebelum ke kalkulus.</p>
                  </div>
                  <button className="mt-4 w-full py-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 rounded-lg text-xs font-semibold transition-colors text-slate-900 dark:text-white">
                    Lihat Pembahasan Lengkap
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
