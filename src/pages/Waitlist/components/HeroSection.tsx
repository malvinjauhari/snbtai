import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';
import CounterBadge from './CounterBadge';

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden flex flex-col items-center justify-center text-center px-6">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10"
      >
        <CounterBadge />
        
        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-6 mt-8">
          The Future of <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
            SNBT Learning.
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 font-medium">
          Kami sedang membangun ulang cara pejuang PTN belajar. Lebih pintar, lebih personal, dan sepenuhnya ditenagai oleh kecerdasan buatan. Dapatkan akses lebih awal sebelum peluncuran publik.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <a href="#waitlist-form">
            <button className="px-8 py-4 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-black transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(79,70,229,0.3)] flex items-center gap-2">
              Join the Waitlist <ArrowRight className="w-5 h-5" />
            </button>
          </a>
          <a href="#preview">
            <button className="px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 text-white font-bold transition-all flex items-center gap-2 border border-white/10">
              Lihat Preview <Sparkles className="w-5 h-5 text-indigo-400" />
            </button>
          </a>
        </div>
      </motion.div>
    </section>
  );
}
