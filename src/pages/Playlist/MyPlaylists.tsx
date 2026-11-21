import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Grid2X2, 
  List, 
  MoreVertical, 
  Play, 
  Clock, 
  Globe, 
  Lock, 
  Trash2, 
  Edit3,
  ExternalLink,
  Ghost
} from 'lucide-react';
import { auth, db } from '@/src/services/firebase';
import { collection, query, where, getDocs, orderBy, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { cn } from '@/src/lib/utils';
import { useNotification } from '@/src/context/NotificationContext';

export default function MyPlaylists() {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchPlaylists = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const q = query(
          collection(db, 'playlists'),
          where('creatorId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPlaylists(data);
      } catch (error) {
        console.error("Error fetching playlists:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string; title: string }>({
    isOpen: false,
    id: '',
    title: ''
  });

  const handleDelete = async () => {
    const { id } = deleteModal;
    try {
      // 1. Get all items in the subcollection
      const itemsRef = collection(db, 'playlists', id, 'items');
      const itemsSnap = await getDocs(itemsRef);
      
      // 2. Delete all items in batch
      const batch = writeBatch(db);
      itemsSnap.docs.forEach((d) => {
        batch.delete(d.ref);
      });
      
      // 3. Delete the main doc
      batch.delete(doc(db, 'playlists', id));
      
      await batch.commit();
      
      setPlaylists(prev => prev.filter(p => p.id !== id));
      showNotification("Playlist berhasil dihapus permanen", "success");
      setDeleteModal({ isOpen: false, id: '', title: '' });
    } catch (error) {
      console.error("Error deleting playlist:", error);
      showNotification("Gagal hapus playlist", "error");
    }
  };

  const filteredPlaylists = playlists.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      {/* Delete Modal */}
      <AnimatePresence>
        {deleteModal.isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-slate-900 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl space-y-6"
            >
              <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-8 h-8 text-rose-500" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-white">Hapus Playlist?</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Yakin mau hapus <span className="text-white font-bold">"{deleteModal.title}"</span>? 
                  Tindakan ini permanen dan semua video di dalemnya bakal ilang selamanya.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <button 
                  onClick={() => setDeleteModal({ isOpen: false, id: '', title: '' })}
                  className="py-3 px-6 rounded-xl bg-white/5 text-white font-bold hover:bg-white/10 transition-all"
                >
                  Batal
                </button>
                <button 
                  onClick={handleDelete}
                  className="py-3 px-6 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-500 transition-all shadow-lg shadow-rose-500/20 active:scale-95"
                >
                  Ya, Hapus
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-white tracking-tight">SNBT Playlist</h1>
          <p className="text-slate-400 font-medium">Atur materi belajar lu biar makin terstruktur dan gampang dipelajari.</p>
        </div>
        <Link 
          to="/playlist/create"
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95 whitespace-nowrap"
        >
          <Plus className="w-5 h-5" /> Buat Playlist Baru
        </Link>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-3xl">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input 
            type="text"
            placeholder="Cari playlist lu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
          />
        </div>
        <div className="flex items-center gap-2 text-slate-400 text-sm font-bold bg-slate-900/50 p-1.5 rounded-xl border border-white/5">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg transition-all">Semua</button>
          <button className="px-4 py-2 hover:bg-white/5 rounded-lg transition-all">Publik</button>
          <button className="px-4 py-2 hover:bg-white/5 rounded-lg transition-all">Privat</button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3].map(i => (
            <div key={i} className="h-80 bg-white/5 rounded-[2.5rem] animate-pulse" />
          ))}
        </div>
      ) : filteredPlaylists.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredPlaylists.map((playlist, idx) => (
              <motion.div
                key={playlist.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.05 }}
                className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] overflow-hidden hover:border-indigo-500/50 transition-all shadow-xl hover:shadow-indigo-500/10"
              >
                <Link to={`/playlist/${playlist.slug}`} className="block">
                  <div className="relative aspect-video overflow-hidden">
                    {playlist.thumbnail ? (
                      <img 
                        src={playlist.thumbnail} 
                        alt={playlist.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center">
                        <Play className="w-12 h-12 text-white/20" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                    
                    <div className="absolute top-4 left-4 flex gap-2">
                       <span className={cn(
                        "flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md",
                        playlist.isPublic ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-slate-500/20 text-slate-400 border border-white/10"
                      )}>
                        {playlist.isPublic ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                        {playlist.isPublic ? "Publik" : "Privat"}
                      </span>
                      <span className="bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                        {playlist.mode === 'workflow' ? 'Terstruktur' : 'Normal'}
                      </span>
                    </div>

                    <div className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-2xl text-white">
                      <Play className="w-5 h-5 fill-current" />
                    </div>
                  </div>

                  <div className="p-8 space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">{playlist.title}</h3>
                      <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
                        {playlist.description || "Belum ada deskripsi buat playlist mantap ini."}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="flex items-center gap-3 text-slate-500 text-xs font-bold uppercase tracking-widest">
                        <List className="w-4 h-4 text-indigo-500" />
                        <span>{playlist.videoCount || 0} Video</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <button 
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(`/playlist/edit/${playlist.id}`);
                          }}
                          className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-indigo-400 transition-all"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            setDeleteModal({ isOpen: true, id: playlist.id, title: playlist.title });
                          }}
                          className="p-2 hover:bg-rose-500/10 rounded-lg text-slate-400 hover:text-rose-400 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-[3rem] border border-dashed border-white/10 space-y-6"
        >
          <div className="w-24 h-24 bg-white/5 flex items-center justify-center rounded-full">
            <Ghost className="w-12 h-12 text-slate-600" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-white">Belum ada playlist nih</h3>
            <p className="text-slate-400">Mulailah atur video belajar lu biar gak berantakan lewat playlist.</p>
          </div>
          <Link 
            to="/playlist/create"
            className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-bold"
          >
            Bikin sekarang <Plus className="w-5 h-5" />
          </Link>
        </motion.div>
      )}
    </div>
  );
}
