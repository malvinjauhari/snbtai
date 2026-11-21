import { motion } from 'framer-motion';
import { Search, MapPin, Star, Filter, ArrowRight, BookOpen, Users } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/src/lib/utils';

export default function PTNPediaPage() {
  const [search, setSearch] = useState('');

  const mockPTN = [
    { name: 'Universitas Indonesia (UI)', location: 'Depok, Jawa Barat', accreditation: 'Unggul', favorite: 'Kedokteran, Hukum', color: 'bg-yellow-400' },
    { name: 'Institut Teknologi Bandung (ITB)', location: 'Bandung, Jawa Barat', accreditation: 'Unggul', favorite: 'STEI, FTTM', color: 'bg-blue-600' },
    { name: 'Universitas Gadjah Mada (UGM)', location: 'Sleman, DI Yogyakarta', accreditation: 'Unggul', favorite: 'Kedokteran, Psikologi', color: 'bg-blue-900' },
    { name: 'Universitas Airlangga (UNAIR)', location: 'Surabaya, Jawa Timur', accreditation: 'Unggul', favorite: 'Kedokteran, Farmasi', color: 'bg-blue-400' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <div className="text-center space-y-4">
         <h2 className="text-4xl font-bold">PTN Pedia 🏛️</h2>
         <p className="text-slate-400 max-w-2xl mx-auto">Riset kampus impian lu, cek daya tampung, dan bandingin prodi biar nggak salah langkah.</p>
      </div>

      <div className="flex justify-center">
         <div className="w-full max-w-2xl glass flex items-center px-6 py-4 rounded-2xl border-white/10 shadow-2xl">
            <Search className="w-5 h-5 text-slate-500 mr-4" />
            <input 
              type="text" 
              placeholder="Cari universitas atau program studi..." 
              className="bg-transparent border-none outline-none flex-1 py-1"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="premium-button !py-2 !px-6 text-sm">Cari</button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {mockPTN.map((ptn, i) => (
           <motion.div
             key={i}
             whileHover={{ scale: 1.02 }}
             className="glass-card group overflow-hidden p-0"
           >
             <div className="p-8 space-y-6">
                <div className="flex justify-between items-start">
                   <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-2xl text-white shadow-xl", ptn.color)}>
                      {ptn.name.split(' ')[0][0]}
                   </div>
                   <div className="flex items-center gap-1 text-yellow-500 font-bold text-sm">
                      <Star className="w-4 h-4 fill-current" /> {ptn.accreditation}
                   </div>
                </div>

                <div>
                   <h3 className="text-2xl font-bold group-hover:text-blue-400 transition-colors">{ptn.name}</h3>
                   <div className="flex items-center gap-2 text-slate-400 text-sm mt-1">
                      <MapPin className="w-4 h-4" /> {ptn.location}
                   </div>
                </div>

                <div className="space-y-3">
                   <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Prodi Terfavorit</p>
                   <div className="flex flex-wrap gap-2">
                      {ptn.favorite.split(', ').map(f => (
                        <span key={f} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300">{f}</span>
                      ))}
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-2 border-t border-white/5">
                <button className="py-4 text-xs font-bold uppercase tracking-widest text-slate-500 border-r border-white/5 hover:bg-white/5 hover:text-white transition-all">
                  Daya Tampung
                </button>
                <button className="py-4 text-xs font-bold uppercase tracking-widest text-blue-400 hover:bg-blue-600 hover:text-white transition-all">
                  Lihat Detail
                </button>
             </div>
           </motion.div>
         ))}
      </div>

      {/* Compare Feature Prompt */}
      <div className="glass-card bg-gradient-to-r from-blue-600/10 to-indigo-600/10 flex flex-col md:flex-row items-center justify-between gap-8 p-10 border-blue-500/20">
         <div className="space-y-2">
            <h4 className="text-2xl font-bold">Bingung mau pilih yang mana?</h4>
            <p className="text-slate-400">Bandingin 2 prodi sekaligus buat liat peluang kelulusan lu.</p>
         </div>
         <button className="premium-button flex items-center gap-2 whitespace-nowrap">
            Compare Prodi <ArrowRight className="w-4 h-4" />
         </button>
      </div>
    </div>
  );
}
