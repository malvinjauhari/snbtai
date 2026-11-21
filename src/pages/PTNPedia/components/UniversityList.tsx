import React from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { University } from '../types';

interface UniversityListProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredUniversities: University[];
  expandedUniversity: string | null;
  onSelectUniversity: (code: string) => void;
  loading: boolean;
  hasUniversities: boolean;
}

export const UniversityList: React.FC<UniversityListProps> = ({
  searchQuery,
  setSearchQuery,
  filteredUniversities,
  expandedUniversity,
  onSelectUniversity,
  loading,
  hasUniversities
}) => {
  return (
    <div className={`w-full lg:w-1/4 lg:max-w-[380px] border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-white/5 flex flex-col bg-slate-50 dark:bg-slate-900/30 shrink-0 transition-all duration-300 ease-in-out ${expandedUniversity ? 'h-[30vh] lg:h-full' : 'h-full'}`}>
      <div className="p-3 lg:p-5 border-b border-slate-100 dark:border-white/5 shrink-0">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Cari universitas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none focus:border-indigo-500/50 transition-all font-medium shadow-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4 custom-scrollbar">
        {loading && !hasUniversities ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-16 bg-slate-100 dark:bg-slate-900/50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filteredUniversities.length === 0 ? (
          <div className="p-8 text-center text-slate-500 font-medium">Universitas tidak ditemukan.</div>
        ) : (
          <div className="space-y-1.5 p-1">
            {filteredUniversities.map((uni) => (
              <button
                key={uni.code}
                onClick={() => onSelectUniversity(uni.code)}
                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all group border ${
                  expandedUniversity === uni.code
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/10'
                    : 'bg-white dark:bg-transparent border-slate-100 dark:border-transparent hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-slate-200 shadow-sm dark:shadow-none'
                }`}
              >
                <div className="flex flex-col items-start text-left gap-1 pr-3">
                  <span className={`text-[10px] font-black tracking-widest uppercase ${expandedUniversity === uni.code ? 'text-indigo-200' : 'text-slate-400 dark:text-slate-600'}`}>{uni.code}</span>
                  <span className="font-bold text-sm leading-tight text-left line-clamp-2">{uni.name}</span>
                </div>
                <ChevronDown size={16} className={`flex-shrink-0 transition-transform duration-300 ${expandedUniversity === uni.code ? 'rotate-180 text-white' : 'opacity-0 group-hover:opacity-100'}`} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
