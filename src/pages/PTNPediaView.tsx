import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  TrendingUp, 
  Users, 
  Target, 
  ChevronDown, 
  Loader, 
  AlertCircle, 
  BookOpen, 
  ArrowLeft, 
  Sparkles, 
  Zap, 
  Globe, 
  BarChart3, 
  X,
  MapPin,
  GraduationCap
} from 'lucide-react';

const MOCK_UNIVERSITIES: Record<string, any[]> = {
  akademik: [
    { code: '0001', name: 'Universitas Indonesia', category: 'akademik' },
    { code: '0002', name: 'Institut Teknologi Bandung', category: 'akademik' },
    { code: '0003', name: 'Universitas Gadjah Mada', category: 'akademik' },
    { code: '0004', name: 'Universitas Airlangga', category: 'akademik' },
    { code: '0005', name: 'Universitas Diponegoro', category: 'akademik' }
  ],
  vokasi: [
    { code: '0011', name: 'Politeknik Negeri Jakarta', category: 'vokasi' },
    { code: '0012', name: 'Politeknik Negeri Bandung', category: 'vokasi' },
    { code: '0013', name: 'Politeknik Elektronika Negeri Surabaya', category: 'vokasi' },
    { code: '0014', name: 'Politeknik Negeri Semarang', category: 'vokasi' }
  ],
  ptkin: [
    { code: '0021', name: 'UIN Syarif Hidayatullah Jakarta', category: 'ptkin' },
    { code: '0022', name: 'UIN Sunan Gunung Djati Bandung', category: 'ptkin' },
    { code: '0023', name: 'UIN Sunan Kalijaga Yogyakarta', category: 'ptkin' },
    { code: '0024', name: 'UIN Maulana Malik Ibrahim Malang', category: 'ptkin' }
  ]
};

const MOCK_PROGRAMS: Record<string, any[]> = {
  '0001': [
    { code: '55201', name: 'Teknik Informatika', jenjang: 'S1', capacity: '120', applicants: '2500', ratio: '20.8', admissionChance: '4.80%' },
    { code: '55202', name: 'Teknik Elektro', jenjang: 'S1', capacity: '100', applicants: '1800', ratio: '18.0', admissionChance: '5.56%' }
  ],
  '0011': [
    { code: '88101', name: 'D4 Teknik Informatika', jenjang: 'D4', capacity: '80', applicants: '1200', ratio: '15.0', admissionChance: '6.67%' }
  ],
  '0021': [
    { code: '99101', name: 'Sistem Informasi', jenjang: 'S1', capacity: '100', applicants: '1500', ratio: '15.0', admissionChance: '6.67%' }
  ]
};

const BACKEND_URL = (import.meta as any).env.VITE_BACKEND_URL || 'https://ptnpedia-snbtai-api.vercel.app';

const PTNPediaAPI = {
  async getUniversities(category = 'akademik') {
    try {
      console.log(`[PTNPediaAPI] Fetching universities for category: ${category}`);
      const response = await fetch(`${BACKEND_URL}/api/universities?category=${category}`, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP Error ${response.status}: ${errorText || response.statusText}`);
      }
      
      const payload = await response.json();
      // Support both { data: [...] } and direct array [...] formats
      const data = Array.isArray(payload) ? payload : (payload.data || []);
      
      console.log(`[PTNPediaAPI] Successfully fetched ${data.length} universities`);
      return data;
    } catch (error) {
      console.error('[PTNPediaAPI] Error in getUniversities:', error);
      // Re-throw so the UI can handle the error state
      throw error;
    }
  },

  async getPrograms(universityCode: string) {
    try {
      console.log(`[PTNPediaAPI] Fetching programs for university: ${universityCode}`);
      const response = await fetch(`${BACKEND_URL}/api/programs?code=${universityCode}`, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP Error ${response.status}: ${errorText || response.statusText}`);
      }
      
      const payload = await response.json();
      const data = Array.isArray(payload) ? payload : (payload.data || []);
      
      console.log(`[PTNPediaAPI] Successfully fetched ${data.length} programs`);
      return data;
    } catch (error) {
      console.error('[PTNPediaAPI] Error in getPrograms:', error);
      throw error;
    }
  }
};

interface PTNPediaViewProps {
  onBack?: () => void;
}

