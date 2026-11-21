import React from 'react';
import { motion } from 'motion/react';
import { Camera } from 'lucide-react';
import { OnboardingFormData } from '../types';

interface StepIdentityProps {
  formData: OnboardingFormData;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNameChange: (name: string) => void;
  onNext: () => void;
}

export const StepIdentity: React.FC<StepIdentityProps> = ({
  formData,
  fileInputRef,
  onPhotoUpload,
  onNameChange,
  onNext
}) => {
  return (
    <motion.div
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
            <input type="file" ref={fileInputRef} onChange={onPhotoUpload} className="hidden" accept="image/*" />
          </button>
        </div>

        <input
          type="text"
          placeholder="Nama Lengkap Pejuang"
          value={formData.displayName}
          onChange={(e) => onNameChange(e.target.value)}
          className="w-full px-6 py-4 bg-slate-900 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-center text-xl font-bold placeholder:text-slate-700 transition-all"
        />

        <button
          disabled={!formData.displayName || !formData.photoBase64}
          onClick={onNext}
          className="w-full bg-white text-slate-950 font-black py-4 rounded-2xl hover:bg-slate-100 transition-all shadow-xl disabled:opacity-50"
        >
          Lanjutkan Perjalanan
        </button>
      </div>
    </motion.div>
  );
};
