import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Flame, CheckCircle2, Bookmark, Activity } from 'lucide-react';

export default function HabitSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const habits = [
    { title: "Vocab Master", desc: "5 Vocab Baru", done: true },
    { title: "EYD Test", desc: "10 Soal", done: true },
    { title: "Silabus PM", desc: "Fungsi Kuadrat", done: false },
  ];

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <div>
        <div className="w-12 h-12 bg-amber-100 dark:bg-amber-500/20 rounded-2xl flex items-center justify-center mb-6 border border-amber-200 dark:border-amber-500/30">
          <Flame className="w-6 h-6 text-amber-500" />
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
          Progress kecil <br/><span className="text-slate-500 dark:text-slate-400">setiap hari.</span>
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
          Konsistensi jauh lebih penting daripada belajar ngebut semalam. Fitur Habit menjaga ritmemu tetap membara tanpa merasa burnout.
        </p>
      </div>

      <div className="relative p-6 md:p-8 glass-panel rounded-[2rem] shadow-xl overflow-hidden" ref={ref}>
         <div className="absolute top-[-50%] right-[-50%] w-[200%] h-[200%] glow-amber pointer-events-none" />
         
         <div className="flex justify-between items-center mb-8 relative z-10">
           <div>
             <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Habit Tracker</h3>
             <p className="text-sm text-slate-500 dark:text-slate-400">Target Harian</p>
           </div>
           
           {/* Streak Counter */}
           <motion.div 
             initial={{ scale: 0.8, opacity: 0 }}
             animate={isInView ? { scale: 1, opacity: 1 } : {}}
             transition={{ type: 'spring', delay: 0.2 }}
             className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full"
           >
             <Flame className="w-4 h-4 text-amber-500" />
             <span className="font-bold text-amber-500 text-sm">12 Hari</span>
           </motion.div>
         </div>

         <div className="space-y-4 relative z-10">
           {habits.map((habit, i) => (
             <motion.div
               key={i}
               initial={{ x: 50, opacity: 0 }}
               animate={isInView ? { x: 0, opacity: 1 } : {}}
               transition={{ delay: 0.3 + (i * 0.1), type: 'spring' }}
               className={`flex items-center justify-between p-4 rounded-2xl border ${habit.done ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/20' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-white/5'}`}
             >
               <div className="flex items-center gap-4">
                 <div className={`p-2 rounded-full ${habit.done ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'}`}>
                   {habit.done ? <CheckCircle2 className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
                 </div>
                 <div>
                   <h4 className={`text-sm font-semibold ${habit.done ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>{habit.title}</h4>
                   <p className="text-xs text-slate-500">{habit.desc}</p>
                 </div>
               </div>
             </motion.div>
           ))}
         </div>

         {/* Wishlist Hint */}
         <motion.div
           initial={{ y: 20, opacity: 0 }}
           animate={isInView ? { y: 0, opacity: 1 } : {}}
           transition={{ delay: 0.8 }}
           className="mt-6 flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-2xl"
         >
           <div className="flex items-center gap-3">
             <Bookmark className="w-5 h-5 text-purple-600 dark:text-purple-400" />
             <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Wishlist Soal Sulit</span>
           </div>
           <span className="text-xs font-bold bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded-md text-slate-700 dark:text-slate-300">24 Soal</span>
         </motion.div>
      </div>
    </section>
  );
}