export const PTNPediaView: React.FC<PTNPediaViewProps> = ({ onBack }) => {
  const [klaster, setKlaster] = useState('akademik');
  const [universities, setUniversities] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [expandedUniversity, setExpandedUniversity] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [programSearchQuery, setProgramSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'browse' | 'compare'>('browse');
  const [compareProdiName, setCompareProdiName] = useState('');
  const [compareResults, setCompareResults] = useState<any[]>([]);
  const [compareSortBy, setCompareSortBy] = useState('ratio-asc');
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showMobileList, setShowMobileList] = useState(false);

  useEffect(() => {
    loadUniversities();
  }, [klaster]);

  const loadUniversities = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await PTNPediaAPI.getUniversities(klaster);
      setUniversities(data);
      setPrograms([]);
    } catch (err: any) {
      console.error("[PTNPediaView] loadUniversities failed:", err);
      setError(`Gagal memuat data universitas: ${err.message || 'Error tidak diketahui'}`);
    } finally {
      setLoading(false);
    }
  };

  const loadPrograms = useCallback(async (universityCode: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await PTNPediaAPI.getPrograms(universityCode);
      setPrograms(data);
    } catch (err: any) {
      console.error(`[PTNPediaView] loadPrograms failed for ${universityCode}:`, err);
      setError(`Gagal memuat program studi: ${err.message || 'Error tidak diketahui'}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCompareProdi = async () => {
    if (!compareProdiName.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const results: any[] = [];
      for (const uni of universities) {
        const progs = await PTNPediaAPI.getPrograms(uni.code);
        const matchedProgs = progs.filter(p =>
          p.name.toLowerCase().includes(compareProdiName.toLowerCase())
        );
        if (matchedProgs.length > 0) {
          matchedProgs.forEach(prog => {
            results.push({
              ...prog,
              universityName: uni.name,
              universityCode: uni.code
            });
          });
        }
      }
      setCompareResults(results);
      if (results.length === 0) {
        setError('Tidak ada program studi yang cocok di semua universitas');
      }
    } catch (err) {
      setError('Gagal membandingkan program studi. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const filteredUniversities = universities
    .filter(uni => uni.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  const sortedPrograms = [...programs]
    .filter(prog => prog.name.toLowerCase().includes(programSearchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'ratio') return parseFloat(b.ratio) - parseFloat(a.ratio);
      if (sortBy === 'capacity') return parseInt(b.capacity) - parseInt(a.capacity);
      if (sortBy === 'applicants') return parseInt(b.applicants) - parseInt(a.applicants);
      return a.name.localeCompare(b.name);
    });

  const sortedCompareResults = [...compareResults].sort((a, b) => {
    if (compareSortBy === 'ratio-asc') return parseFloat(a.ratio) - parseFloat(b.ratio);
    if (compareSortBy === 'ratio-desc') return parseFloat(b.ratio) - parseFloat(a.ratio);
    if (compareSortBy === 'capacity-desc') return parseInt(b.capacity) - parseInt(a.capacity);
    if (compareSortBy === 'capacity-asc') return parseInt(a.capacity) - parseInt(b.capacity);
    if (compareSortBy === 'applicants-desc') return parseInt(b.applicants) - parseInt(a.applicants);
    if (compareSortBy === 'applicants-asc') return parseInt(a.applicants) - parseInt(b.applicants);
    if (compareSortBy === 'chance-desc') return parseFloat(b.admissionChance) - parseFloat(a.admissionChance);
    if (compareSortBy === 'chance-asc') return parseFloat(a.admissionChance) - parseFloat(b.admissionChance);
    return a.universityName.localeCompare(b.universityName);
  });

  return (
    <div className="ptnpedia-container w-full h-full min-h-[800px] flex flex-col bg-transparent relative animate-in fade-in duration-500">
      {/* Luxury Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-gradient-to-br from-indigo-600/10 to-purple-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-tl from-emerald-500/5 to-cyan-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="flex-1 w-full max-w-[1900px] mx-auto flex flex-col overflow-hidden relative z-10">
        {/* Header Section */}
        <div className="flex-shrink-0 px-6 py-4 md:px-8 border-b border-white/5 dark:border-white/5 bg-white/40 dark:bg-white/5 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {onBack && (
              <button onClick={onBack} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition-all">
                <ArrowLeft className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              </button>
            )}
            <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
              <BookOpen className="text-indigo-600 dark:text-indigo-400 w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white leading-tight">PTNPedia.</h2>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">SNPMB Database 2026</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto overflow-x-auto pb-4 md:pb-0 hide-scrollbar">
            <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1 rounded-xl border border-slate-200 dark:border-white/5 w-full sm:w-auto flex-shrink-0">
              {[
                { id: 'akademik', label: 'Akademik', icon: Sparkles },
                { id: 'vokasi', label: 'Vokasi', icon: Zap },
                { id: 'ptkin', label: 'PTKIN', icon: Globe },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setKlaster(tab.id)}
                  className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2 rounded-lg transition-all text-[11px] font-black uppercase tracking-wider flex-1 sm:flex-none ${
                    klaster === tab.id
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'text-slate-500 hover:text-indigo-600 dark:hover:text-slate-300'
                  }`}
                >
                  <tab.icon size={14} className="flex-shrink-0" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto flex-shrink-0">
              <button
                onClick={() => setViewMode(viewMode === 'compare' ? 'browse' : 'compare')}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl transition-all text-[11px] font-black uppercase tracking-wider border whitespace-nowrap ${
                  viewMode === 'compare'
                    ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-600 dark:text-indigo-400'
                    : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/10'
                }`}
              >
                <BarChart3 size={14} />
                <span>{viewMode === 'compare' ? 'Kembali' : 'Bandingkan Prodi'}</span>
              </button>

              <button
                onClick={() => setShowInfoModal(true)}
                className="p-2.5 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 rounded-xl transition-all border border-slate-200 dark:border-white/10 shadow-sm"
                title="Informasi Metrik"
              >
                <AlertCircle className="text-indigo-600 dark:text-indigo-400 w-5 h-5 flex-shrink-0" />
              </button>
            </div>
          </div>
        </div>

        {/* Error Message Display */}
        {error && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl p-4 bg-white dark:bg-slate-900 border border-red-500/30 rounded-2xl flex items-center justify-between gap-4 shadow-2xl shadow-red-500/10 animate-in fade-in slide-in-from-top-4 duration-300 z-50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <AlertCircle className="text-red-500 dark:text-red-400 w-5 h-5 flex-shrink-0" />
              </div>
              <p className="text-sm font-medium text-slate-800 dark:text-red-200">{error}</p>
            </div>
            <button 
              onClick={() => setError(null)}
              className="p-1 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg text-slate-400 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative z-10 bg-white dark:bg-white/[0.02]">
          {viewMode === 'compare' ? (
            /* Comparison Engine View */
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
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2 w-full">
                       <h3 className="text-xl font-medium text-slate-900 dark:text-white flex items-center gap-3">
                         Hasil Analisis
                         <span className="px-3 py-1 bg-indigo-500/10 text-indigo-600 dark:text-slate-300 text-xs font-black rounded-lg">{compareResults.length} Prodi</span>
                       </h3>
                       <select
                          value={compareSortBy}
                          onChange={(e) => setCompareSortBy(e.target.value)}
                          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-xs font-bold px-4 py-2.5 rounded-xl outline-none focus:border-indigo-500/50 appearance-none shadow-sm w-full sm:w-auto"
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
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-6">
                             <div className="space-y-2 flex-1 relative z-10 w-full lg:w-auto">
                                <div className="flex flex-wrap items-center gap-2 lg:gap-3">
                                   <span className="px-2.5 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase rounded-md tracking-wider">{prog.jenjang || 'S1'} | {prog.universityCode}</span>
                                </div>
                                <h4 className="text-lg lg:text-2xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors uppercase tracking-tight break-words">{prog.name}</h4>
                                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium">
                                   <MapPin size={16} className="text-indigo-500/70 flex-shrink-0" />
                                   <span className="break-words">{prog.universityName}</span>
                                </div>
                             </div>
                             
                             <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 lg:gap-4 w-full lg:w-auto flex-shrink-0">
                                <div className="p-3 lg:p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-white/5 flex flex-col justify-center min-w-[70px] lg:min-w-[100px]">
                                   <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Kuota</div>
                                   <div className="text-xl font-bold text-slate-900 dark:text-white">{prog.capacity}</div>
                                </div>
                                <div className="p-3 lg:p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-white/5 flex flex-col justify-center min-w-[70px] lg:min-w-[100px]">
                                   <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Peminat</div>
                                   <div className="text-xl font-bold text-slate-600 dark:text-slate-300">{prog.applicants}</div>
                                </div>
                                <div className="p-3 lg:p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-white/5 flex flex-col justify-center min-w-[70px] lg:min-w-[100px]">
                                   <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Rasio</div>
                                   <div className="text-xl font-bold text-orange-500 dark:text-orange-400">1:{prog.ratio}</div>
                                </div>
                                <div className="p-3 lg:p-4 bg-indigo-600 rounded-xl flex flex-col justify-center min-w-[100px] lg:min-w-[110px] shadow-lg shadow-indigo-600/20">
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
          ) : (
            /* Master-Detail Split View */
            <>
              {/* Left Panel: University Selector (25%) */}
              <div className="w-full lg:w-1/4 lg:max-w-[380px] border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-white/5 flex flex-col bg-slate-50 dark:bg-slate-900/30 flex-shrink-0 z-20">
                 <div className="p-4 lg:p-5 border-b border-slate-100 dark:border-white/5">
                   <div className="relative">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                     <input
                       type="text"
                       placeholder="Cari universitas..."
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                       className="w-full pl-11 pr-4 py-2.5 lg:py-3 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none focus:border-indigo-500/50 transition-all font-medium shadow-sm"
                     />
                   </div>
                 </div>

                 <div className="w-full lg:flex-1 overflow-x-auto lg:overflow-y-auto px-4 lg:px-3 py-3 lg:py-4 custom-scrollbar">
                    {loading && !universities.length ? (
                      <div className="flex lg:flex-col gap-3">
                        {[1, 2, 3, 4, 5].map(i => (
                          <div key={i} className="h-16 min-w-[200px] lg:min-w-0 bg-slate-100 dark:bg-slate-900/50 rounded-xl animate-pulse flex-shrink-0" />
                        ))}
                      </div>
                    ) : filteredUniversities.length === 0 ? (
                      <div className="p-4 lg:p-8 text-center text-slate-500 font-medium whitespace-nowrap lg:whitespace-normal">Universitas tidak ditemukan.</div>
                    ) : (
                      <div className="flex lg:flex-col gap-3 lg:gap-1.5 lg:p-1">
                        {filteredUniversities.map((uni) => (
                          <button
                            key={uni.code}
                            onClick={() => {
                              setExpandedUniversity(uni.code === expandedUniversity ? null : uni.code);
                              if (uni.code !== expandedUniversity) loadPrograms(uni.code);
                            }}
                            className={`flex flex-col lg:flex-row lg:items-center justify-between p-3 lg:p-4 rounded-xl transition-all group border min-w-[200px] sm:min-w-[240px] lg:min-w-0 flex-shrink-0 text-left ${
                              expandedUniversity === uni.code
                                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/10'
                                : 'bg-white dark:bg-transparent border-slate-100 dark:border-transparent hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-slate-200 shadow-sm dark:shadow-none'
                            }`}
                          >
                            <div className="flex flex-col items-start gap-1 w-full lg:pr-3">
                              <span className={`text-[10px] font-black tracking-widest uppercase ${expandedUniversity === uni.code ? 'text-indigo-200' : 'text-slate-400 dark:text-slate-600'}`}>{uni.code}</span>
                              <span className="font-bold text-sm leading-tight line-clamp-2 w-full break-words">{uni.name}</span>
                            </div>
                            <ChevronDown size={16} className={`hidden lg:block flex-shrink-0 transition-transform duration-300 ${expandedUniversity === uni.code ? 'rotate-180 text-white' : 'opacity-0 group-hover:opacity-100'}`} />
                          </button>
                        ))}
                      </div>
                    )}
                 </div>
              </div>

              {/* Right Panel: Programs Detail (75%) */}
              <div className="flex-1 flex flex-col h-full bg-slate-50/20 dark:bg-slate-950/20 relative min-w-0">
                 {expandedUniversity ? (
                   <>
                     <div className="p-4 lg:p-10 border-b border-slate-100 dark:border-white/5 bg-gradient-to-r from-white dark:from-slate-900/80 to-transparent">
                        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 lg:gap-6 max-w-6xl">
                           <div className="space-y-2">
                              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                                 <Sparkles size={12} />
                                 DATA AKREDITASI
                              </div>
                              <h3 className="text-xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight break-words">
                                {universities.find(u => u.code === expandedUniversity)?.name}
                              </h3>
                           </div>
                           <div className="relative w-full lg:w-72 flex-shrink-0">
                              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                              <input
                                type="text"
                                placeholder="Cari program studi..."
                                value={programSearchQuery}
                                onChange={(e) => setProgramSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-2.5 lg:py-3 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-500/50 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors shadow-sm"
                              />
                           </div>
                        </div>
                     </div>

                     <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 custom-scrollbar">
                        {loading && !programs.length ? (
                          <div className="h-full flex flex-col items-center justify-center space-y-4">
                             <Loader className="animate-spin text-indigo-600 dark:text-indigo-500" size={32} />
                             <span className="text-slate-500 font-medium">Memuat data program studi...</span>
                          </div>
                        ) : (
                          <div className="max-w-6xl space-y-4 pb-24">
                             {sortedPrograms.map((prog, idx) => (
                               <div key={idx} className="p-5 lg:p-6 bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-white/5 rounded-2xl relative overflow-hidden group hover:border-indigo-500/30 dark:hover:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all shadow-sm">
                                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                                     {/* Left section: Identity */}
                                     <div className="space-y-2 flex-1 relative z-10 w-full lg:w-auto">
                                        <div className="flex flex-wrap items-center gap-2 lg:gap-3">
                                           <span className="px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/10 text-indigo-600 dark:text-slate-300 text-[10px] font-black rounded-md uppercase tracking-wider">{prog.jenjang || 'S1'}</span>
                                           <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">KODE: {prog.code}</span>
                                        </div>
                                        <h4 className="text-lg lg:text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors break-words">{prog.name}</h4>
                                     </div>

                                     {/* Right section: Metrics Grid */}
                                     <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 lg:gap-4 w-full lg:w-auto relative z-10 flex-shrink-0">
                                        <div className="p-3 lg:p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-white/5 flex flex-col justify-center min-w-[70px] lg:min-w-[100px]">
                                           <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Kuota</div>
                                           <div className="text-xl font-bold text-slate-900 dark:text-white">{prog.capacity}</div>
                                        </div>
                                        <div className="p-3 lg:p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-white/5 flex flex-col justify-center min-w-[70px] lg:min-w-[100px]">
                                           <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Peminat</div>
                                           <div className="text-xl font-bold text-slate-600 dark:text-slate-300">{prog.applicants}</div>
                                        </div>
                                        <div className="p-3 lg:p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-white/5 flex flex-col justify-center min-w-[70px] lg:min-w-[100px]">
                                           <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Rasio</div>
                                           <div className="text-xl font-bold text-orange-500 dark:text-orange-400">1:{prog.ratio}</div>
                                        </div>
                                        <div className="p-3 lg:p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex flex-col justify-center min-w-[100px] lg:min-w-[120px] group-hover:bg-indigo-600 transition-colors">
                                           <div className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-200 uppercase tracking-widest mb-1 transition-colors">Peluang</div>
                                           <div className="text-xl font-black text-slate-900 dark:text-white group-hover:text-white transition-colors">{prog.admissionChance}</div>
                                        </div>
                                     </div>
                                  </div>
                               </div>
                             ))}
                             {sortedPrograms.length === 0 && (
                                <div className="py-20 text-center">
                                   <div className="w-16 h-16 mx-auto bg-slate-100 dark:bg-slate-900 rounded-2xl flex items-center justify-center mb-4">
                                      <Search className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                                   </div>
                                   <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Program Studi Tidak Ditemukan</h4>
                                   <p className="text-slate-500">Coba gunakan kata kunci pencarian yang lain.</p>
                                </div>
                             )}
                          </div>
                        )}
                     </div>
                   </>
                 ) : (
                   <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-6 opacity-70">
                      <div className="w-32 h-32 bg-slate-100 dark:bg-slate-900 rounded-[2.5rem] flex items-center justify-center border border-slate-200 dark:border-white/5 relative">
                         <Search size={40} className="text-slate-300 dark:text-slate-600" />
                      </div>
                      <div className="space-y-3 max-w-sm">
                         <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Pilih Universitas</h3>
                         <p className="text-slate-500 font-normal leading-relaxed">
                           Pilih salah satu universitas di daftar sebelah kiri untuk melihat informasi lengkap daya tampung dan rasio keketatan program studi.
                         </p>
                      </div>
                   </div>
                 )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowInfoModal(false)} />
           <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl space-y-8">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                       <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Keterangan Metrik</h3>
                 </div>
                 <button onClick={() => setShowInfoModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-all">
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
                onClick={() => setShowInfoModal(false)}
                className="w-full py-4 bg-indigo-600 text-white font-black text-sm uppercase tracking-wider rounded-xl hover:bg-indigo-500 active:scale-[0.98] transition-all shadow-lg shadow-indigo-600/20"
              >
                Tutup Informasi
              </button>
           </div>
        </div>
      )}

      {/* Global Scrollbar Style */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 4px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.1);
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default PTNPediaView;
