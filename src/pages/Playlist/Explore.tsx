import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Play, 
  User, 
  Compass, 
  TrendingUp, 
  Clock, 
  Grid2X2, 
  Filter,
  Ghost,
  Loader2,
  Sparkles,
  ArrowRight,
  ChevronDown
} from 'lucide-react';
import { db } from '@/src/services/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { cn } from '@/src/lib/utils';

export default function PlaylistExplore() {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchPublicPlaylists = async () => {
      try {
        const q = query(
          collection(db, 'playlists'),
          where('isPublic', '==', true),
          orderBy('createdAt', 'desc'),
          limit(24)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPlaylists(data);
      } catch (error) {
        console.error("Error fetching public playlists:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicPlaylists();
  }, []);

  const filteredPlaylists = playlists.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.creatorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'Semua' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    'Semua',
    'Penalaran Umum',
    'Pengetahuan dan Pemahaman Umum',
    'Pemahaman Bacaan dan Menulis',
    'Pengetahuan Kuantitatif',
    'Literasi dalam Bahasa Indonesia',
    'Literasi dalam Bahasa Inggris',
    'Penalaran Matematika'
  ];

  return (
    <div className="space-y-8 md:space-y-12 pb-20 fade-in">
      {/* Header Section */}
      <div className="relative p-6 md:p-10 lg:p-12 bg-indigo-600 rounded-[2rem] overflow-hidden shadow-2xl shadow-indigo-600/10">
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 glow-indigo pointer-events-none -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 md:w-64 md:h-64 glow-purple pointer-events-none translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12">
          <div className="space-y-4 md:space-y-6 w-full max-w-2xl text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] md:leading-[1.15]">
              Temukan Panduan <br className="hidden sm:block" /> Belajar Terbaikmu.
            </h1>
            <p className="text-indigo-100 font-medium text-base md:text-lg max-w-xl mx-auto lg:mx-0">
              Koleksi playlist materi SNBT yang disusun langsung oleh para pejuang SNBT lainnya.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link 
                to="/playlist/mine"
                className="w-full sm:w-auto bg-white text-indigo-600 font-black py-3.5 px-6 md:py-4 md:px-8 rounded-xl md:rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl text-sm md:text-base"
              >
                Buat Playlist Gue
              </Link>
              <div className="flex -space-x-3 md:-space-x-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 md:w-12 md:h-12 rounded-full border-[3px] md:border-4 border-indigo-600 bg-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                     <User className="w-5 h-5 md:w-6 md:h-6 text-slate-500" />
                  </div>
                ))}
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-[3px] md:border-4 border-indigo-600 bg-indigo-500 flex items-center justify-center text-[9px] md:text-[10px] font-black text-white shrink-0">
                  +100
                </div>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:flex w-64 h-64 xl:w-80 xl:h-80 bg-indigo-400/20 rounded-full items-center justify-center border-2 border-white/5 animate-pulse shrink-0">
            <Compass className="w-32 h-32 xl:w-40 xl:h-40 text-white/40" />
          </div>
        </div>
      </div>

      {/* Discovery Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 relative z-30">
        <div className="space-y-4 flex-1">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white px-1">Eksplor Komunitas</h2>
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between w-full sm:w-[320px] bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-5 py-3 text-slate-800 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              aria-haspopup="listbox"
              aria-expanded={isDropdownOpen}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <Filter className="w-4 h-4 text-indigo-500 shrink-0" />
                <span className="text-sm font-bold truncate">
                  {activeCategory === 'Semua' ? 'Semua Subtes' : activeCategory}
                </span>
              </div>
              <ChevronDown className={cn("w-4 h-4 text-slate-500 transition-transform duration-300", isDropdownOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.ul
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 mt-2 w-full sm:w-[320px] max-h-[300px] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl z-50 custom-scrollbar py-2"
                  role="listbox"
                >
                  {categories.map(cat => (
                    <li key={cat} role="option" aria-selected={activeCategory === cat}>
                      <button
                        onClick={() => {
                          setActiveCategory(cat);
                          setIsDropdownOpen(false);
                        }}
                        className={cn(
                          "w-full text-left px-5 py-3 text-sm font-medium transition-colors flex items-center gap-3",
                          activeCategory === cat 
                            ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" 
                            : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5"
                        )}
                      >
                        <div className={cn(
                          "w-1.5 h-1.5 rounded-full transition-all",
                          activeCategory === cat ? "bg-indigo-500 scale-100" : "bg-transparent scale-0"
                        )} />
                        {cat === 'Semua' ? 'Semua Subtes' : cat}
                      </button>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="relative w-full lg:max-w-xs xl:max-w-sm shrink-0">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-slate-500" />
          <input 
            type="text"
            placeholder="Cari materi atau kreator..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl md:rounded-2xl py-3.5 md:py-4 pl-10 md:pl-12 pr-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium text-sm md:text-base shadow-sm"
          />
        </div>
      </div>

      {/* Playlists Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
          {[1,2,3,4,5,6,7,8,9,10].map(i => (
            <div key={i} className="h-[340px] bg-white dark:bg-white/5 rounded-[2rem] border border-slate-200 dark:border-white/5 animate-pulse" />
          ))}
        </div>
      ) : filteredPlaylists.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
          {filteredPlaylists.map((playlist, idx) => (
            <motion.div
              key={playlist.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group bg-white dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2rem] overflow-hidden hover:border-indigo-500/50 lg:hover:-translate-y-1 transition-all shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col"
            >
              <Link to={`/playlist/${playlist.slug}`} className="flex-1 flex flex-col">
                <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                  {playlist.thumbnail ? (
                    <img 
                      src={playlist.thumbnail} 
                      alt={playlist.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 flex items-center justify-center">
                       <Play className="w-10 h-10 text-indigo-300 dark:text-white/20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/10 dark:bg-black/40 group-hover:bg-transparent dark:group-hover:bg-black/20 transition-colors" />
                  
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="bg-white/90 dark:bg-indigo-600/30 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-indigo-500/30 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest backdrop-blur-md shadow-sm">
                      {playlist.mode === 'workflow' ? 'Terstruktur' : 'Normal'}
                    </span>
                    {playlist.category && (
                      <span className="bg-slate-900/80 dark:bg-white/10 text-white border border-slate-700 dark:border-white/20 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest backdrop-blur-md">
                        {playlist.category}
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 right-3 bg-white/90 dark:bg-white/10 backdrop-blur-md border border-slate-200 dark:border-white/20 p-2.5 rounded-xl text-indigo-600 dark:text-white transform group-hover:scale-110 transition-transform shadow-sm">
                    <Play className="w-4 h-4 fill-current" />
                  </div>
                </div>

                <div className="p-5 md:p-6 space-y-3 md:space-y-4 flex-1 flex flex-col">
                  <div className="space-y-1">
                    <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 leading-tight">{playlist.title}</h3>
                    <div className="flex items-center gap-1.5 text-slate-500 text-[9px] md:text-[10px] font-black uppercase tracking-[0.1em]">
                      <User className="w-3 h-3 text-indigo-500" />
                      <span className="truncate">{playlist.creatorName}</span>
                    </div>
                  </div>

                  <p className="text-slate-600 dark:text-slate-400 text-xs md:text-sm line-clamp-2 leading-relaxed flex-1">
                    {playlist.description || "Mari berjuang bersama menaklukkan rintangan belajar!"}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5 text-[9px] md:text-[10px] font-black uppercase tracking-widest mt-auto">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Clock className="w-3 h-3 text-indigo-500" />
                      <span>{playlist.videoCount || 0} Video</span>
                    </div>
                    <div className="text-indigo-600 dark:text-indigo-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                      Gas Belajar <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 md:py-32 space-y-4 md:space-y-6">
           <div className="w-20 h-20 md:w-24 md:h-24 bg-white dark:bg-white/5 flex items-center justify-center rounded-full border border-slate-200 dark:border-white/10 shadow-sm">
            <Ghost className="w-8 h-8 md:w-12 md:h-12 text-slate-400" />
          </div>
          <p className="text-slate-500 text-xs md:text-sm font-bold uppercase tracking-widest">Playlist gak ketemu.</p>
        </div>
      )}
    </div>
  );
}
