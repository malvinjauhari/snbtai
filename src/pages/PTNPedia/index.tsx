import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AlertCircle, X } from 'lucide-react';
import { Header } from './components/Header';
import { UniversityList } from './components/UniversityList';
import { ProgramList } from './components/ProgramList';
import { ComparisonEngine } from './components/ComparisonEngine';
import { InfoModal } from './components/InfoModal';
import { PTNPediaAPI } from './api';
import { University, Program, PTNPediaViewProps } from './types';

export const PTNPediaView: React.FC<PTNPediaViewProps> = ({ onBack }) => {
  const [klaster, setKlaster] = useState('akademik');
  const [universities, setUniversities] = useState<University[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [expandedUniversity, setExpandedUniversity] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [programSearchQuery, setProgramSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'browse' | 'compare'>('browse');
  const [compareProdiName, setCompareProdiName] = useState('');
  const [compareResults, setCompareResults] = useState<Program[]>([]);
  const [compareSortBy, setCompareSortBy] = useState('ratio-asc');
  const [showInfoModal, setShowInfoModal] = useState(false);

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
      const results: Program[] = [];
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

  const filteredUniversities = useMemo(() => {
    return universities
      .filter(uni => uni.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [universities, searchQuery]);

  const sortedPrograms = useMemo(() => {
    return [...programs]
      .filter(prog => prog.name.toLowerCase().includes(programSearchQuery.toLowerCase()))
      .sort((a, b) => {
        if (sortBy === 'ratio') return parseFloat(b.ratio) - parseFloat(a.ratio);
        if (sortBy === 'capacity') return parseInt(b.capacity) - parseInt(a.capacity);
        if (sortBy === 'applicants') return parseInt(b.applicants) - parseInt(a.applicants);
        return a.name.localeCompare(b.name);
      });
  }, [programs, programSearchQuery, sortBy]);

  const sortedCompareResults = useMemo(() => {
    return [...compareResults].sort((a, b) => {
      if (compareSortBy === 'ratio-asc') return parseFloat(a.ratio) - parseFloat(b.ratio);
      if (compareSortBy === 'ratio-desc') return parseFloat(b.ratio) - parseFloat(a.ratio);
      if (compareSortBy === 'capacity-desc') return parseInt(b.capacity) - parseInt(a.capacity);
      if (compareSortBy === 'capacity-asc') return parseInt(a.capacity) - parseInt(b.capacity);
      if (compareSortBy === 'applicants-desc') return parseInt(b.applicants) - parseInt(a.applicants);
      if (compareSortBy === 'applicants-asc') return parseInt(a.applicants) - parseInt(b.applicants);
      if (compareSortBy === 'chance-desc') return parseFloat(b.admissionChance) - parseFloat(a.admissionChance);
      if (compareSortBy === 'chance-asc') return parseFloat(a.admissionChance) - parseFloat(b.admissionChance);
      return (a.universityName || '').localeCompare(b.universityName || '');
    });
  }, [compareResults, compareSortBy]);

  const onSelectUniversity = (code: string) => {
    setExpandedUniversity(code === expandedUniversity ? null : code);
    if (code !== expandedUniversity) loadPrograms(code);
  };

  return (
    <div className="ptnpedia-container w-full h-full min-h-[800px] flex flex-col bg-transparent relative animate-in fade-in duration-500">
      {/* Luxury Background Effects removed for performance - handled by premium bg */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      </div>

      <div className="flex-1 w-full max-w-[1900px] mx-auto flex flex-col overflow-hidden relative z-10">
        <Header 
          onBack={onBack}
          klaster={klaster}
          setKlaster={setKlaster}
          viewMode={viewMode}
          setViewMode={setViewMode}
          setShowInfoModal={setShowInfoModal}
        />

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
          <UniversityList 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filteredUniversities={filteredUniversities}
            expandedUniversity={expandedUniversity}
            onSelectUniversity={onSelectUniversity}
            loading={loading}
            hasUniversities={universities.length > 0}
          />
          <ProgramList 
            universityName={universities.find(u => u.code === expandedUniversity)?.name}
            programSearchQuery={programSearchQuery}
            setProgramSearchQuery={setProgramSearchQuery}
            sortedPrograms={sortedPrograms}
            loading={loading}
            hasPrograms={programs.length > 0}
            expandedUniversity={expandedUniversity}
          />
        </div>
      </div>

      {showInfoModal && <InfoModal onClose={() => setShowInfoModal(false)} />}

      {/* Global Scrollbar Style */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
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
      `}</style>
    </div>
  );
};

export default PTNPediaView;
