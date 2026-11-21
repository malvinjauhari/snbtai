import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '@/src/services/firebase';
import { useAuth } from '@/src/context/AuthContext';
import { Camera, Upload, CheckCircle2, MapPin, GraduationCap, Quote, Sparkles, Rocket } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { refreshProfile } = useAuth();

  const [formData, setFormData] = useState({
    displayName: '',
    dreamUniversity: '',
    dreamMajor: '',
    reason: '',
    ambisType: 'Si Ambis',
    collegePurpose: '',
    photoBase64: ''
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        
        // Compress image before saving
        const compressed = await new Promise<string>((resolve) => {
          const img = new Image();
          img.src = base64;
          img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            const MAX_SIZE = 400; // Sufficient for avatar
            
            if (width > height) {
              if (width > MAX_SIZE) {
                height *= MAX_SIZE / width;
                width = MAX_SIZE;
              }
            } else {
              if (height > MAX_SIZE) {
                width *= MAX_SIZE / height;
                height = MAX_SIZE;
              }
            }
            
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.6)); // High compression
          };
        });

        setFormData({ ...formData, photoBase64: compressed });
      };
      reader.readAsDataURL(file);
    }
  };

  const nextStep = () => setStep(step + 1);

  const finalizeOnboarding = async () => {
    setLoading(true);
    const userId = auth.currentUser?.uid;
    const path = `users/${userId}`;
    try {
      const user = auth.currentUser;
      if (!user) return;

      await setDoc(doc(db, 'users', user.uid), {
        ...formData,
        uid: user.uid,
        email: user.email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      await refreshProfile();
      setStep(4); // Final step
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Step Indicator */}
      {step < 4 && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 flex items-center gap-3">
          {[1, 2, 3].map((s) => (
            <div 
              key={s} 
              className={cn(
                "h-1.5 rounded-full transition-all duration-500",
                step === s ? "w-8 bg-indigo-500" : "w-4 bg-slate-800"
              )} 
            />
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-lg space-y-8"
          >
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-black tracking-tight">Set the Identity.</h2>
              <p className="text-slate-400 font-medium text-lg">Siapa nama yang mau kita pampang di kartu mahasiswa impian lu nanti?</p>
            </div>

            <div className="space-y-6">
              <div className="flex justify-center">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-32 h-32 rounded-3xl bg-slate-900 border-2 border-dashed border-slate-800 flex flex-col items-center justify-center gap-2 hover:border-indigo-500 hover:bg-slate-800 transition-all group overflow-hidden relative"
                >
                  {formData.photoBase64 ? (
                    <img src={formData.photoBase64} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <>
                      <Camera className="w-8 h-8 text-slate-500 group-hover:text-indigo-400" />
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Upload Foto</span>
                    </>
                  )}
                  <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" accept="image/*" />
                </button>
              </div>

              <input
                type="text"
                placeholder="Nama Lengkap Pejuang"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                className="w-full px-6 py-4 bg-slate-900 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-center text-xl font-bold placeholder:text-slate-700 transition-all"
              />

              <button
                disabled={!formData.displayName || !formData.photoBase64}
                onClick={nextStep}
                className="w-full bg-white text-slate-950 font-black py-4 rounded-2xl hover:bg-slate-100 transition-all shadow-xl disabled:opacity-50"
              >
                Lanjutkan Perjalanan
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-lg space-y-8"
          >
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-black tracking-tight">The Dream Destination.</h2>
              <p className="text-slate-400 font-medium text-lg">Sebutin 1 Universitas dan Jurusan yang bikin lu rela belajar gila-gilaan!</p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Universitas Impian (Contoh: UI, ITB, UGM)"
                  value={formData.dreamUniversity}
                  onChange={(e) => setFormData({ ...formData, dreamUniversity: e.target.value })}
                  className="w-full pl-12 pr-6 py-4 bg-slate-900 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-lg font-bold"
                />
              </div>
              <div className="relative">
                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Jurusan Impian (Contoh: Kedokteran, STEI)"
                  value={formData.dreamMajor}
                  onChange={(e) => setFormData({ ...formData, dreamMajor: e.target.value })}
                  className="w-full pl-12 pr-6 py-4 bg-slate-900 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-lg font-bold"
                />
              </div>

              <div className="relative">
                <Quote className="absolute left-4 top-4 text-slate-500 w-5 h-5" />
                <textarea
                  placeholder="Kenapa lu harus lulus di jurusan itu? (Tulis 1 kalimat singkat)"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full pl-12 pr-6 py-4 bg-slate-900 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none h-32 resize-none text-lg font-medium"
                />
              </div>

              <button
                disabled={!formData.dreamUniversity || !formData.dreamMajor || !formData.reason}
                onClick={nextStep}
                className="w-full bg-white text-slate-950 font-black py-4 rounded-2xl hover:bg-slate-100 transition-all shadow-xl disabled:opacity-50"
              >
                Satu Langkah Lagi
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-lg space-y-8"
          >
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-black tracking-tight">About You.</h2>
              <p className="text-slate-400 font-medium text-lg">Lu tipe yang kayak gimana?</p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-3">
                {['Si Ambis', 'Penganut SKS', 'Pasrah'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFormData({ ...formData, ambisType: type })}
                    className={cn(
                      "p-4 rounded-2xl border text-left transition-all relative overflow-hidden",
                      formData.ambisType === type 
                        ? "bg-indigo-600/10 border-indigo-500/50 text-white" 
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                    )}
                  >
                    <div className="flex items-center justify-between relative z-10">
                      <span className="font-bold text-lg">{type === 'Si Ambis' ? '🔥 Si Ambis' : type === 'Penganut SKS' ? '⏳ Penganut SKS' : '🎲 Pasrah & Gacha'}</span>
                      {formData.ambisType === type && <CheckCircle2 className="w-5 h-5 text-indigo-400" />}
                    </div>
                    <span className="text-xs opacity-60 mt-1 block relative z-10">
                      {type === 'Si Ambis' && 'Udah belajar dari kelas 10, buku adalah koentji.'}
                      {type === 'Penganut SKS' && 'Sistem Kebut Semalam, adrenalin adalah bahan bakar.'}
                      {type === 'Pasrah' && 'Takdir udah tertulis, gacha adalah jalan ninjaku.'}
                    </span>
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 ml-1">Menurut lu, Kuliah itu buat apa?</label>
                <input
                  type="text"
                  placeholder="Singkat aja..."
                  value={formData.collegePurpose}
                  onChange={(e) => setFormData({ ...formData, collegePurpose: e.target.value })}
                  className="w-full px-6 py-4 bg-slate-900 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-lg font-medium"
                />
              </div>

              <button
                disabled={!formData.collegePurpose || loading}
                onClick={finalizeOnboarding}
                className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl hover:bg-indigo-500 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? "Menyusun Masa Depan..." : <>Cetak Kartu Impian <Sparkles className="w-5 h-5" /></>}
              </button>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="final"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xl space-y-12 flex flex-col items-center"
          >
            <div className="text-center space-y-4">
              <h2 className="text-5xl font-black tracking-tight">The Dream Card.</h2>
              <p className="text-slate-400 font-medium">Keep this motivation close to your heart.</p>
            </div>

            {/* KTM UI */}
            <motion.div 
              initial={{ rotateY: 90 }}
              animate={{ rotateY: 0 }}
              transition={{ delay: 0.3, duration: 1, type: "spring" }}
              className="w-full max-w-[440px] aspect-[1.6/1] bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 rounded-[2.5rem] p-10 border border-white/20 shadow-2xl relative overflow-hidden group"
            >
              {/* Glass overlay */}
              <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px] -z-10" />
              {/* Patterns */}
              <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px]" />
              <div className="absolute bottom-[-20%] left-[-10%] w-48 h-48 bg-purple-500/10 rounded-full blur-[60px]" />

              <div className="flex gap-8 h-full relative z-10">
                <div className="w-32 h-full rounded-2xl bg-slate-800/80 border border-white/10 overflow-hidden shrink-0 shadow-lg relative group-hover:border-white/30 transition-all">
                  <img src={formData.photoBase64} alt="Photo" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100" referrerPolicy="no-referrer" />
                  <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/40 to-transparent" />
                </div>

                <div className="flex flex-col justify-between py-1 flex-1 min-w-0">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                       <span className="px-3 py-1 bg-indigo-600 text-white text-[8px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg shadow-indigo-600/30">
                          Kartu Tanda Calon Mahasiswa
                       </span>
                    </div>

                    <div>
                      <h3 className="text-2xl font-black leading-tight truncate text-white uppercase tracking-tight">{formData.displayName}</h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[10px] font-black text-indigo-400 tracking-[0.1em] uppercase">Active Member #SNBT2026</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    <div className="flex items-center gap-2 text-white/70">
                       <MapPin className="w-3.5 h-3.5" />
                       <span className="text-xs font-bold truncate">{formData.dreamUniversity}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/70">
                       <GraduationCap className="w-3.5 h-3.5" />
                       <span className="text-xs font-bold truncate">{formData.dreamMajor}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="h-6 w-24 bg-white/5 rounded flex items-center justify-center border border-white/10">
                      <span className="text-[9px] font-mono tracking-tighter opacity-50 text-white">ID: #{(auth.currentUser?.uid || 'USER').substring(0, 8).toUpperCase()}</span>
                    </div>
                    <Rocket className="w-4 h-4 text-white/20" />
                  </div>
                </div>
              </div>

              {/* Decorative side accent */}
              <div className="absolute top-0 right-0 h-full w-1.5 bg-indigo-500/30 blur-[2px]" />
            </motion.div>

            <div className="text-center space-y-6 max-w-sm">
              <p className="text-slate-400 italic">
                "Gw pegang janji ini, lu harus setia dengan impian lu dan finalnya lu bisa cetak kartu ini saat pengumuman snbt nanti"
              </p>
              <button
                onClick={() => navigate('/dashboard/overview')}
                className="w-full bg-white text-slate-950 font-black py-4 rounded-2xl hover:bg-slate-100 transition-all shadow-xl active:scale-95"
              >
                Mulai Perjuangan Lu 🚀
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
