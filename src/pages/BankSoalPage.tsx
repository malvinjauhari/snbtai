import { motion } from 'framer-motion';
import { Search, Filter, BookOpen, Clock, ChevronRight, Bookmark } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/src/lib/utils';
import { useNavigate } from 'react-router-dom';

const categories = ['All', 'Penalaran Umum', 'Penalaran Matematika', 'Literasi BI', 'Literasi BE', 'PPU', 'PBM'];

export default function BankSoalPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const navigate = useNavigate();

  const mockSoal = [
    { id: 'mat-001', code: 'PM-HOTS-01', subtest: 'Penalaran Matematika', title: 'Matriks & Transformasi Geometri', count: 15, time: '2026-05-08' },
    { id: 'bi-002', code: 'LBI-NAR-02', subtest: 'Literasi BI', title: 'Analisis Paragraf Eksposisi', count: 20, time: '2026-05-07' },
    { id: 'pp-003', code: 'PPU-VOC-03', subtest: 'PPU', title: 'Sinonim & Antonim Contextual', count: 25, time: '2026-05-06' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h2 className="text-3xl font-bold mb-2">Bank Soal 📚</h2>
           <p className="text-slate-400">Pilih paket soal buat uji mental lu hari ini.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
         <div className="flex-1 glass flex items-center px-4 py-2 rounded-2xl border-white/10 group focus-within:border-blue-500/50 transition-all">
            <Search className="w-5 h-5 text-slate-500 group-focus-within:text-blue-400" />
            <input 
              type="text" 
              placeholder="Cari kode soal atau topik..." 
              className="bg-transparent border-none outline-none flex-1 px-4 py-2 text-sm"
            />
         </div>
         <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-4 py-2.5 rounded-xl border transition-all text-xs font-bold whitespace-nowrap",
                  activeCategory === cat 
                    ? "bg-blue-600 border-blue-400 text-white" 
                    : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20"
                )}
              >
                {cat}
              </button>
            ))}
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {mockSoal.map((soal) => (
           <motion.div
             key={soal.id}
             whileHover={{ y: -5 }}
             className="glass-card group relative p-0 overflow-hidden flex flex-col"
           >
             <div className="p-6 space-y-4 flex-1">
                <div className="flex justify-between items-start">
                   <div className="px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                      {soal.code}
                   </div>
                   <button className="text-slate-500 hover:text-blue-400 transition-colors">
                      <Bookmark className="w-4 h-4" />
                   </button>
                </div>
                
                <div>
                   <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">{soal.subtest}</p>
                   <h4 className="text-lg font-bold group-hover:text-blue-400 transition-colors">{soal.title}</h4>
                </div>

                <div className="flex items-center gap-6 pt-2">
                   <div className="flex items-center gap-2 text-xs text-slate-400">
                      <BookOpen className="w-4 h-4" /> {soal.count} Soal
                   </div>
                   <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Clock className="w-4 h-4" /> 30m
                   </div>
                </div>
             </div>
             
             <button 
               onClick={() => navigate(`/question/${soal.id}`)}
               className="w-full bg-white/5 border-t border-white/5 py-4 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest group-hover:bg-blue-600 transition-all group-hover:text-white"
             >
                Mulai Kerjain <ChevronRight className="w-4 h-4" />
             </button>
           </motion.div>
         ))}
      </div>
    </div>
  );
}
