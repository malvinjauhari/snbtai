import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Building2, ShieldCheck, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { getAllPTNInsight, getPTNRegions, searchPTNInsight } from '@/src/lib/ptnpedia/ptnInsightData';

export default function PTNInsightList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRegion, setFilterRegion] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterConfidence, setFilterConfidence] = useState('all');

  const regions = useMemo(() => getPTNRegions(), []);

  const filteredPTN = useMemo(() => {
    return searchPTNInsight(searchQuery, {
      region: filterRegion,
      type: filterType,
      confidence: filterConfidence
    });
  }, [searchQuery, filterRegion, filterType, filterConfidence]);

  const renderConfidenceBadge = (confidence: string) => {
    if (confidence === 'high') {
      return <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20">Data Kuat</span>;
    }
    if (confidence === 'medium') {
      return <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold uppercase tracking-wider border border-amber-500/20">Cukup</span>;
    }
    return <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-bold uppercase tracking-wider border border-rose-500/20">Perlu Riset</span>;
  };

  return (
    <div className="w-full h-full relative animate-in fade-in duration-500 flex flex-col">
      <div className="flex-1 w-full max-w-7xl mx-auto px-1 sm:px-6 lg:px-8 py-2 flex flex-col relative z-10 shrink-0">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
           <button onClick={() => navigate('/ptnpedia')} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition-all">
             <ArrowLeft className="w-5 h-5 text-slate-500 dark:text-slate-400" />
           </button>
           <div>
             <h1 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">PTN Insight</h1>
             <p className="text-sm text-slate-500 dark:text-slate-400">Jelajahi profil lengkap kampus impianmu secara terstruktur.</p>
           </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white dark:bg-slate-900/50 p-4 lg:p-6 rounded-3xl border border-slate-200 dark:border-white/10 mb-8 shadow-sm flex flex-col lg:flex-row gap-4">
           {/* Search */}
           <div className="relative flex-1">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
             <input
               type="text"
               placeholder="Cari kampus, kota, provinsi..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-white/10 outline-none focus:border-indigo-500 text-slate-900 dark:text-white font-medium shadow-sm transition-all"
             />
           </div>
           
           {/* Filters */}
           <div className="flex flex-wrap lg:flex-nowrap gap-3">
              <select
                value={filterRegion}
                onChange={(e) => setFilterRegion(e.target.value)}
                className="px-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-300 outline-none focus:border-indigo-500 appearance-none flex-1 lg:flex-none min-w-[140px]"
              >
                <option value="all">Semua Wilayah</option>
                {regions.map(r => <option key={r} value={r}>{r}</option>)}
              </select>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-300 outline-none focus:border-indigo-500 appearance-none flex-1 lg:flex-none"
              >
                <option value="all">Semua Jenis</option>
                <option value="universitas">Universitas</option>
                <option value="institut">Institut</option>
              </select>

              <select
                value={filterConfidence}
                onChange={(e) => setFilterConfidence(e.target.value)}
                className="px-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-300 outline-none focus:border-indigo-500 appearance-none flex-1 lg:flex-none"
              >
                <option value="all">Kualitas Data</option>
                <option value="high">Tinggi</option>
                <option value="medium">Menengah</option>
                <option value="low">Rendah</option>
              </select>
           </div>
        </div>

        {/* Results Info */}
        <div className="mb-6 flex items-center justify-between">
           <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
             Menampilkan <span className="text-indigo-600 dark:text-indigo-400">{filteredPTN.length}</span> kampus
           </p>
        </div>

        {/* List */}
        {filteredPTN.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
            {filteredPTN.map(ptn => (
              <Link key={ptn.id} to={`/ptnpedia/ptn-insight/${ptn.id}`} className="group">
                 <motion.div 
                   whileHover={{ y: -4 }}
                   className="h-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 hover:border-indigo-500/30 rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5"
                 >
                    <div>
                        <div className="flex items-start justify-between mb-4 gap-2">
                           <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:bg-indigo-500 group-hover:text-white transition-colors shrink-0">
                              <Building2 size={24} />
                           </div>
                           <div className="flex flex-col items-end gap-1">
                              {renderConfidenceBadge(ptn.data_quality.confidence_level)}
                           </div>
                        </div>

                        <div className="space-y-1 mb-4">
                           <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{ptn.category} • {ptn.type}</p>
                           <h3 className="text-lg lg:text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight line-clamp-2">
                               {ptn.name}
                           </h3>
                           <p className="text-sm font-semibold text-slate-500">{ptn.short_name}</p>
                        </div>
                        
                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 mb-6">
                           <MapPin size={14} className="text-indigo-400 shrink-0" />
                           <span className="truncate">{ptn.location.city}, {ptn.location.province || ptn.location.region}</span>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-500 transition-colors">
                        <span>Lihat Insight</span>
                        <span>&rarr;</span>
                    </div>
                 </motion.div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-70">
             <div className="w-20 h-20 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-slate-400 dark:text-slate-500" />
             </div>
             <div className="max-w-sm">
                <p className="text-lg font-bold text-slate-900 dark:text-white mb-2">Kampus tidak ditemukan</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Coba ubah kata kunci pencarian atau sesuaikan filter wilayah dan jenis kampus.</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
