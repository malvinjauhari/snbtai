import React from 'react';
import { motion } from 'motion/react';
import { MapPin, GraduationCap, Rocket } from 'lucide-react';
import { OnboardingFormData } from '../types';

interface StepIdentityCardProps {
  formData: OnboardingFormData;
  userId: string;
  loading?: boolean;
  onNavigate: () => void;
  onEdit?: () => void;
}

export const StepIdentityCard: React.FC<StepIdentityCardProps> = ({
  formData,
  userId,
  loading = false,
  onNavigate,
  onEdit
}) => {
  return (
    <motion.div
      key="final"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-xl space-y-12 flex flex-col items-center"
    >
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-black tracking-tight text-slate-900 dark:text-white">The Dream Card.</h2>
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
            <div className="space-y-4 text-left">
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
            
            <div className="space-y-2 mt-4 text-left">
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
                <span className="text-[9px] font-mono tracking-tighter opacity-50 text-white">ID: #{userId.substring(0, 8).toUpperCase()}</span>
              </div>
              <Rocket className="w-4 h-4 text-white/20" />
            </div>
          </div>
        </div>

        {/* Decorative side accent */}
        <div className="absolute top-0 right-0 h-full w-1.5 bg-indigo-500/30 blur-[2px]" />
      </motion.div>

      <div className="text-center space-y-4 max-w-sm">
        <p className="text-slate-400 italic">
          "Lu harus setia sama mimpi ini. Kartu ini bukan cuma pajangan, tapi pengingat bahwa lu sedang menuju kampus impian."
        </p>
        <div className="space-y-3 pt-2">
          <button
            onClick={onNavigate}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-black py-4 rounded-2xl hover:bg-indigo-500 transition-all shadow-xl active:scale-95 disabled:opacity-50"
          >
            {loading ? "Menyiapkan Perjalanan..." : "Oke, Gw Siap 🚀"}
          </button>
          
          <button
            onClick={onEdit}
            disabled={loading}
            className="w-full bg-slate-900 border border-slate-800 text-slate-400 font-bold py-4 rounded-2xl hover:bg-slate-800 hover:text-white transition-all shadow-xl active:scale-95 disabled:opacity-50"
          >
            Edit Lagi
          </button>
        </div>
      </div>
    </motion.div>
  );
};
