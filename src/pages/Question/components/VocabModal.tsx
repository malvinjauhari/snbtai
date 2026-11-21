import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft } from 'lucide-react';

interface VocabModalProps {
  isOpen: boolean;
  selectedText: string;
  meaning: string;
  onMeaningChange: (val: string) => void;
  onClose: () => void;
  onSave: () => void;
}

export const VocabModal: React.FC<VocabModalProps> = ({
  isOpen,
  selectedText,
  meaning,
  onMeaningChange,
  onClose,
  onSave
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm">
           <motion.div 
             initial={{ opacity: 0, scale: 0.9, y: 20 }}
             animate={{ opacity: 1, scale: 1, y: 0 }}
             exit={{ opacity: 0, scale: 0.9, y: 20 }}
             className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 space-y-6 shadow-2xl"
           >
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Save Vocab?</h3>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                  <ChevronLeft className="w-6 h-6 rotate-90 dark:text-white" />
                </button>
              </div>
              <div className="p-6 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-2xl">
                <p className="text-indigo-600 dark:text-indigo-400 font-black text-2xl tracking-tight">"{selectedText}"</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">Apa artinya buat lu?</label>
                <textarea 
                  value={meaning}
                  onChange={(e) => onMeaningChange(e.target.value)}
                  placeholder="Ketik artinya di sini..."
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-100 focus:ring-2 focus:ring-indigo-500 transition-all outline-none min-h-[100px]"
                />
              </div>

              <div className="flex gap-3">
                 <button 
                   onClick={onClose}
                   className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                 >
                   Batal
                 </button>
                 <button 
                   onClick={onSave}
                   className="flex-1 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all"
                 >
                   Simpen Kuy!
                 </button>
              </div>
           </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
