import { motion } from 'framer-motion';
import { Target, Zap, AlertCircle, TrendingUp, Info } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/src/lib/utils';

export default function IRTSimulationPage() {
  const [scores, setScores] = useState({
    pu: 15,
    pbm: 12,
    ppu: 10,
    lbia: 18,
    lbie: 14,
    pk: 8,
    pm: 9
  });

  const subtests = [
    { id: 'pu', label: 'Penalaran Umum', max: 30 },
    { id: 'pbm', label: 'PBM', max: 20 },
    { id: 'ppu', label: 'PPU', max: 20 },
    { id: 'pk', label: 'Pengetahuan Kuantitatif', max: 15 },
    { id: 'lbia', label: 'Literasi B. Indonesia', max: 30 },
    { id: 'lbie', label: 'Literasi B. Inggris', max: 20 },
    { id: 'pm', label: 'Penalaran Matematika', max: 20 },
  ];

  const calculateIRT = () => {
    // Highly simplified mock IRT logic
    const base = Object.values(scores).reduce((a, b) => a + b, 0);
    const multiplier = 22; // Mock scaling
    return Math.min(1000, Math.floor(base * multiplier + 200));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24">
      <div className="space-y-4">
         <h2 className="text-3xl font-bold">Simulasi Sistem IRT ⚖️</h2>
         <p className="text-slate-400">Masukkan jumlah jawaban benar lu di setiap subtes untuk melihat estimasi skor akhir UTBK dengan sistem Item Response Theory.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
         {/* Input Section */}
         <div className="space-y-6">
            <div className="glass-card space-y-6">
               <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                 <Target className="w-4 h-4" /> Input Benar per Subtes
               </h3>
               
               <div className="space-y-4">
                  {subtests.map(sub => (
                    <div key={sub.id} className="space-y-2">
                       <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-300">{sub.label}</span>
                          <span className="text-blue-400">{scores[sub.id as keyof typeof scores]} / {sub.max}</span>
                       </div>
                       <input 
                         type="range" 
                         min="0" 
                         max={sub.max} 
                         value={scores[sub.id as keyof typeof scores]} 
                         onChange={(e) => setScores(prev => ({ ...prev, [sub.id]: parseInt(e.target.value) }))}
                         className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-blue-500"
                       />
                    </div>
                  ))}
               </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex gap-4">
               <Info className="w-5 h-5 text-blue-400 shrink-0" />
               <p className="text-xs text-slate-400 leading-relaxed">
                 Sistem IRT SNBT AI menggunakan bobot tingkat kesulitan soal berdasarkan database soal kami yang dikerjakan oleh ribuan user lainnya.
               </p>
            </div>
         </div>

         {/* Result Section */}
         <div className="space-y-8">
            <div className="glass-card text-center p-12 relative overflow-hidden">
               <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600" />
               <Zap className="w-12 h-12 text-yellow-500 mx-auto mb-6" />
               <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Estimasi Skor UTBK Lu</p>
               <motion.h4 
                 key={calculateIRT()}
                 initial={{ scale: 0.8, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 className="text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500"
               >
                 {calculateIRT()}
               </motion.h4>
               <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Peluang Lulus</p>
                    <p className="text-emerald-500 font-bold">Tinggi (82%)</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Status PTN</p>
                    <p className="text-blue-400 font-bold italic">Aman Jaya</p>
                  </div>
               </div>
            </div>

            <div className="glass-card space-y-6">
               <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                 <TrendingUp className="w-4 h-4" /> Analisis Kekuatan
               </h3>
               <div className="space-y-3">
                  <div className="flex items-center gap-4 text-sm">
                     <div className="w-2 h-2 rounded-full bg-emerald-500" />
                     <span className="flex-1">Literasi Bahasa Indonesia lu udah di atas rata-rata nasional.</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                     <div className="w-2 h-2 rounded-full bg-yellow-500" />
                     <span className="flex-1">Pengetahuan Kuantitatif masih butuh asupan soal HOTS lagi.</span>
                  </div>
               </div>
               <button className="w-full secondary-button text-xs font-bold uppercase tracking-widest">
                  Download Laporan Lengkap (.PDF)
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
