import { useState, useEffect } from 'react';
import { auth } from '@/src/services/firebase';
import { deleteSubtestSession } from '@/src/services/ai';
import ConfirmModal from '@/src/components/shared/ConfirmModal';
import { BankSoalAPI } from './api';
import { SubtestSession } from './types';
import { GenerateBanner } from './components/GenerateBanner';
import { SessionItem } from './components/SessionItem';

export default function BankSoal() {
  const [sessions, setSessions] = useState<SubtestSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    const user = auth.currentUser;
    if (!user) return;
    
    try {
      const data = await BankSoalAPI.fetchSessions(user.uid);
      setSessions(data);
    } catch (error) {
      // Error handled in API
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (e: React.MouseEvent, sessionId: string) => {
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

  return (
    <div className="space-y-6 md:space-y-8 pb-32 md:pb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">Bank Soal.</h2>
      </div>

      <GenerateBanner />

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
          <SessionItem key={item.id} session={item} onDelete={handleDelete} />
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
