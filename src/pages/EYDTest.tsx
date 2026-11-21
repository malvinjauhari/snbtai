import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SpellCheck, CheckCircle2, XCircle, Info, RefreshCcw } from 'lucide-react';
import eydData from '../data/eyd.json';

interface EYDQuestion {
  pertanyaan: string;
  jawaban_1: string;
  jawaban_2: string;
  is_jawaban_1_benar: boolean;
  is_jawaban_2_benar: boolean;
}

export default function EYDTest() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    startNewTest();
  }, []);

  const startNewTest = () => {
    // Shuffle all questions and pick 15
    const shuffled = [...eydData].sort(() => 0.5 - Math.random());
    const selectedBatch = shuffled.slice(0, 15).map(q => ({
      text: q.pertanyaan,
      options: [q.jawaban_1, q.jawaban_2],
      correct: q.is_jawaban_1_benar ? q.jawaban_1 : q.jawaban_2,
      reason: q.is_jawaban_1_benar 
        ? `"${q.jawaban_1}" adalah bentuk baku, sementara "${q.jawaban_2}" tidak baku.` 
        : `"${q.jawaban_2}" adalah bentuk baku, sementara "${q.jawaban_1}" tidak baku.`
    }));
    setQuestions(selectedBatch);
    setCurrentIndex(0);
    setSelected(null);
    setScore(0);
    setIsFinished(false);
  };

  const handleSelect = (opt: string) => {
    if (selected) return;
    setSelected(opt);
    if (opt === questions[currentIndex].correct) setScore(score + 1);
  };

  const next = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelected(null);
    } else {
      setIsFinished(true);
    }
  };

  if (questions.length === 0) return null;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 space-y-12 min-h-[calc(100vh-100px)] flex flex-col justify-center">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 text-indigo-400">
           <SpellCheck className="w-8 h-8" />
           <h1 className="text-5xl font-black tracking-tight text-white">EYD Test.</h1>
        </div>
        <p className="text-slate-400 font-medium">Asah ketajaman tata bahasa lu buat subtes PBM & Literasi Indonesia.</p>
      </div>

      <AnimatePresence mode="wait">
        {!isFinished ? (
          <motion.div
            key="test"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-10 bg-slate-900 border border-slate-800 rounded-[2.5rem] space-y-8 shadow-2xl"
          >
            <div className="space-y-6">
              <span className="px-3 py-1 bg-slate-800 text-[10px] font-black text-slate-500 rounded-full uppercase tracking-widest border border-slate-700">Question {currentIndex + 1} of {questions.length}</span>
              <h2 className="text-2xl font-bold">{questions[currentIndex].text}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {questions[currentIndex].options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleSelect(opt)}
                  className={`p-8 rounded-2xl border text-center font-black text-xl transition-all flex flex-col items-center justify-center gap-4 ${
                    selected === opt 
                      ? opt === questions[currentIndex].correct ? "bg-emerald-500/10 border-emerald-500 text-emerald-400" : "bg-rose-500/10 border-rose-500 text-rose-400"
                      : "bg-slate-800/50 border-slate-700 hover:border-slate-600 dark:hover:bg-slate-800"
                  }`}
                >
                  <span>{opt}</span>
                  {selected === opt && (opt === questions[currentIndex].correct ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />)}
                </button>
              ))}
            </div>

            {selected && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="p-6 bg-slate-800/50 rounded-2xl border border-white/5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center shrink-0">
                    <Info className="w-5 h-5 text-indigo-400" />
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed italic">{questions[currentIndex].reason}</p>
                </div>
                <button onClick={next} className="w-full py-5 bg-white text-slate-950 font-black rounded-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                  Lanjut ke Soal Berikutnya
                </button>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-12 bg-slate-900 border border-slate-800 rounded-[3rem] text-center space-y-10"
          >
            <div className="space-y-4">
              <span className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] leading-loose">Hasil Simulasi EYD Lu</span>
              <div className="flex items-center justify-center gap-4">
                 <div className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-500 tabular-nums leading-none">
                   {Math.round((score / questions.length) * 100)}
                 </div>
              </div>
            </div>
            
            <div className="space-y-2">
               <p className="text-xl font-bold text-white">Bagus pejuang! Skor lu {score}/{questions.length}</p>
               <p className="text-slate-400 font-medium">Terus asah ketajaman tata bahasa lu biar nggak kejebak pilihan kata yang menjebak pas UTBK nanti.</p>
            </div>

            <button 
              onClick={startNewTest}
              className="px-12 py-6 bg-indigo-600 text-white font-black rounded-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 mx-auto shadow-xl shadow-indigo-600/20"
            >
              Ulangi Tes Baru <RefreshCcw className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
