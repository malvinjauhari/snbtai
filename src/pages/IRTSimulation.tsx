import { useState } from 'react';
import { motion } from 'motion/react';
import { Calculator, Info, Zap, Target, TrendingUp, Info as InfoIcon } from 'lucide-react';

export default function IRTSimulation() {
  const [numPejuang, setNumPejuang] = useState(100);
  const [difficulty, setDifficulty] = useState(3);
  const [correctAnswers, setCorrectAnswers] = useState(5);

  const calculateIRT = () => {
    // Very simplified IRT logic for demonstration
    const baseScore = correctAnswers * 100;
    const difficultyMultiplier = 1 + (difficulty - 1) * 0.2;
    const scarcityBonus = (1000 - numPejuang) / 100;
    return Math.round(baseScore * difficultyMultiplier + (scarcityBonus > 0 ? scarcityBonus : 0));
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-indigo-400">
           <Calculator className="w-8 h-8" />
           <h1 className="text-5xl font-black tracking-tight">IRT Simulation.</h1>
        </div>
        <p className="text-slate-400 font-medium text-lg max-w-2xl">
          Pahami gimana skor lu dihitung. IRT (Item Response Theory) ngehargain soal sulit yang sedikit orang bisa jawab.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls */}
        <div className="lg:col-span-2 space-y-8">
          <div className="p-8 premium-card rounded-[2.5rem] space-y-10">
            <div className="space-y-4">
               <div className="flex justify-between items-center">
                  <label className="font-bold text-slate-300">Jumlah Pejuang yang Jawab Benar</label>
                  <span className="px-3 py-1 bg-slate-800 rounded-lg font-mono font-bold text-indigo-400">{numPejuang}</span>
               </div>
               <input 
                 type="range" min="1" max="1000" 
                 value={numPejuang}
                 onChange={(e) => setNumPejuang(parseInt(e.target.value))}
                 className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
               />
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">MAKIN SEDIKIT = SKOR MAKIN TINGGI</p>
            </div>

            <div className="space-y-4">
               <div className="flex justify-between items-center">
                  <label className="font-bold text-slate-300">Tingkat Kesulitan Soal (Level)</label>
                  <span className="px-3 py-1 bg-slate-800 rounded-lg font-mono font-bold text-emerald-400">Lv. {difficulty}</span>
               </div>
               <input 
                 type="range" min="1" max="5" 
                 value={difficulty}
                 onChange={(e) => setDifficulty(parseInt(e.target.value))}
                 className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
               />
            </div>

            <div className="space-y-4">
               <div className="flex justify-between items-center">
                  <label className="font-bold text-slate-300">Jumlah Jawaban Benar Lu</label>
                  <span className="px-3 py-1 bg-slate-800 rounded-lg font-mono font-bold text-rose-400">{correctAnswers}</span>
               </div>
               <input 
                 type="range" min="0" max="20" 
                 value={correctAnswers}
                 onChange={(e) => setCorrectAnswers(parseInt(e.target.value))}
                 className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
               />
            </div>
          </div>

          <div className="p-8 glass-panel rounded-[2.5rem] flex items-start gap-4">
             <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
                <InfoIcon className="w-5 h-5 text-indigo-400" />
             </div>
             <div className="space-y-2">
                <h4 className="font-bold text-sm uppercase tracking-widest text-slate-300">Edukasi Singkat</h4>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Dalam IRT, bobot nilai tiap soal itu dinamis. Soal yang dianggap "sulit" (sedikit orang yang bener) bakal punya poin jauh lebih besar dibanding soal "cupu" (hampir semua orang bener). Jadi, jangan cuma hajar soal gampang!
                </p>
             </div>
          </div>
        </div>

        {/* Result Area */}
        <div className="space-y-8">
           <div className="p-8 bg-indigo-600 rounded-[2.5rem] text-center space-y-4 shadow-2xl shadow-indigo-600/20">
              <span className="text-sm font-bold text-white/60 uppercase tracking-widest">Estimasi Skor IRT</span>
              <motion.div 
                key={calculateIRT()}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-7xl font-black text-white"
              >
                {calculateIRT()}
              </motion.div>
              <div className="pt-4">
                <span className="px-4 py-2 bg-white/10 rounded-full text-xs font-bold text-white uppercase border border-white/20 tracking-tighter">
                  Potensi Lolos: {calculateIRT() > 700 ? 'Sangat Tinggi 🔥' : calculateIRT() > 600 ? 'Tinggi ✅' : 'Berjuang Lagi 💪'}
                </span>
              </div>
           </div>

           <div className="grid grid-cols-1 gap-4">
              {[
                { label: "Precision", val: "94%", color: "text-indigo-400", icon: Target },
                { label: "Efficiency", val: "High", color: "text-emerald-400", icon: Zap },
                { label: "Progression", val: "+12%", color: "text-rose-400", icon: TrendingUp }
              ].map((stat, i) => (
                <div key={i} className="p-6 premium-card rounded-[2rem] flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
                         <stat.icon className={`w-5 h-5 ${stat.color}`} />
                      </div>
                      <span className="text-sm font-bold text-slate-500">{stat.label}</span>
                   </div>
                   <span className="text-xl font-black">{stat.val}</span>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
