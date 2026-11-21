import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Search, Plus, Trash2, Languages, BookMarked, Loader2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { db, auth } from '@/src/services/firebase';
import { collection, query, where, orderBy, getDocs, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { useNotification } from '@/src/context/NotificationContext';

import { PageLoader } from '@/src/components/shared/PageLoader';

export default function AmbisHabit() {
  const isWishlist = window.location.pathname.includes('wishlist');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchItems();
  }, [isWishlist]);

  const fetchItems = async () => {
    const user = auth.currentUser;
    if (!user) return;

    setLoading(true);
    try {
      if (isWishlist) {
        // Fetch wishlisted questions from Firestore subcollection
        const wishlistRef = collection(db, `users/${user.uid}/wishlist`);
        const q = query(wishlistRef, orderBy('savedAt', 'desc'));
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data(), 
          title: "Saved Question", // Fallback if needed
          sub: doc.data().subtest,
          date: doc.data().savedAt ? new Date(doc.data().savedAt.seconds * 1000).toLocaleDateString() : 'Recent'
        }));
        setItems(data);
      } else {
        // Fetch saved vocabs
        const vocabRef = collection(db, `users/${user.uid}/vocabs`);
        const q = query(vocabRef, orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setItems(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      if (isWishlist) {
        await deleteDoc(doc(db, `users/${user.uid}/wishlist`, id));
        setItems(items.filter(i => i.id !== id));
        showNotification("Question removed from wishlist.", "success");
      } else {
        await deleteDoc(doc(db, `users/${user.uid}/vocabs`, id));
        setItems(items.filter(i => i.id !== id));
        showNotification("Vocab deleted.", "success");
      }
    } catch (error) {
      showNotification("Failed to delete.", "error");
    }
  };

  const [reviewItem, setReviewItem] = useState<any>(null);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-indigo-400">
             {isWishlist ? <BookMarked className="w-8 h-8" /> : <Languages className="w-8 h-8" />}
             <h1 className="text-5xl font-black tracking-tight text-white">{isWishlist ? 'Wishlist.' : 'Vocab Save.'}</h1>
          </div>
          <p className="text-slate-400 font-medium">
            {isWishlist ? 'Simpan soal yang bikin lu penasaran buat dipelajarin lagi.' : 'Tabungan kata-kata sulit buat nambah amunisi Literasi lu.'}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="p-4 bg-slate-900 border border-slate-800 rounded-2xl hover:border-slate-700 transition-all text-slate-500 hover:text-white">
            <Search className="w-6 h-6" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <PageLoader fullScreen={false} />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence mode="popLayout">
            {items.length === 0 ? (
              <div className="text-center py-12 text-slate-500 font-bold italic border border-dashed border-slate-800 rounded-3xl">
                Belum ada data cuy. {isWishlist ? 'Simpen soal pas lagi ngerjain simulasi!' : 'Coba highlight teks di halaman simulasi!'}
              </div>
            ) : items.map((item: any, i) => (
              <motion.div
                key={item.id || i}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl flex items-center justify-between hover:bg-slate-800 transition-all group"
              >
                <div className="space-y-2 flex-1 mr-4">
                  <span className="px-2 py-0.5 bg-indigo-500/10 text-[9px] font-black text-indigo-400 border border-indigo-500/20 rounded uppercase tracking-wider">{item.subtest || item.sub}</span>
                  <h3 className="text-xl font-bold text-white tracking-tight line-clamp-1">
                    {isWishlist ? item.text : item.word}
                  </h3>
                  <p className="text-sm text-slate-400 font-medium leading-relaxed italic border-l-2 border-slate-700 pl-4">
                    {isWishlist ? `Subtest: ${item.subtest} | Saved: ${item.date}` : item.meaning}
                  </p>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="p-3 bg-slate-800 text-slate-400 hover:text-rose-400 rounded-xl transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  {isWishlist && (
                    <button 
                      onClick={() => setReviewItem(item)}
                      className="px-6 py-3 bg-white text-slate-950 font-black rounded-xl hover:scale-105 transition-all text-sm"
                    >
                      Review
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Review Modal */}
      <AnimatePresence>
        {reviewItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl overflow-y-auto">
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="w-full max-w-2xl bg-slate-900 border border-white/10 rounded-[2.5rem] p-10 space-y-8 shadow-2xl relative my-auto"
             >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-indigo-600/20 text-indigo-400 text-[10px] font-black rounded-full border border-indigo-500/20 uppercase tracking-widest">
                      {reviewItem.subtest}
                    </span>
                    <span className="px-3 py-1 bg-white/5 text-slate-400 text-[10px] font-black rounded-full border border-white/10 uppercase tracking-widest">
                      Level {reviewItem.level}
                    </span>
                  </div>
                  <button onClick={() => setReviewItem(null)} className="p-3 hover:bg-white/10 rounded-2xl transition-colors">
                    <Trash2 className="w-6 h-6 text-slate-400 rotate-45" />
                  </button>
                </div>

                <div className="space-y-6">
                   <div className="text-xl md:text-2xl font-bold text-white leading-relaxed">
                     {reviewItem.text}
                   </div>

                   <div className="grid grid-cols-1 gap-3">
                     {Object.entries(reviewItem.options || {}).map(([key, value]) => (
                       <div key={key} className={cn(
                         "p-5 rounded-2xl border flex items-center gap-4",
                         key === reviewItem.correctOption 
                           ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400" 
                           : "bg-white/5 border-white/10 text-slate-400"
                       )}>
                         <div className={cn(
                           "w-10 h-10 rounded-xl flex items-center justify-center font-black",
                           key === reviewItem.correctOption ? "bg-emerald-500 text-white" : "bg-white/10 text-slate-400"
                         )}>
                           {key}
                         </div>
                         <span className="font-medium text-lg">{value as string}</span>
                       </div>
                     ))}
                   </div>
                </div>

                <div className="p-8 bg-white/5 border border-white/10 rounded-3xl space-y-4">
                  <h4 className="text-sm font-black text-indigo-400 uppercase tracking-widest">Explanation</h4>
                  <p className="text-slate-300 leading-relaxed italic">{reviewItem.explanation}</p>
                </div>

                <button 
                  onClick={() => setReviewItem(null)}
                  className="w-full py-5 bg-white text-slate-950 font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl"
                >
                  Selesai Review
                </button>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
