import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Cpu, FileText } from 'lucide-react';

export default function ChatbotSection() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const timer = setInterval(() => {
          setStep(s => {
             if (s >= 4) { clearInterval(timer); return 4; }
             return s + 1;
          });
        }, 1500);
        return () => clearInterval(timer);
      }
    }, { threshold: 0.5 });
    
    const element = document.getElementById('chat-simulator');
    if (element) observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <div>
        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6 border border-indigo-200 dark:border-indigo-500/30">
          <MessageSquare className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
          Curhat dulu. <br/> <span className="text-slate-500 dark:text-slate-400">Belajar kemudian.</span>
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
          AI kami bukan sekadar mesin pembuat soal. Ceritakan kelemahanmu, dan biarkan sistem merancang materi yang presisi untuk menutup celah tersebut.
        </p>
      </div>

      <div id="chat-simulator" className="p-4 md:p-8 premium-card rounded-[2rem] shrink-0 flex flex-col gap-4 shadow-xl dark:shadow-2xl relative min-h-[400px]">
        {/* Skeleton Loader State */}
        <AnimatePresence mode="popLayout">
          {step === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex justify-end"
            >
              <div className="w-2/3 h-16 bg-slate-100 dark:bg-slate-800/50 rounded-xl rounded-tr-none animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 1: User */}
        <AnimatePresence mode="popLayout">
          {step >= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-indigo-600 text-white shadow-lg p-4 rounded-xl rounded-tr-none ml-auto max-w-[80%]"
            >
              "Gue ngerasa lemah banget di Penalaran Matematika, terutama soal waktu 🥲"
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 2: AI Loading */}
        <AnimatePresence>
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 p-4 rounded-xl rounded-tl-none mr-auto max-w-[80%] flex items-center gap-3 text-slate-600 dark:text-slate-400 shadow-sm"
            >
              <Cpu className="w-4 h-4 animate-spin text-indigo-600 dark:text-indigo-400" />
              <span className="text-sm">Merancang simulasi PM...</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 3 & 4: Answer */}
        <AnimatePresence>
          {step >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 p-5 rounded-2xl mr-auto max-w-[90%] flex flex-col gap-4 shadow-lg"
            >
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center shrink-0">
                  <Cpu className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-700 dark:text-slate-200 mb-4 leading-relaxed tracking-wide">
                    Tenang aja. Waktu emang musuh utama di PM. Kita latihan dari soal yang ringan dulu dengan target 1 menit/soal. Ini set latihan khusus buat kamu:
                  </p>
                  
                  {/* Step 4: Cards */}
                  {step >= 4 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col gap-3"
                    >
                      <div className="glass-panel p-3 rounded-xl flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer shadow-sm">
                         <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                         <div className="flex-1">
                           <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Latihan Kecepatan PM</h4>
                           <p className="text-xs text-slate-500">10 Soal • Fokus Manajemen Waktu</p>
                         </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
