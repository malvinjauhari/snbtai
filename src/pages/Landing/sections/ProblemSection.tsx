import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Frown, ListX, MonitorPlay, Smartphone } from 'lucide-react';

const problems = [
  { icon: ListX, text: "Bingung mulai dari mana", delay: 0 },
  { icon: Frown, text: "Terlalu banyak materi", delay: 0.1 },
  { icon: MonitorPlay, text: "Nonton Youtube tanpa arah", delay: 0.2 },
  { icon: Smartphone, text: "Overthinking lalu doomscrolling", delay: 0.3 }
];

export default function ProblemSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const yTransform = useTransform(scrollYProgress, [0, 0.5], [100, 0]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <section ref={containerRef} className="py-24 px-6 w-full max-w-6xl mx-auto flex flex-col items-center text-center">
      <motion.div style={{ y: yTransform, opacity: opacityTransform }}>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-16 tracking-tight">
          Belajar SNBT sering gagal <br className="hidden md:block"/> <span className="text-slate-500">bukan karena malas.</span>
        </h2>
      </motion.div>

      <div className="relative w-full flex flex-col items-center gap-6">
        <div className="flex flex-col md:flex-row gap-4 w-full justify-center flex-wrap">
          {problems.map((prob, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50, rotate: -5 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: prob.delay, type: 'spring', bounce: 0.4 }}
              className="premium-card p-6 rounded-[1.5rem] flex items-center gap-4 flex-1 min-w-[250px] max-w-[300px]"
            >
              <div className="p-3 bg-red-50 dark:bg-red-500/10 rounded-xl text-red-500 dark:text-red-400">
                <prob.icon className="w-6 h-6" />
              </div>
              <span className="font-semibold text-slate-700 dark:text-slate-300 text-sm text-left">{prob.text}</span>
            </motion.div>
          ))}
        </div>

        {/* The Solution Transition */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.6 }}
           className="mt-16 w-full max-w-4xl flex flex-col items-center justify-center text-center relative"
        >
           {/* Soft glow behind text */}
           <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] glow-indigo pointer-events-none" />
           <div className="relative z-10 px-6 py-12">
             <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 dark:from-white to-slate-500 dark:to-slate-400 tracking-tight leading-tight">
               SNBT AI mengubah kebingungan menjadi sistem belajar terarah.
             </h3>
           </div>
        </motion.div>
      </div>
    </section>
  );
}
