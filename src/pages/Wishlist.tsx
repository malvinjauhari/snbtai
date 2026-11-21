import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Trash2, ChevronRight, BookOpen, Star, CheckCircle2, XCircle, Info, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNotification } from '@/src/context/NotificationContext';
import { cn } from '@/src/lib/utils';
import { renderMath } from '@/src/utils/textParser';
import 'katex/dist/katex.min.css';

export default function Wishlist() {
  const [items, setItems] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const { showNotification } = useNotification();

  useEffect(() => {
    const localWishlist = JSON.parse(localStorage.getItem('pejuang_wishlist') || '[]');
    setItems(localWishlist);
  }, []);

  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = items.filter(item => item.id !== id);
    localStorage.setItem('pejuang_wishlist', JSON.stringify(updated));
    setItems(updated);
    showNotification("Dihapus dari wishlist.", "info");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-black text-slate-900 dark:text-white flex items-center gap-4">
          Wishlist Soal.
          <div className="px-4 py-1 bg-rose-500/10 text-rose-500 text-sm rounded-full border border-rose-500/20">
            {items.length} Soal
          </div>
        </h2>
      </div>

      <p className="text-slate-500 dark:text-slate-400 font-medium">
        Kumpulan soal-soal tersulit yang lu simpen buat dipelajarin lagi nanti.
        <br />
        <span className="text-[10px] uppercase font-black tracking-widest text-indigo-500 opacity-70">
          (Data ini kesimpen di browser lu aja ya Pejuang!)
        </span>
      </p>

      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {items.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem] bg-white/50 dark:bg-slate-900/30"
            >
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                 <Heart className="w-10 h-10 text-slate-300 dark:text-slate-700" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Kosong, Melompong.</h3>
              <p className="text-slate-500 mt-2">Belum ada soal yang lu simpen. Semangat cari soal sulit!</p>
              <Link to="/dashboard/bank-soal" className="inline-block mt-8 px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-600/20 hover:scale-105 active:scale-95 transition-all">
                Cari Soal Sekarang
              </Link>
            </motion.div>
          ) : (
            items.map((item, index) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={() => setSelectedItem(item)}
                className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 hover:border-indigo-500 transition-all shadow-sm cursor-pointer"
              >
                <div className="flex items-center justify-between gap-6">
                  <div className="flex items-start gap-6">
                    <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center shrink-0 border border-slate-100 dark:border-transparent">
                      <BookOpen className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black rounded-md border border-indigo-500/20 uppercase">
                          {item.subtest}
                        </span>
                        <span className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase">LEVEL {item.level}</span>
                      </div>
                      <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 line-clamp-2 leading-relaxed">
                        {item.text.replace(/\$|\$\$/g, '').substring(0, 150)}...
                      </h4>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase mt-3">Disimpan pada: {new Date(item.savedAt).toLocaleDateString('id-ID')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={(e) => handleRemove(item.id, e)}
                      className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800 text-rose-500 hover:bg-rose-500 hover:text-white transition-all border border-slate-100 dark:border-transparent shadow-sm"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    {/* Note: We can't easily link back to a specific session because we don't store sessionId in item. 
                        But we can show a preview or something. For now, since it's just a wishlist of the question itself. */}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-slate-950/40 backdrop-blur-md overflow-y-auto">
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="w-full max-w-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-[2.5rem] p-8 md:p-10 space-y-8 shadow-2xl relative my-auto scrollbar-none"
             >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center">
                      <Star className="w-5 h-5 text-indigo-500 fill-indigo-500" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                        {selectedItem.subtest}
                      </span>
                      <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        Level {selectedItem.level}
                      </span>
                    </div>
                  </div>
                  <button onClick={() => setSelectedItem(null)} className="p-3 bg-slate-100 dark:bg-white/5 hover:bg-rose-500 hover:text-white rounded-2xl transition-all group">
                    <X className="w-6 h-6 text-slate-400 group-hover:text-white" />
                  </button>
                </div>

                <div className="space-y-8">
                   <div className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white leading-relaxed">
                     {renderMath(selectedItem.text)}
                   </div>

                   {/* Quantity Comparison UI */}
                   {selectedItem.type === 'quantity_comparison' && selectedItem.quantityP && selectedItem.quantityQ && (
                     <div className="flex flex-col sm:flex-row items-stretch justify-center gap-4 sm:gap-8 bg-slate-50 dark:bg-slate-900/40 p-6 md:p-8 rounded-[1.5rem] border border-slate-200 dark:border-slate-800">
                       <div className="flex-1 flex flex-col items-center justify-center text-center space-y-2">
                         <span className="text-sm md:text-base font-black text-slate-400 dark:text-slate-500 tracking-widest">KUANTITAS P</span>
                         <div className="text-lg md:text-2xl font-bold text-slate-900 dark:text-indigo-400">
                           {renderMath(selectedItem.quantityP)}
                         </div>
                       </div>
                       
                       <div className="hidden sm:flex w-px bg-slate-200 dark:bg-slate-800" />
                       <div className="sm:hidden h-px bg-slate-200 dark:bg-slate-800 my-2" />
                       
                       <div className="flex-1 flex flex-col items-center justify-center text-center space-y-2">
                         <span className="text-sm md:text-base font-black text-slate-400 dark:text-slate-500 tracking-widest">KUANTITAS Q</span>
                         <div className="text-lg md:text-2xl font-bold text-slate-900 dark:text-indigo-400">
                           {renderMath(selectedItem.quantityQ)}
                         </div>
                       </div>
                     </div>
                   )}

                   <div className="grid grid-cols-1 gap-4">
                     {Object.entries(selectedItem.options || {}).map(([key, value]) => {
                       const isCorrect = key === selectedItem.correctOption;
                       return (
                        <div key={key} className={cn(
                          "p-5 rounded-2xl border flex items-center gap-5 transition-all relative overflow-hidden group/opt",
                          isCorrect 
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400 shadow-lg shadow-emerald-500/5" 
                            : "bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                        )}>
                          {isCorrect && (
                            <div className="absolute top-0 right-0 p-1 bg-emerald-500 text-white rounded-bl-xl">
                              <CheckCircle2 className="w-3 h-3" />
                            </div>
                          )}
                          <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg transition-all",
                            isCorrect 
                              ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/40" 
                              : "bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 shadow-sm"
                          )}>
                            {key}
                          </div>
                          <div className="font-medium text-lg flex-1">
                            {renderMath(value as string)}
                          </div>
                        </div>
                       );
                     })}
                   </div>
                </div>

                <div className="p-8 bg-indigo-500/5 border border-indigo-500/10 rounded-[2rem] space-y-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <BookOpen className="w-20 h-20 text-indigo-500" />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-500 rounded-lg">
                      <Info className="w-4 h-4 text-white" />
                    </div>
                    <h4 className="text-sm font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest">Pembahasan Lengkap</h4>
                  </div>

                  <div className="text-slate-600 dark:text-slate-300 leading-[1.8] font-medium text-sm md:text-base selection:bg-indigo-500/20">
                    {renderMath(selectedItem.explanation || "Belum ada pembahasan tersedia untuk soal ini.")}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => setSelectedItem(null)}
                    className="flex-1 py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 active:scale-95 transition-all shadow-xl shadow-indigo-600/20"
                  >
                    Selesai Belajar
                  </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
