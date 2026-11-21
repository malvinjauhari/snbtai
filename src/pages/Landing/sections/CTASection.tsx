import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CTASection() {
  return (
    <section className="py-32 px-6 max-w-5xl mx-auto w-full flex flex-col items-center text-center relative">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-indigo-100 dark:from-indigo-900/40 to-transparent blur-3xl -z-10 rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, type: 'spring' }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-8">
          <Sparkles className="w-4 h-4" /> Mulai sekarang, taklukkan besok.
        </div>
        
        <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-8 leading-tight">
          Ubah overthinking <br className="hidden md:block" />
          <span className="text-slate-500">jadi progress.</span>
        </h2>

        <p className="text-lg text-slate-600 dark:text-slate-400 mb-12 max-w-xl mx-auto">
          Berhenti membuang waktu mencari materi. Biarkan AI merancangnya untukmu.
        </p>

        <Link to="/auth/login">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-10 py-5 bg-indigo-600 dark:bg-white text-white dark:text-slate-950 font-black text-lg rounded-full overflow-hidden shadow-lg dark:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all"
          >
            {/* Magnetic/Pulse Effect background */}
            <span className="absolute inset-0 w-full h-full bg-indigo-500 dark:bg-indigo-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative flex items-center gap-3">
              Mulai Petualangan <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </motion.button>
        </Link>
      </motion.div>
    </section>
  );
}
