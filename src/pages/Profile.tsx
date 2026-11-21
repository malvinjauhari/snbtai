import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Camera, GraduationCap, MapPin, Sparkles, Save, ArrowLeft } from 'lucide-react';
import { auth, db, handleFirestoreError, OperationType } from '@/src/services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNotification } from '@/src/context/NotificationContext';
import { useAuth } from '@/src/context/AuthContext';
import { cn } from '@/src/lib/utils';

import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '@/src/context/ThemeContext';
import { CreditBalanceCard } from '../components/credits/CreditBalanceCard';

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [profile, setProfile] = useState({
    displayName: '',
    dreamUniversity: '',
    dreamMajor: '',
    reason: '',
    photoBase64: ''
  });
  const { showNotification } = useNotification();
  const { refreshProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const docRef = doc(db, 'users', user.uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          setProfile({
            displayName: data.displayName || data.name || '',
            dreamUniversity: data.dreamUniversity || '',
            dreamMajor: data.dreamMajor || '',
            reason: data.reason || '',
            photoBase64: data.photoBase64 || ''
          });
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) { // Increased raw limit but will compress
      showNotification("Ukuran file terlalu besar! Coba foto lain.", "warning");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Target dimensions for KTM photo (approx 4:5 ratio)
        const MAX_WIDTH = 400;
        const MAX_HEIGHT = 520;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        // Compress aggressively to JPEG (base64)
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
        setProfile(prev => ({ ...prev, photoBase64: compressedBase64 }));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return;

    setSaving(true);
    try {
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, {
        ...profile,
        updatedAt: new Date()
      }, { merge: true });
      showNotification("Profil berhasil di-update!", "success");
      await refreshProfile();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
      showNotification("Yah, update profil gagal. Coba lagi ya.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Saving Overlay */}
      <AnimatePresence>
        {saving && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[9999] flex flex-col items-center justify-center p-6 text-center"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl flex flex-col items-center gap-6 max-w-sm w-full"
            >
              <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">Lagi proses nih,</h3>
                <p className="text-slate-500 font-bold">sabar ya calon maba...</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-4">
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">My Profile.</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Profile Card / Identity */}
        <div className="lg:col-span-1 space-y-6">
           <div className="p-6 md:p-8 premium-card rounded-[2rem] flex flex-col items-center text-center space-y-4 md:space-y-6">
              <div className="relative group">
                <div className="w-32 h-40 bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden border-4 border-white/10 shadow-xl relative">
                  {profile.photoBase64 ? (
                    <img src={profile.photoBase64} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-16 h-16 text-slate-400" />
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 p-3 bg-indigo-600 text-white rounded-xl shadow-lg hover:scale-110 active:scale-95 transition-all"
                >
                  <Camera className="w-5 h-5" />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handlePhotoUpload} 
                  className="hidden" 
                  accept="image/*"
                />
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white line-clamp-1">{profile.displayName || 'Nama Pejuang'}</h3>
                <p className="text-xs font-black text-indigo-500 uppercase tracking-widest mt-1">Status: Pejuang Aktif</p>
              </div>

              <div className="w-full pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
                 <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-bold uppercase">ID Pejuang</span>
                    <span className="font-mono text-indigo-400">#{(auth.currentUser?.uid || 'USER').substring(0, 10).toUpperCase()}</span>
                 </div>
              </div>
           </div>
           
           <div className="h-64">
             <CreditBalanceCard />
           </div>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
           {/* Section: Kartu Identitas */}
           <div className="p-6 md:p-8 glass-panel rounded-[2rem] space-y-6">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                    <User className="w-5 h-5" />
                 </div>
                 <h4 className="text-base md:text-lg font-black text-slate-900 dark:text-white">Identitas Mahasiswa Masa Depan</h4>
              </div>

              <div className="space-y-4">
                 <div className="space-y-1.5 md:space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-3 md:ml-4">Nama Lengkap</label>
                    <input 
                      type="text" 
                      value={profile.displayName}
                      onChange={(e) => setProfile(prev => ({ ...prev, displayName: e.target.value }))}
                      placeholder="Masukkan nama lengkap lu..."
                      className="w-full px-5 py-3 md:px-6 md:py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 rounded-xl md:rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm md:text-base"
                    />
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 md:space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-3 md:ml-4">Kampus Impian</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="text" 
                          value={profile.dreamUniversity}
                          onChange={(e) => setProfile(prev => ({ ...prev, dreamUniversity: e.target.value }))}
                          placeholder="Contoh: UI, ITB, UGM"
                          className="w-full pl-11 pr-5 py-3 md:pl-12 md:px-6 md:py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 rounded-xl md:rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5 md:space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-3 md:ml-4">Jurusan Impian</label>
                      <div className="relative">
                        <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="text" 
                          value={profile.dreamMajor}
                          onChange={(e) => setProfile(prev => ({ ...prev, dreamMajor: e.target.value }))}
                          placeholder="Contoh: Kedokteran, STEI"
                          className="w-full pl-11 pr-5 py-3 md:pl-12 md:px-6 md:py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 rounded-xl md:rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm"
                        />
                      </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Section: Motivasi */}
           <div className="p-6 md:p-8 glass-panel rounded-[2rem] space-y-6">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
                    <Sparkles className="w-5 h-5" />
                 </div>
                 <h4 className="text-base md:text-lg font-black text-slate-900 dark:text-white leading-tight">Ambitious Goals & Motivation</h4>
              </div>

              <div className="space-y-1.5 md:space-y-2">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-3 md:ml-4">Apa Alasan Lu Harus Lulus?</label>
                 <textarea 
                   value={profile.reason}
                   onChange={(e) => setProfile(prev => ({ ...prev, reason: e.target.value }))}
                   placeholder="Tulis alasan terkuat lu di sini biar tiap liat dashboard lu makin semangat!"
                   rows={4}
                   className="w-full px-5 py-3 md:px-6 md:py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 rounded-xl md:rounded-2xl outline-none focus:ring-2 focus:ring-purple-500 font-medium text-sm md:text-base text-slate-700 dark:text-slate-300 resize-none"
                 />
              </div>
           </div>

           {/* Section: Tampilan & Personalisasi */}
           <div className="p-6 md:p-8 glass-panel rounded-[2rem] space-y-6">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
                    <Monitor className="w-5 h-5" />
                 </div>
                 <h4 className="text-base md:text-lg font-black text-slate-900 dark:text-white leading-tight">Tampilan & Personalisasi</h4>
              </div>

              <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-3 md:ml-4 block">Mode Tema</label>
                 <div className="grid grid-cols-2 gap-4">
                    <button 
                       onClick={() => theme === 'dark' && toggleTheme()}
                       className={cn(
                          "flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all",
                          theme === 'light' 
                             ? "border-sky-500 bg-sky-500/5 shadow-md shadow-sky-500/10 text-sky-600" 
                             : "border-slate-200 dark:border-slate-800 bg-transparent text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                       )}
                    >
                       <Sun className="w-6 h-6" />
                       <span className="font-bold text-sm">Mode Terang</span>
                    </button>
                    <button 
                       onClick={() => theme === 'light' && toggleTheme()}
                       className={cn(
                          "flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all",
                          theme === 'dark' 
                             ? "border-sky-500 bg-sky-500/5 shadow-md shadow-sky-500/10 text-sky-400" 
                             : "border-slate-200 dark:border-slate-800 bg-transparent text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                       )}
                    >
                       <Moon className="w-6 h-6" />
                       <span className="font-bold text-sm">Mode Gelap</span>
                    </button>
                 </div>
              </div>
           </div>

           {/* Save Button */}
           <div className="flex justify-end gap-4">
              <button 
                onClick={handleSave}
                disabled={saving}
                className={cn(
                  "w-full md:w-auto px-10 py-4 md:py-5 bg-indigo-600 text-white font-black rounded-xl md:rounded-2xl shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 text-sm md:text-base",
                  saving && "animate-pulse"
                )}
              >
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
                <Save className="w-5 h-5" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
