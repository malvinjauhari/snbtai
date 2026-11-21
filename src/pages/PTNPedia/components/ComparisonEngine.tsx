import React from 'react';
import { Search, Loader, BarChart3, MapPin } from 'lucide-react';
import { Program } from '../types';

interface ComparisonEngineProps {
  compareProdiName: string;
  setCompareProdiName: (name: string) => void;
  handleCompareProdi: () => void;
  compareResults: Program[];
  sortedCompareResults: Program[];
  compareSortBy: string;
  setCompareSortBy: (sort: string) => void;
  loading: boolean;
}

export const ComparisonEngine: React.FC<ComparisonEngineProps> = ({
  compareProdiName,
  setCompareProdiName,
  handleCompareProdi,
  compareResults,
  sortedCompareResults,
  compareSortBy,
  setCompareSortBy,
  loading
}) => {
  return (
    <div className="flex-1 flex flex-col p-6 lg:p-12 space-y-8 overflow-hidden max-w-6xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Bandingkan nama prodi (Contoh: Informatika)..."
            value={compareProdiName}
            onChange={(e) => setCompareProdiName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCompareProdi()}
            className="w-full pl-14 pr-6 py-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 focus:border-indigo-500/50 outline-none text-slate-900 dark:text-white shadow-xl transition-colors font-medium"
          />
        </div>
        <button
          onClick={handleCompareProdi}
          disabled={loading || !compareProdiName.trim()}
          className="px-8 py-4 sm:py-0 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 disabled:opacity-50 disabled:hover:bg-indigo-600"
        >
          {loading ? <Loader className="animate-spin mx-auto" size={18} /> : 'Analisis'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {compareResults.length > 0 ? (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
              <h3 className="text-xl font-medium text-slate-900 dark:text-white flex items-center gap-3">
                Hasil Analisis
                <span className="px-3 py-1 bg-indigo-500/10 text-indigo-600 dark:text-slate-300 text-xs font-black rounded-lg">{compareResults.length} Prodi</span>
              </h3>
              <select
                value={compareSortBy}
                onChange={(e) => setCompareSortBy(e.target.value)}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-xs font-bold px-4 py-2.5 rounded-xl outline-none focus:border-indigo-500/50 appearance-none shadow-sm"
              >
                <option value="ratio-asc">Urutkan: Rasio Terendah</option>
                <option value="ratio-desc">Urutkan: Rasio Tertinggi</option>
                <option value="chance-desc">Urutkan: Peluang Tertinggi</option>
                <option value="capacity-desc">Urutkan: Kuota Terbanyak</option>
              </select>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {sortedCompareResults.map((prog, idx) => (
                <div key={idx} className="p-5 lg:p-6 bg-white dark:bg-slate-900/80 border border-slate-100 dark:border-white/5 hover:border-indigo-500/30 dark:hover:border-white/10 rounded-2xl transition-all group shadow-sm">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black rounded-md uppercase tracking-wider">{prog.jenjang || 'S1'} | {prog.universityCode}</span>
                      </div>
                      <h4 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{prog.name}</h4>
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium">
                        <MapPin size={16} className="text-indigo-500/70" />
                        <span>{prog.universityName}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4 w-full lg:w-auto">
                      <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-white/5 flex flex-col justify-center min-w-[100px]">
                        <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Kuota</div>
                        <div className="text-xl font-bold text-slate-900 dark:text-white">{prog.capacity}</div>
                      </div>
                      <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-white/5 flex flex-col justify-center min-w-[100px]">
                        <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Peminat</div>
                        <div className="text-xl font-bold text-slate-600 dark:text-slate-300">{prog.applicants}</div>
                      </div>
                      <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-white/5 flex flex-col justify-center min-w-[100px]">
                        <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Rasio</div>
                        <div className="text-xl font-bold text-orange-500 dark:text-orange-400">1:{prog.ratio}</div>
                      </div>
                      <div className="p-4 bg-indigo-600 rounded-xl flex flex-col justify-center min-w-[110px] shadow-lg shadow-indigo-600/20">
                        <div className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-1">Peluang</div>
                        <div className="text-xl font-black text-white">{prog.admissionChance}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          !loading && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-60">
              <div className="w-24 h-24 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center">
                <BarChart3 size={48} className="text-slate-300 dark:text-slate-600" />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-medium text-slate-900 dark:text-white">Mulai Bandingkan</h4>
                <p className="font-normal text-slate-500 dark:text-slate-400 max-w-sm">Masukkan nama program studi untuk membandingkan statistik keketatan dan daya tampung antar PTN.</p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};
