import React from 'react';
import { X, BookOpen, AlertCircle } from 'lucide-react';

interface InfoModalProps {
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
              <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Keterangan Metrik</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-all">
            <X className="w-6 h-6 text-slate-400 dark:text-slate-500" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-white/5 space-y-2 border-l-4 border-l-orange-500">
            <h4 className="text-xs font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest">Rasio Keketatan</h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Perbandingan 1 kursi berbanding jumlah peminat. 
              <span className="text-slate-900 dark:text-white font-medium ml-1">Makin besar angka pomnya, makin ketat persaingan.</span>
            </p>
          </div>
          <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-white/5 space-y-2 border-l-4 border-l-indigo-500">
            <h4 className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Peluang Diterima</h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Estimasi kemungkinan diterima berdasarkan persentase. Rumus: <code className="bg-slate-200 dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 px-1.5 py-0.5 rounded ml-1 text-xs font-mono">(Kuota / Peminat) × 100%</code>
            </p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-slate-50/50 dark:bg-slate-900/50 rounded-xl">
            <AlertCircle size={16} className="text-slate-400 dark:text-slate-500 mt-0.5 flex-shrink-0" />
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-snug">Data bersumber dari basis data resmi seleksi nasional penerimaan mahasiswa baru tahun sebelumnya.</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-4 bg-indigo-600 text-white font-black text-sm uppercase tracking-wider rounded-xl hover:bg-indigo-500 active:scale-[0.98] transition-all shadow-lg shadow-indigo-600/20"
        >
          Tutup Informasi
        </button>
      </div>
    </div>
  );
};
