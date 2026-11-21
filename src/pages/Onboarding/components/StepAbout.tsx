import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { OnboardingFormData } from '../types';

interface StepAboutProps {
  formData: OnboardingFormData;
  loading: boolean;
  updateFormData: (data: Partial<OnboardingFormData>) => void;
  onFinalize: () => void;
}

export const StepAbout: React.FC<StepAboutProps> = ({
  formData,
  loading,
  updateFormData,
  onFinalize
}) => {
  return (
    <motion.div
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
              onClick={() => updateFormData({ ambisType: type })}
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
            onChange={(e) => updateFormData({ collegePurpose: e.target.value })}
            className="w-full px-6 py-4 bg-slate-900 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-lg font-medium"
          />
        </div>

        <button
          disabled={!formData.collegePurpose || loading}
          onClick={onFinalize}
          className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl hover:bg-indigo-500 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? "Menyiapkan Preview..." : <>Buat Kartu Impian <Sparkles className="w-5 h-5" /></>}
        </button>
      </div>
    </motion.div>
  );
};
