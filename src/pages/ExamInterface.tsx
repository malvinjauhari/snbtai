import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Bookmark, AlertCircle, Clock, BookMarked, Settings, Menu } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { cn } from '@/src/lib/utils';

export default function ExamInterface() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(1200); // 20 minutes
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [bookmarks, setBookmarks] = useState<number[]>([]);

  // Mock questions
  const questions = [
    {
      id: 1,
      subtest: 'Penalaran Matematika',
      text: 'Jika matriks $A = \\begin{pmatrix} 2 & 1 \\\\ 4 & 3 \\end{pmatrix}$, maka determinan dari $A$ adalah...',
      options: ['1', '2', '3', '4', '5'],
      isTextHeavy: false
    },
    {
      id: 2,
      subtest: 'Literasi Bahasa Indonesia',
      text: 'Berdasarkan teks tersebut, apa ide pokok paragraf ketiga?',
      textbook: 'Indonesia adalah negara kepulauan yang memiliki kekayaan alam yang melimpah. Salah satunya adalah sektor kelautan yang memberikan kontribusi besar bagi ekonomi nasional. Namun, tantangan polusi plastik di laut menjadi ancaman serius bagi ekosistem dan keberlanjutan sumber daya tersebut.',
      options: ['Kekayaan alam Indonesia', 'Sektor kelautan nasional', 'Tantangan polusi plastik', 'Ekonomi nasional', 'Keberlanjutan sumber daya'],
      isTextHeavy: true
    }
  ];

  const question = questions[currentQuestion % questions.length];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleBookmark = (id: number) => {
    setBookmarks(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-stretch">
      {/* Top Navigation */}
      <header className="h-16 border-b border-white/10 glass backdrop-blur-md flex items-center justify-between px-6 z-20 shrink-0">
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white">S</div>
               <span className="font-bold hidden sm:block">SNBT AI 2026</span>
            </div>
            <div className="h-6 w-px bg-white/10 hidden sm:block" />
            <div className="flex flex-col">
               <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Subtes</span>
               <span className="text-sm font-semibold text-blue-400">{question.subtest}</span>
            </div>
         </div>

         <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-white/10">
               <Clock className="w-4 h-4 text-blue-400" />
               <span className="font-mono font-bold text-sm">{formatTime(timeLeft)}</span>
            </div>
            <div className="flex items-center gap-2">
               <button onClick={() => toggleBookmark(currentQuestion)} className={cn("p-2 rounded-lg transition-colors", bookmarks.includes(currentQuestion) ? "text-blue-400 bg-blue-500/10" : "text-slate-400 hover:bg-white/5")}>
                 <Bookmark className="w-5 h-5" />
               </button>
               <button className="p-2 rounded-lg text-slate-400 hover:bg-white/5 transition-colors">
                 <AlertCircle className="w-5 h-5" />
               </button>
               <button className="p-2 rounded-lg text-slate-400 hover:bg-white/5 transition-colors">
                 <Settings className="w-5 h-5" />
               </button>
            </div>
         </div>
      </header>

      <main className="flex-1 overflow-hidden flex flex-col md:flex-row">
        {/* Main Content (Question & Textbook) */}
        <div className="flex-1 overflow-y-auto p-6 md:p-12">
           <div className="max-w-4xl mx-auto space-y-8">
              {question.isTextHeavy && (
                <div className="glass-card p-0 overflow-hidden">
                   <div className="bg-white/5 px-6 py-3 border-b border-white/10 flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Bacalah Teks Berikut</span>
                      <button className="text-[10px] text-blue-400 hover:underline flex items-center gap-1">
                        <BookMarked className="w-3 h-3" /> Add Vocab
                      </button>
                   </div>
                   <div className="p-6 text-slate-300 leading-relaxed italic">
                      {question.textbook}
                   </div>
                </div>
              )}

              <div className="space-y-6">
                 <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center font-bold text-lg">{currentQuestion + 1}</span>
                    <h2 className="text-xl font-medium leading-relaxed">
                      {question.text}
                    </h2>
                 </div>

                 <div className="grid grid-cols-1 gap-3">
                    {question.options.map((opt, idx) => {
                      const label = String.fromCharCode(65 + idx);
                      const isSelected = answers[currentQuestion] === label;
                      return (
                        <button
                          key={idx}
                          onClick={() => setAnswers(prev => ({ ...prev, [currentQuestion]: label }))}
                          className={cn(
                            "group flex items-center gap-4 p-5 rounded-2xl border transition-all duration-300 text-left",
                            isSelected 
                              ? "bg-blue-600/20 border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.1)]" 
                              : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/[0.07]"
                          )}
                        >
                          <span className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 border transition-colors",
                            isSelected ? "bg-blue-600 border-blue-400 text-white" : "bg-slate-800 border-white/10 text-slate-400"
                          )}>
                             {label}
                          </span>
                          <span className={cn("flex-1", isSelected ? "text-white" : "text-slate-300")}>{opt}</span>
                        </button>
                      );
                    })}
                 </div>
              </div>
           </div>
        </div>

        {/* Sidebar Navigation */}
        <aside className="w-full md:w-80 glass border-l border-white/10 p-8 flex flex-col justify-between shrink-0">
           <div>
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Navigasi Soal</h3>
                 <Menu className="w-4 h-4 text-slate-500" />
              </div>
              
              <div className="grid grid-cols-5 gap-3">
                 {Array.from({ length: 20 }).map((_, i) => {
                   const isAnswered = answers[i] !== undefined;
                   const isCurrent = currentQuestion === i;
                   const isBookmarked = bookmarks.includes(i);
                   return (
                     <button
                       key={i}
                       onClick={() => setCurrentQuestion(i)}
                       className={cn(
                         "h-10 rounded-xl font-bold text-xs relative overflow-hidden transition-all",
                         isCurrent ? "bg-blue-600 ring-4 ring-blue-500/20 text-white" : 
                         isAnswered ? "bg-slate-700 text-slate-300" : "bg-white/5 text-slate-500 hover:bg-white/10"
                       )}
                     >
                        {i + 1}
                        {isBookmarked && (
                          <div className="absolute top-0 right-0 w-2 h-2 bg-yellow-500 rounded-bl-sm" />
                        )}
                        {isAnswered && !isCurrent && (
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500/50" />
                        )}
                     </button>
                   );
                 })}
              </div>
           </div>

           <div className="space-y-4 pt-8 border-t border-white/5">
              <div className="flex gap-3">
                 <button 
                   disabled={currentQuestion === 0}
                   onClick={() => setCurrentQuestion(prev => prev - 1)}
                   className="flex-1 secondary-button !px-0 flex items-center justify-center"
                 >
                    <ChevronLeft className="w-5 h-5" />
                 </button>
                 <button className="flex-1 bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-yellow-500/20 transition-all">
                    Ragu-Ragu
                 </button>
                 <button 
                   disabled={currentQuestion === 19}
                   onClick={() => setCurrentQuestion(prev => prev + 1)}
                   className="flex-1 secondary-button !px-0 flex items-center justify-center"
                 >
                    <ChevronRight className="w-5 h-5" />
                 </button>
              </div>
              <button 
                onClick={() => navigate('/dashboard')}
                className="w-full premium-button !bg-emerald-600 hover:!bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              >
                Selesai Ujian
              </button>
           </div>
        </aside>
      </main>
    </div>
  );
}
