import React from 'react';
import { motion } from 'motion/react';
import { MapPin, GraduationCap, Quote } from 'lucide-react';
import { OnboardingFormData } from '../types';

interface StepDreamProps {
  formData: OnboardingFormData;
  updateFormData: (data: Partial<OnboardingFormData>) => void;
  onNext: () => void;
}

export const StepDream: React.FC<StepDreamProps> = ({
  formData,
  updateFormData,
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
            onChange={(e) => updateFormData({ dreamUniversity: e.target.value })}
            className="w-full pl-12 pr-6 py-4 bg-slate-900 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-lg font-bold"
          />
        </div>
        <div className="relative">
          <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Jurusan Impian (Contoh: Kedokteran, STEI)"
            value={formData.dreamMajor}
            onChange={(e) => updateFormData({ dreamMajor: e.target.value })}
            className="w-full pl-12 pr-6 py-4 bg-slate-900 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-lg font-bold"
          />
        </div>

        <div className="relative">
          <Quote className="absolute left-4 top-4 text-slate-500 w-5 h-5" />
          <textarea
            placeholder="Kenapa lu harus lulus di jurusan itu? (Tulis 1 kalimat singkat)"
            value={formData.reason}
            onChange={(e) => updateFormData({ reason: e.target.value })}
            className="w-full pl-12 pr-6 py-4 bg-slate-900 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none h-32 resize-none text-lg font-medium"
          />
        </div>

        <button
          disabled={!formData.dreamUniversity || !formData.dreamMajor || !formData.reason}
          onClick={onNext}
          className="w-full bg-white text-slate-950 font-black py-4 rounded-2xl hover:bg-slate-100 transition-all shadow-xl disabled:opacity-50"
        >
          Satu Langkah Lagi
        </button>
      </div>
    </motion.div>
  );
};
