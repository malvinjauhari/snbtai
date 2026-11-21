import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Save, 
  Layout, 
  Globe, 
  Lock, 
  Youtube, 
  ArrowLeft,
  Loader2,
  Image as ImageIcon,
  CheckCircle2,
  X
} from 'lucide-react';
import { auth, db } from '@/src/services/firebase';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  getDocs, 
  query, 
  where,
  orderBy, 
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/src/lib/utils';
import { useNotification } from '@/src/context/NotificationContext';

// Helper to extract YouTube ID
const getYoutubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// Sortable Item Component
function SortableVideoItem({ video, onRemove }: { video: any, onRemove: (id: string) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: video.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className="group flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl hover:border-indigo-500/30 transition-all mb-4"
    >
      <button 
        {...attributes} 
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-2 text-slate-500 hover:text-white"
      >
        <GripVertical className="w-5 h-5" />
      </button>
      
      <div className="relative w-32 aspect-video rounded-xl overflow-hidden bg-slate-900 shrink-0">
        <img 
          src={`https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <Youtube className="w-6 h-6 text-white/50" />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{video.category || 'Materi'}</span>
          <span className="text-slate-600 font-bold text-[10px]">#{(video.position || 0) + 1}</span>
        </div>
        <h4 className="text-white font-bold truncate">{video.title || video.youtubeUrl}</h4>
        <p className="text-xs text-slate-500 truncate">{video.youtubeUrl}</p>
      </div>

      <button 
        onClick={() => onRemove(video.id)}
        className="p-3 text-slate-500 hover:text-rose-400 bg-white/5 hover:bg-rose-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

const categories = [
  'Penalaran Umum',
  'Pengetahuan dan Pemahaman Umum',
  'Pemahaman Bacaan dan Menulis',
  'Pengetahuan Kuantitatif',
  'Literasi dalam Bahasa Indonesia',
  'Literasi dalam Bahasa Inggris',
  'Penalaran Matematika'
];

import { PageLoader } from '@/src/components/shared/PageLoader';

export default function PlaylistEditor() {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  
  // Playlist State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [slug, setSlug] = useState('');
  const [mode, setMode] = useState<'workflow' | 'normal'>('normal');
  const [playlistCategory, setPlaylistCategory] = useState(categories[0]);
  const [isPublic, setIsPublic] = useState(true);
  const [thumbnail, setThumbnail] = useState('');
  const [originalSlug, setOriginalSlug] = useState('');
  
  // Video State
  const [videos, setVideos] = useState<any[]>([]);
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoCategory, setNewVideoCategory] = useState(categories[0]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (isEditing) {
      const fetchPlaylist = async () => {
        try {
          const docRef = doc(db, 'playlists', id);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.creatorId !== auth.currentUser?.uid) {
              showNotification("Gak punya ijin edit ini!", "error");
              navigate('/playlist/mine');
              return;
            }
            
            setTitle(data.title);
            setDescription(data.description || '');
            setSlug(data.slug);
            setOriginalSlug(data.slug);
            setMode(data.mode);
            setPlaylistCategory(data.category || categories[0]);
            setIsPublic(data.isPublic);
            setThumbnail(data.thumbnail || '');
            
            // Fetch items
            const itemsSnap = await getDocs(query(collection(db, 'playlists', id, 'items'), orderBy('position')));
            setVideos(itemsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
          }
        } catch (error) {
          console.error("Error fetching playlist:", error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchPlaylist();
    }
  }, [id, isEditing, navigate]);

  const addVideo = () => {
    const videoId = getYoutubeId(newVideoUrl);
    if (!videoId) {
      showNotification("Link YouTube gak valid nih", "error");
      return;
    }

    const newVideo = {
      id: Math.random().toString(36).substr(2, 9),
      youtubeUrl: newVideoUrl,
      videoId: videoId,
      title: `Video Baru ${videos.length + 1}`,
      category: newVideoCategory,
      position: videos.length
    };

    setVideos([...videos, newVideo]);
    setNewVideoUrl('');
    showNotification("Video ditambahkan!", "success");
  };

  const removeVideo = (videoId: string) => {
    setVideos(videos.filter(v => v.id !== videoId).map((v, i) => ({ ...v, position: i })));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setVideos((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        const result = arrayMove(items, oldIndex, newIndex);
        return result.map((item, index) => ({ ...item, position: index }));
      });
    }
  };

  const savePlaylist = async () => {
    if (!title || !slug) {
      showNotification("Judul sama slug wajib ada!", "error");
      return;
    }

    const processedSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');

    setSaving(true);
    try {
      // Check for slug conflict
      if (!isEditing || processedSlug !== originalSlug) {
        const slugQuery = query(collection(db, 'playlists'), where('slug', '==', processedSlug));
        const slugSnap = await getDocs(slugQuery);
        if (!slugSnap.empty) {
          showNotification("URL slug ini sudah dipake orang lain, cari yang lain ya!", "error");
          setSaving(false);
          return;
        }
      }

      const playlistId = isEditing ? id : doc(collection(db, 'playlists')).id;
      const user = auth.currentUser;
      
      const playlistData = {
        title,
        description,
        slug: processedSlug,
        mode,
        category: playlistCategory,
        isPublic,
        thumbnail: thumbnail || (videos.length > 0 ? `https://img.youtube.com/vi/${videos[0].videoId}/hqdefault.jpg` : ''),
        creatorId: user?.uid,
        creatorName: user?.displayName || 'Anonim',
        videoCount: videos.length,
        updatedAt: serverTimestamp(),
        ...(isEditing ? {} : { createdAt: serverTimestamp() })
      };

      await setDoc(doc(db, 'playlists', playlistId), playlistData, { merge: true });

      // Save videos in batch
      const batch = writeBatch(db);
      
      // We rewrite all items for simplicity in this version.
      // In a production app, we would only sync diffs.
      const itemsCollection = collection(db, 'playlists', playlistId, 'items');
      
      // Cleanup logic would go here if we were being thorough about deleting removed items
      // For now, we'll just set them.
      
      videos.forEach(v => {
        const itemRef = doc(itemsCollection, v.id);
        batch.set(itemRef, {
          youtubeUrl: v.youtubeUrl,
          videoId: v.videoId,
          title: v.title || v.youtubeUrl,
          category: v.category || '',
          position: v.position,
          createdAt: serverTimestamp()
        });
      });

      await batch.commit();
      showNotification("Playlist berhasil disimpan!", "success");
      navigate('/playlist/mine');
    } catch (error) {
      console.error("Error saving playlist:", error);
      showNotification("Gagal simpan playlist", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <PageLoader fullScreen={false} />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/playlist/mine')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-bold"
        >
          <ArrowLeft className="w-5 h-5" /> Kembali
        </button>
        <button 
          onClick={savePlaylist}
          disabled={saving}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-black py-3 px-8 rounded-2xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {isEditing ? 'Update Playlist' : 'Buat Playlist'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: Settings */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <div className="p-2 bg-indigo-500/20 rounded-xl">
                 <Layout className="w-5 h-5 text-indigo-400" />
              </div>
              Info Dasar
            </h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Judul Playlist</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Jurus Jitu SNBT 2026"
                  className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Slug (URL)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 text-sm font-bold">/</span>
                  <input 
                    type="text" 
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                    placeholder="belajar-asik"
                    className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-3 pl-8 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Deskripsi</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Apa yang dipelajari di sini?"
                  rows={3}
                  className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium resize-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
               <div className="p-2 bg-purple-500/20 rounded-xl">
                 <Globe className="w-5 h-5 text-purple-400" />
              </div>
              Konfigurasi
            </h2>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white">Privasi</p>
                  <p className="text-xs text-slate-500">{isPublic ? 'Bisa dilihat publik' : 'Hanya lu yang tau'}</p>
                </div>
                <button 
                  onClick={() => setIsPublic(!isPublic)}
                  className={cn(
                    "relative w-14 h-8 rounded-full transition-colors duration-300",
                    isPublic ? "bg-emerald-500" : "bg-slate-700"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300",
                    isPublic ? "left-7" : "left-1"
                  )} />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-bold text-white px-1">Kategori Utama</p>
                <select 
                  value={playlistCategory}
                  onChange={(e) => setPlaylistCategory(e.target.value)}
                  className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium appearance-none cursor-pointer"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-bold text-white px-1">Mode Tampilan</p>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setMode('normal')}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all",
                      mode === 'normal' ? "bg-indigo-600/20 border-indigo-500 text-white" : "bg-white/5 border-white/10 text-slate-500 hover:text-white"
                    )}
                  >
                    <Layout className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-widest">Normal</span>
                  </button>
                  <button 
                    onClick={() => setMode('workflow')}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all",
                      mode === 'workflow' ? "bg-indigo-600/20 border-indigo-500 text-white" : "bg-white/5 border-white/10 text-slate-500 hover:text-white"
                    )}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-widest">Terstruktur</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Video List */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-white px-1">Isi Video</h2>
              <span className="text-[10px] font-black bg-indigo-500 text-white px-3 py-1 rounded-full uppercase tracking-widest">
                {videos.length} Video Terkumpul
              </span>
            </div>

            {/* Add Video Form */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-7">
                <div className="relative">
                  <Youtube className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                  <input 
                    type="text" 
                    value={newVideoUrl}
                    onChange={(e) => setNewVideoUrl(e.target.value)}
                    placeholder="Paste link YouTube di sini..."
                    className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 transition-all font-medium"
                  />
                </div>
              </div>
              <div className="md:col-span-3">
                 <select 
                  value={newVideoCategory}
                  onChange={(e) => setNewVideoCategory(e.target.value)}
                  className="w-full h-full bg-slate-900/50 border border-white/10 rounded-2xl px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold appearance-none cursor-pointer"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <button 
                  onClick={addVideo}
                  className="w-full h-full bg-white text-slate-900 font-black rounded-2xl hover:bg-indigo-100 transition-all active:scale-95"
                >
                  Tambah
                </button>
              </div>
            </div>

            {/* Video List */}
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext 
                  items={videos.map(v => v.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {videos.length > 0 ? (
                    videos.map((video) => (
                      <SortableVideoItem 
                        key={video.id} 
                        video={video} 
                        onRemove={removeVideo}
                      />
                    ))
                  ) : (
                    <div className="text-center py-20 bg-white/[0.02] border border-dashed border-white/10 rounded-3xl">
                      <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Belum ada video. Ayo tambah!</p>
                    </div>
                  )}
                </SortableContext>
              </DndContext>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
