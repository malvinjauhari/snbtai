import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, BookCheck, Trophy, BrainCircuit } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function Landing() {
  return (
    <div className="relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 dark:bg-indigo-600/20 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/5 dark:bg-purple-600/10 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto px-6 pt-20 pb-32">
        {/* Hero Section */}
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="px-4 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs font-semibold tracking-widest uppercase mb-6 inline-block shadow-sm">
              Premium SNBT Preparation 2026
            </span>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-slate-900 dark:bg-clip-text dark:text-transparent dark:bg-gradient-to-b dark:from-white dark:to-slate-500 mb-8">
              Masa Depan Lu <br className="hidden md:block" /> Dimulai di Sini.
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
              Platform EdTech premium dengan dukungan AI tercanggih untuk bantu lu tembus PTN impian. 
              Ubah stres jadi ambisi, ubah mimpi jadi realita.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link
              to="/auth/login"
              className="group relative px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_10px_20px_-10px_rgba(79,70,229,0.5)] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="flex items-center gap-2">
                Mulai Berjuang Sekarang <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link
              to="/about"
              className="px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
            >
              Kenali SNBT AI
            </Link>
          </motion.div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-32">
          {[
            {
              title: "AI Question Generator",
              desc: "Buat simulasi soal sesuai lu mau dengan teknologi Gemini AI terbaru.",
              icon: BrainCircuit,
              color: "text-indigo-600 dark:text-indigo-400"
            },
            {
              title: "IRT Simulation",
              desc: "Sistem penilaian standar nasional untuk ukur kesiapan lu yang sebenarnya.",
              icon: BookCheck,
              color: "text-emerald-600 dark:text-emerald-400"
            },
            {
              title: "AI Lens OCR",
              desc: "Scan soal dari foto dan biarkan AI kita jelasin konsepnya buat lu.",
              icon: Sparkles,
              color: "text-amber-600 dark:text-amber-400"
            },
            {
              title: "SNBT Battle",
              desc: "Bertarung lawan pejuang lain buat asah mental dan kecepatan lu.",
              icon: Trophy,
              color: "text-rose-600 dark:text-rose-400"
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-8 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-3xl hover:border-indigo-500/30 transition-all hover:shadow-xl dark:hover:shadow-2xl hover:-translate-y-1 shadow-sm"
            >
              <div className={cn("w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform", feature.color)}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">{feature.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
