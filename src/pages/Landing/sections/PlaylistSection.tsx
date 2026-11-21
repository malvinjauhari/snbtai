import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'motion/react';
import { Youtube, Link as LinkIcon, Plus, BookOpen, ChevronRight } from 'lucide-react';

export default function PlaylistSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [nodes, setNodes] = useState<number[]>([]);

  useEffect(() => {
    if (isInView) {
      setTimeout(() => setNodes([1]), 500);
      setTimeout(() => setNodes([1, 2]), 1500);
      setTimeout(() => setNodes([1, 2, 3]), 2500);
    }
  }, [isInView]);

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto w-full flex flex-col items-center">
      <div className="text-center mb-16 max-w-2xl">
        <div className="w-12 h-12 bg-rose-100 dark:bg-rose-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-rose-200 dark:border-rose-500/30">
          <Youtube className="w-6 h-6 text-rose-600 dark:text-rose-400" />
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6">
          Belajar Youtube, <br/><span className="text-slate-500 dark:text-slate-400">tapi lebih terarah.</span>
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
          SNBT Playlist mengubah kumpulan link acak menjadi panduan belajar terstruktur yang bisa kamu ikuti dan mainkan.
        </p>
      </div>

      <div className="w-full max-w-4xl glass-panel rounded-[2rem] p-8 shadow-2xl relative overflow-hidden" ref={ref}>
        {/* Input Simulation */}
        <div className="w-full max-w-md mx-auto bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl p-2 flex items-center gap-3 mb-12 shadow-sm dark:shadow-lg">
           <LinkIcon className="w-5 h-5 text-slate-500 ml-2" />
           <span className="text-slate-500 dark:text-slate-400 text-sm font-mono truncate">youtube.com/watch?v=kalkulus</span>
           <motion.button 
             whileHover={{ scale: 1.05 }}
             className="bg-rose-600 text-white p-2 rounded-lg ml-auto"
           >
             <Plus className="w-4 h-4" />
           </motion.button>
        </div>

        {/* Playlist Nodes */}
        <div className="relative flex flex-col items-center gap-8 min-h-[300px]">
          {nodes.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-sm h-20 bg-slate-100 dark:bg-slate-800/50 rounded-2xl animate-pulse"
            />
          )}
          {nodes.map((node, i) => (
             <motion.div 
               key={node}
               initial={{ opacity: 0, scale: 0.8, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               transition={{ type: 'spring', bounce: 0.4 }}
               className="relative z-10 w-full max-w-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 p-4 rounded-2xl flex items-center gap-4 shadow-md dark:shadow-lg"
             >
                <div className="relative w-16 h-12 bg-white dark:bg-slate-950 rounded-lg flex items-center justify-center border border-slate-200 dark:border-white/5 overflow-hidden">
                   <Youtube className="w-6 h-6 text-rose-500/50" />
                   <div className="absolute inset-0 bg-gradient-to-tr from-rose-100 dark:from-rose-500/10 to-transparent" />
                </div>
                <div>
                   <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Konsep Dasar Kalkulus {i + 1}</h4>
                   <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                      <BookOpen className="w-3 h-3" /> 5 Soal Latihan Di-generate
                   </p>
                </div>
             </motion.div>
          ))}

          {/* Connection Lines */}
          {nodes.length > 1 && (
            <motion.div 
              initial={{ height: 0 }}
              animate={{ height: 'calc(100% - 80px)' }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className="absolute top-[40px] bottom-[40px] w-1 bg-gradient-to-b from-rose-500/50 to-indigo-500/50 z-0"
            />
          )}
        </div>
      </div>
    </section>
  );
}
