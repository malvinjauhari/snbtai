import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  Rocket, 
  MessageCircle, 
  Target, 
  Trophy, 
  ShieldCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function Tutorial() {
  const navigate = useNavigate();

  const steps = [
    {
      title: "Set The Goal",
      desc: "Langkah pertama, lu tentuin dulu kampus impian lu. Ini jadi bahan bakar lu buat belajar gila-gilaan setiap hari.",
      icon: Target,
      color: "text-rose-400"
    },
    {
      title: "Chat & Curhat AI",
      desc: "Lagi stuck materi? Atau pusing diputusin pas mau UTBK? Curhatin aja. AI kita bakal dengerin dan ubah curhatan lu jadi simulasi soal yang relevan.",
      icon: MessageCircle,
      color: "text-indigo-400"
    },
    {
      title: "Hajar Simulasi Soal",
      desc: "Kerjain soal-soal hasil generate AI. Kita pake standar UTBK terbaru dengan sistem IRT biar lu tau skor asli lu gimana.",
      icon: Rocket,
      color: "text-emerald-400"
    },
    {
      title: "SNBT Battle",
      desc: "Bosen belajar sendiri? Duel lawan pejuang lain. Siapa yang paling cepet dan bener, dialah Rajanya Pejuang.",
      icon: Trophy,
      color: "text-amber-400"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-16">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500">
           How to Use.
        </h1>
        <p className="text-slate-400 font-medium">Bentar aja, biar lu nggak bingung pas masuk platform ini.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row gap-8 items-center p-8 bg-slate-900/40 border border-slate-800 rounded-[2.5rem] hover:border-slate-700 transition-all group"
          >
            <div className={`w-20 h-20 shrink-0 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform ${step.color}`}>
              <step.icon className="w-10 h-10" />
            </div>
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-2xl font-black">{step.title}</h3>
              <p className="text-slate-400 leading-relaxed font-medium">{step.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col items-center gap-6 pt-8">
         <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20 text-xs font-bold uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4" /> Ready to conquer
         </div>
         <button
           onClick={() => navigate('/chat')}
           className="px-12 py-5 bg-white text-slate-950 font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center gap-2"
         >
           Gas, Udah Paham! <Sparkles className="w-5 h-5 text-indigo-600" />
         </button>
      </div>
    </div>
  );
}
