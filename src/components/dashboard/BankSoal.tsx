import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Play, 
  Trash2, 
  BookOpen, 
  Binary, 
  PenTool, 
  Languages, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { auth, db } from '@/src/services/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { deleteSubtestSession } from '@/src/services/ai';
import ConfirmModal from '@/src/components/shared/ConfirmModal';

export default function BankSoal() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    const user = auth.currentUser;
    if (!user) return;
    
    try {
      const q = query(
        collection(db, 'subtest_sessions'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc'),
        limit(20)
      );
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSessions(data);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, sessionId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteId(sessionId);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteSubtestSession(deleteId);
      setSessions(prev => prev.filter(s => s.id !== deleteId));
    } catch (error) {
      console.error("Error deleting session:", error);
    } finally {
      setDeleteId(null);
    }
  };

  const getSubtestIcon = (subtest: string) => {
    switch (subtest) {
      case 'PK': return Binary;
      case 'PM': return PenTool;
      case 'LBI':
      case 'LBE': return Languages;
      default: return BookOpen;
    }
  };

  return (
    <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-black text-slate-900 dark:text-white">Bank Soal.</h2>
      </div>

      <div className="p-8 bg-indigo-600 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-indigo-600/20 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000" />
          <div className="relative z-10 space-y-2">
             <h3 className="text-3xl font-black text-white">Generate Sekarang!</h3>
             <p className="text-white/70 font-medium">Bikin soal kustom sesuai mood belajar lu hari ini.</p>
          </div>
          <Link to="/chat" className="px-10 py-5 bg-white text-indigo-600 font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl relative z-10 flex items-center gap-2">
            AI Magic <Sparkles className="w-5 h-5" />
          </Link>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="p-12 text-center text-slate-500 font-bold animate-pulse bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
             Memuat simulasi kustom lu...
          </div>
        ) : sessions.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
             Waduh, belum ada soal yang lu buat nih. Generate dulu di AI Magic!
          </div>
        ) : sessions.map((item) => (
          <div key={item.id} className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex items-center justify-between hover:border-indigo-500 transition-all group shadow-sm">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-100 dark:border-transparent shadow-sm">
                 {(() => {
                   const Icon = getSubtestIcon(item.subtest);
                   return <Icon className="w-7 h-7 text-indigo-500 dark:text-indigo-400" />;
                 })()}
              </div>
              <div>
                 <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">{item.id.substring(0, 8)}</span>
                    <span className="w-1 h-1 bg-slate-200 dark:bg-slate-700 rounded-full" />
                    <span className="text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest">{item.subtest}</span>
                 </div>
                 <h4 className="text-lg font-bold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-white transition-colors">Simulasi {item.subtest} Level {item.level}</h4>
                 <p className="text-xs text-slate-500 font-medium mt-1">{item.questions?.length || 0} Soal • Dibuat oleh AI</p>
              </div>
            </div>
            <div className="flex items-center gap-3 relative z-10">
              <button 
                onClick={(e) => handleDelete(e, item.id)}
                className="w-12 h-12 bg-white dark:bg-slate-900 text-rose-500 rounded-2xl flex items-center justify-center hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all shadow-sm border border-slate-200 dark:border-slate-800 cursor-pointer"
                title="Hapus Simulasi"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <Link to={`/question/${item.id}`} className="w-12 h-12 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-2xl flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all group-hover:scale-110 shadow-sm border border-transparent">
                 <Play className="w-5 h-5 fill-current" />
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      <ConfirmModal 
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Hapus Simulasi?"
        message="Simulasi ini bakal dihapus permanen dari riwayat lu. Yakin nih mau dihapus?"
        confirmText="Hapus Permanen"
      />
    </div>
  );
}
