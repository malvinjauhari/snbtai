import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export const GenerateBanner: React.FC = () => {
  return (
    <div className="p-8 bg-indigo-600 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-indigo-600/20 overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000" />
        <div className="relative z-10 space-y-2">
           <h3 className="text-3xl font-black text-white">Generate Sekarang!</h3>
           <p className="text-white/70 font-medium">Bikin soal kustom sesuai mood belajar lu hari ini.</p>
        </div>
        <Link to="/chat" className="px-10 py-5 bg-white text-indigo-600 font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl relative z-10 flex items-center gap-2">
          AI Magic <Sparkles className="w-5 h-5" />
        </Link>
    </div>
  );
};
