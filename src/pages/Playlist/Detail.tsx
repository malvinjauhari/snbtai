import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  ArrowLeft, 
  Clock, 
  User, 
  Share2, 
  Layout, 
  CheckCircle2, 
  Youtube, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Lock,
  Globe,
  Loader2,
  List
} from 'lucide-react';
import { db } from '@/src/services/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { cn } from '@/src/lib/utils';
import { useNotification } from '@/src/context/NotificationContext';

import { PageLoader } from '@/src/components/shared/PageLoader';

export default function PlaylistDetail() {
  const { slug } = useParams();
  const [playlist, setPlaylist] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<any>(null);
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlaylist = async () => {
      if (!slug) {
        navigate('/playlist/explore');
        return;
      }
      try {
        const q = query(collection(db, 'playlists'), where('slug', '==', slug), limit(1));
        const snapshot = await getDocs(q);
        
        if (snapshot.empty) {
          showNotification("Playlist gak ketemu :(", "error");
          navigate('/playlist/explore');
          return;
        }

        const data = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
        setPlaylist(data);

        // Fetch items
        const itemsSnap = await getDocs(query(collection(db, 'playlists', data.id, 'items'), orderBy('position')));
        const itemsData = itemsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setItems(itemsData);
        if (itemsData.length > 0) setActiveVideo(itemsData[0]);

      } catch (error) {
        console.error("Error fetching playlist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylist();
  }, [slug, navigate]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showNotification("Link berhasil disalin!", "success");
  };

  if (loading) return <PageLoader />;

  if (!playlist) return null;

  const displayThumbnail = playlist.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 transition-colors duration-300">
      {/* Hero Header */}
      <div className="relative min-h-[350px] md:min-h-[400px] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={displayThumbnail} 
            className="w-full h-full object-cover blur-2xl opacity-20 dark:opacity-20 scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-slate-50/80 to-slate-50 dark:from-slate-950/40 dark:via-slate-950/80 dark:to-slate-950" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 md:px-6 h-full flex flex-col justify-end pt-24 pb-8 md:pb-12 space-y-6">
          <div className="flex flex-wrap items-center gap-3 md:gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 md:p-3 bg-slate-900/5 hover:bg-slate-900/10 dark:bg-white/5 dark:hover:bg-white/10 rounded-full border border-slate-200 dark:border-white/10 transition-all text-slate-700 dark:text-white group"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" />
            </button>
            <div className="flex flex-wrap gap-2">
               <span className={cn(
                "flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest backdrop-blur-md",
                playlist.isPublic ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" : "bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10"
              )}>
                {playlist.isPublic ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                {playlist.isPublic ? "Publik" : "Privat"}
              </span>
              <span className="bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                {playlist.mode === 'workflow' ? 'Terstruktur' : 'Normal'}
              </span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 md:gap-8">
            <div className="space-y-3 md:space-y-4 max-w-2xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">{playlist.title}</h1>
              <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{playlist.description}</p>
              <div className="flex flex-wrap items-center gap-4 md:gap-6 pt-2">
                <div className="flex items-center gap-2 group">
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-[1px] group-hover:scale-110 transition-transform">
                    <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center">
                      <User className="w-3 h-3 md:w-4 md:h-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                  </div>
                  <span className="text-xs md:text-sm font-bold text-slate-900 dark:text-white tracking-wide">{playlist.creatorName}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-500 text-xs md:text-sm font-bold bg-slate-100 dark:bg-white/5 px-3 py-1.5 md:px-4 rounded-full border border-slate-200 dark:border-white/5">
                  <Clock className="w-3 h-3 md:w-4 md:h-4" /> {items.length} Video
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4 mt-2 lg:mt-0">
              <button 
                onClick={handleShare}
                className="flex items-center justify-center gap-2 md:gap-3 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-700 dark:text-white font-bold py-3 px-6 md:py-4 md:px-8 rounded-xl md:rounded-2xl border border-slate-200 dark:border-white/10 transition-all active:scale-95 text-sm md:text-base shadow-sm"
              >
                <Share2 className="w-4 h-4 md:w-5 md:h-5" /> Bagikan
              </button>
              <button 
                onClick={() => setActiveVideo(items[0])}
                className="flex items-center justify-center gap-2 md:gap-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black py-3 px-6 md:py-4 md:px-10 rounded-xl md:rounded-2xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95 group text-sm md:text-base"
              >
                <Play className="w-4 h-4 md:w-5 md:h-5 fill-current group-hover:scale-110 transition-transform" /> Mulai Belajar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 mt-8 md:mt-12">
        {/* Main Content: Player or Steps */}
        <div className="lg:col-span-8 space-y-8 md:space-y-12">
          {activeVideo && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 md:space-y-6"
            >
              <div className="aspect-video w-full rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl relative group">
                <iframe 
                  src={`https://www.youtube.com/embed/${activeVideo.videoId}?autoplay=0&rel=0`}
                  title={activeVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="flex items-start justify-between gap-4 px-2 md:px-4">
                <div className="space-y-1">
                  <span className="text-[10px] md:text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{activeVideo.category}</span>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white leading-tight">{activeVideo.title}</h2>
                </div>
                <a 
                  href={activeVideo.youtubeUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 md:p-4 bg-slate-100/50 dark:bg-white/5 hover:bg-slate-200/50 dark:hover:bg-white/10 rounded-xl md:rounded-2xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white transition-all group shrink-0"
                >
                  <ExternalLink className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
                </a>
              </div>
            </motion.div>
          )}

          {/* Workflow Mode Specific View */}
          {playlist.mode === 'workflow' && (
            <div className="space-y-8 md:space-y-12 pt-4 md:pt-8 mix-blend-normal dark:mix-blend-lighten">
              <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2 md:gap-3 px-2 md:px-4">
                <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-indigo-600 dark:text-indigo-400" /> Panduan Belajar
              </h3>
              
              <div className="relative space-y-12 md:space-y-24 px-2 md:px-4">
                {/* Connector Line */}
                <div className="absolute left-6 md:left-1/2 -ml-[1px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-indigo-500/80 via-purple-500/50 to-transparent" />

                {items.map((item, index) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, x: typeof window !== 'undefined' && window.innerWidth >= 768 ? (index % 2 === 0 ? -20 : 20) : 0, y: typeof window !== 'undefined' && window.innerWidth < 768 ? 20 : 0 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    className={cn(
                      "relative flex flex-col md:flex-row items-center gap-6 md:gap-12 group",
                      index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    )}
                  >
                    {/* Node Dot */}
                    <div className="absolute left-6 md:left-1/2 -ml-2.5 md:-ml-3 top-8 md:top-1/2 md:-translate-y-1/2 w-5 h-5 md:w-6 md:h-6 rounded-full bg-white dark:bg-slate-950 border-[3px] border-indigo-500 z-10 shadow-[0_0_15px_rgba(99,102,241,0.5)] group-hover:scale-125 transition-transform duration-500" />

                    <div className="flex-1 md:w-1/2 w-full pl-12 md:pl-0">
                      <div 
                        onClick={() => setActiveVideo(item)}
                        className="bg-white dark:bg-white/[0.03] hover:bg-slate-50 dark:hover:bg-white/[0.05] backdrop-blur-xl border border-slate-200 dark:border-white/10 p-5 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] hover:border-indigo-500/30 transition-all cursor-pointer group/card shadow-xl"
                      >
                        <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-3 md:mb-4">
                          <span className="text-[9px] md:text-[10px] font-black text-slate-400 dark:text-white/40 uppercase tracking-[0.2em] bg-slate-100 dark:bg-white/5 px-2 md:px-3 py-1 rounded-full">Step {index + 1}</span>
                          <span className="text-[9px] md:text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em]">{item.category}</span>
                        </div>
                        <h4 className="text-base md:text-xl font-bold text-slate-900 dark:text-white group-hover/card:text-indigo-600 dark:group-hover/card:text-indigo-400 transition-colors mb-4 md:mb-6 leading-tight">{item.title}</h4>
                        <div className="hidden sm:block aspect-video rounded-xl md:rounded-2xl overflow-hidden bg-slate-900 mb-4 md:mb-6">
                           <img 
                            src={`https://img.youtube.com/vi/${item.videoId}/mqdefault.jpg`}
                            className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700 opacity-60 group-hover/card:opacity-100"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <button className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-sm font-bold text-indigo-600 dark:text-indigo-400 group-hover/card:gap-3 transition-all uppercase tracking-widest mt-auto">
                          Tonton Materi <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="hidden md:block flex-1 md:w-1/2 md:px-12" />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar: Navigation List */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-white/[0.02] backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden lg:sticky lg:top-32 shadow-xl">
            <div className="p-5 md:p-6 border-b border-slate-100 dark:border-white/5 flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-sm md:text-base">
                <List className="w-4 h-4 md:w-5 md:h-5 text-indigo-600 dark:text-indigo-400" /> Daftar Video
              </h3>
              <span className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">{items.length} MATERI</span>
            </div>
            
            <div className="max-h-[400px] md:max-h-[500px] overflow-y-auto custom-scrollbar p-2 md:p-3 space-y-1.5 md:space-y-2">
              {items.map((item, index) => (
                <button 
                  key={item.id}
                  onClick={() => setActiveVideo(item)}
                  className={cn(
                    "w-full flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl md:rounded-2xl transition-all text-left group",
                    activeVideo?.id === item.id 
                    ? "bg-indigo-50 dark:bg-indigo-600/20 border border-indigo-200 dark:border-indigo-500/30 ring-1 ring-indigo-500/20" 
                    : "hover:bg-slate-50 dark:hover:bg-white/5 border border-transparent"
                  )}
                >
                  <div className="relative shrink-0 w-12 md:w-16 aspect-video rounded-lg overflow-hidden bg-slate-900 border border-white/10 hidden sm:block">
                    <img 
                      src={`https://img.youtube.com/vi/${item.videoId}/default.jpg`}
                      className="w-full h-full object-cover opacity-60"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Play className={cn(
                        "w-3 h-3 md:w-4 md:h-4 transition-transform",
                        activeVideo?.id === item.id ? "text-indigo-600 dark:text-indigo-400 scale-110 fill-current" : "text-white/80 dark:text-white/40 group-hover:scale-110"
                      )} />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={cn(
                      "text-[9px] md:text-xs font-black uppercase tracking-widest mb-0.5",
                      activeVideo?.id === item.id ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500"
                    )}>
                      #{index + 1} • {item.category}
                    </p>
                    <h4 className={cn(
                      "text-xs md:text-sm font-bold truncate transition-colors",
                      activeVideo?.id === item.id ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white"
                    )}>
                      {item.title}
                    </h4>
                  </div>
                </button>
              ))}
            </div>

            <div className="p-4 md:p-6 bg-slate-50 dark:bg-white/[0.02] border-t border-slate-100 dark:border-white/5">
              <button 
                onClick={() => showNotification("Simpan playlist ini belum tersedia, pantau terus ya!", "info")}
                className="w-full py-3.5 md:py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-xl md:rounded-2xl hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-2 text-sm md:text-base"
              >
                Simpan ke Akun Gue <Sparkles className="w-4 h-4 md:w-5 md:h-5 fill-indigo-500 text-indigo-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
