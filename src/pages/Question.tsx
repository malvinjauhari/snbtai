import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Timer, 
  Flag, 
  Bookmark, 
  XCircle, 
  CheckCircle2,
  ListFilter,
  Eye,
  Info,
  Star,
  Search,
  BookOpen,
  History as HistoryIcon
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { db, auth } from '@/src/services/firebase';
import { doc, getDoc, updateDoc, arrayUnion, setDoc, serverTimestamp, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { useNotification } from '@/src/context/NotificationContext';
import { useProgress } from '@/src/context/ProgressContext';

interface Question {
  id: string;
  text: string;
  options: Record<string, string>;
  correctOption: string;
  explanation: string;
  subtest: string;
  level: number;
  isWishlisted?: boolean;
}

export default function QuestionPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { refreshStats } = useProgress();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(1200); // 20 minutes
  const [isFinished, setIsFinished] = useState(false);
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Vocab State
  const [vocabModalOpen, setVocabModalOpen] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [meaning, setMeaning] = useState('');

  // Fetch Logic
  useEffect(() => {
    const fetchQuestions = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        const sessionRef = doc(db, 'subtest_sessions', slug);
        const sessionSnap = await getDoc(sessionRef);
        
        if (sessionSnap.exists()) {
          const data = sessionSnap.data();
          const qList = data.questions || [];
          
          // Check if questions are wishlisted (LOCAL ONLY as per user request)
          const localWishlist = JSON.parse(localStorage.getItem('pejuang_wishlist') || '[]');
          const wishlistedIds = new Set(localWishlist.map((q: any) => q.id));
          
          const updatedQList = qList.map((q: any) => ({
            ...q,
            isWishlisted: wishlistedIds.has(q.id)
          }));
          setQuestions(updatedQList);
          
          if (data.isFinished) {
            setIsFinished(true);
            setUserAnswers(data.userAnswers || {});
          }
        } else {
          // Fallback check
          showNotification("Sesi tidak ditemukan!", "error");
          navigate('/dashboard/bank-soal');
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
        showNotification("Gagal memuat soal.", "error");
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuestions();
  }, [slug, navigate, showNotification]);

  // Timer Logic
  useEffect(() => {
    if (timeLeft > 0 && !isFinished && !loading) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !isFinished) {
      handleFinish();
    }
  }, [timeLeft, isFinished, loading]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (option: string) => {
    if (isFinished) return;
    setUserAnswers(prev => ({ ...prev, [questions[currentIndex].id]: option }));
    
    // Haptic feedback simulation (visual)
    const btn = document.getElementById(`opt-${option}`);
    if (btn) {
      btn.style.transform = 'scale(0.98)';
      setTimeout(() => btn.style.transform = '', 100);
    }
  };

  const handleNavigation = (index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentIndex(index);
    }
  };

  const handleWishlist = (question: Question) => {
    try {
      const localWishlist = JSON.parse(localStorage.getItem('pejuang_wishlist') || '[]');
      
      if (question.isWishlisted) {
        const updatedWishlist = localWishlist.filter((q: any) => q.id !== question.id);
        localStorage.setItem('pejuang_wishlist', JSON.stringify(updatedWishlist));
        setQuestions(prev => prev.map(q => 
          q.id === question.id ? { ...q, isWishlisted: false } : q
        ));
        showNotification("Dihapus dari Wishlist lokal.", "info");
      } else {
        const updatedWishlist = [...localWishlist, { ...question, isWishlisted: true, savedAt: new Date().toISOString() }];
        localStorage.setItem('pejuang_wishlist', JSON.stringify(updatedWishlist));
        setQuestions(prev => prev.map(q => 
          q.id === question.id ? { ...q, isWishlisted: true } : q
        ));
        showNotification("Berhasil simpan ke Wishlist lokal! ⭐", "success");
      }
    } catch (error) {
      console.error(error);
      showNotification("Gagal update wishlist lokal.", "error");
    }
  };

  // Text Selection Logic
  const handleSelection = useCallback(() => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();
    if (text && text.length > 1 && text.length < 100) {
      setSelectedText(text);
      setVocabModalOpen(true);
    }
  }, []);

  const saveVocab = async () => {
    const user = auth.currentUser;
    if (!user) return;
    if (!meaning.trim()) {
      showNotification("Isi dulu artinya dong!", "warning");
      return;
    }

    try {
      const vocabRef = doc(collection(db, `users/${user.uid}/vocabs`));
      await setDoc(vocabRef, {
        word: selectedText,
        meaning: meaning,
        subtest: questions[currentIndex].subtest,
        createdAt: serverTimestamp()
      });
      showNotification(`Saved "${selectedText}" to Vocab! 📚`, "success");
      setVocabModalOpen(false);
      setMeaning('');
      window.getSelection()?.removeAllRanges();
    } catch (error) {
      showNotification("Failed to save vocab.", "error");
    }
  };

  const handleFinish = async () => {
    if (!slug) return;
    
    try {
      const user = auth.currentUser;
      const sessionRef = doc(db, 'subtest_sessions', slug);
      
      // Calculate IRT-like weighted score
      let totalWeight = 0;
      let earnedWeight = 0;
      
      questions.forEach(q => {
        // Difficulty level 1-5 maps to weights 1-3
        const weight = 1 + (q.level - 1) * 0.5;
        totalWeight += weight;
        if (userAnswers[q.id] === q.correctOption) {
          earnedWeight += weight;
        }
      });
      
      const score = Math.round((earnedWeight / totalWeight) * 1000);

      await setDoc(sessionRef, {
        isFinished: true,
        userAnswers,
        score,
        finishedAt: serverTimestamp()
      }, { merge: true });

      setIsFinished(true);
      showNotification("Simulasi Selesai! Skor lu: " + score, "success");
      await refreshStats();
    } catch (error) {
      console.error(error);
      showNotification("Gagal nyimpen hasil.", "error");
    }
  };

  const currentQuestion = questions[currentIndex];

  if (loading) return (
    <div className="flex items-center justify-center h-[calc(100vh-100px)]">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-400 font-bold animate-pulse">Menyiapkan Level Neraka...</p>
      </div>
    </div>
  );

  if (!currentQuestion) return (
    <div className="flex items-center justify-center h-[calc(100vh-100px)] text-center p-8">
       <div className="space-y-4">
          <h2 className="text-4xl font-black text-rose-500">404: Soal Gaib</h2>
          <p className="text-slate-400">Slug ini kayaknya ga ada di database. Coba generate ulang di chat.</p>
          <button onClick={() => navigate('/chat')} className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl">Ke Chat Sini</button>
       </div>
    </div>
  );

  const renderMath = (text: string) => {
    if (!text) return null;
    
    // Split by newlines (double for paragraphs, single for line breaks)
    const paragraphs = text.split('\n\n').filter(p => p.trim() !== '');
    
    return paragraphs.map((para, pIndex) => (
      <div 
        key={`p-${pIndex}`} 
        className="mb-6 last:mb-0 leading-[1.7] whitespace-pre-wrap"
      >
        {para.split('$$').map((displayPart, i) => {
          if (i % 2 === 1) {
            return (
              <div key={`display-${i}`} className="my-4 overflow-x-auto">
                <BlockMath math={displayPart.trim()} />
              </div>
            );
          }
          
          const inlineParts = displayPart.split('$');
          return inlineParts.map((inlinePart, j) => {
            if (j % 2 === 1) {
              return <InlineMath key={`inline-${i}-${j}`} math={inlinePart.trim()} />;
            }
            return <span key={`text-${i}-${j}`}>{inlinePart}</span>;
          });
        })}
      </div>
    ));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 flex flex-col h-[calc(100vh-100px)] overflow-hidden">
      {/* Header Nav */}
      <header className="flex flex-wrap items-center justify-between py-4 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm dark:shadow-none">
            <ChevronLeft className="w-5 h-5 dark:text-white" />
          </button>
          <div>
            <h2 className="font-black text-lg text-slate-900 dark:text-white">SNBT AI 2026</h2>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold rounded-md border border-indigo-500/20 uppercase letter-spacing-1">
                {currentQuestion.subtest}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-2xl border font-mono font-bold transition-colors",
            timeLeft < 300 && !isFinished 
              ? "bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500 text-rose-500 dark:text-rose-400" 
              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 shadow-sm dark:shadow-none"
          )}>
            <Timer className="w-4 h-4" />
            {isFinished ? "FINISHED" : formatTime(timeLeft)}
          </div>
          {!isFinished && (
            <button 
              onClick={handleFinish}
              className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20"
            >
              Selesai
            </button>
          )}
          {isFinished && (
            <button 
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2 bg-slate-800 text-white font-bold rounded-2xl hover:bg-slate-700 transition-all"
            >
              Tutup
            </button>
          )}
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 mt-6 overflow-hidden">
        {/* Question Area */}
        <div 
          className="flex-1 overflow-y-auto space-y-8 pr-4 custom-scrollbar"
          onMouseUp={handleSelection}
        >
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
               <div className="text-4xl font-black text-slate-300 dark:text-slate-800 select-none">Q.{currentIndex + 1}</div>
               <div className="flex gap-2">
                 <button 
                   onClick={() => setFlagged({ ...flagged, [currentQuestion.id]: !flagged[currentQuestion.id] })}
                   className={cn(
                     "p-3 rounded-xl border transition-all shadow-sm dark:shadow-none",
                     flagged[currentQuestion.id] 
                       ? "bg-amber-500 text-white border-amber-500" 
                       : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-white"
                   )}
                 >
                   <Flag className="w-5 h-5" />
                 </button>
                <button 
                  onClick={() => handleWishlist(currentQuestion)}
                  className={cn(
                    "p-3 rounded-xl border transition-all shadow-sm dark:shadow-none",
                    currentQuestion.isWishlisted 
                      ? "bg-indigo-500 text-white border-indigo-500" 
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-white"
                  )}
                >
                   <Star className="w-5 h-5" />
                 </button>
               </div>
            </div>

            <div className="text-xl md:text-2xl font-bold leading-[1.7] text-slate-800 dark:text-slate-100 selection:bg-indigo-500 selection:text-white">
              {renderMath(currentQuestion.text)}
              <p className="text-[10px] text-slate-400 dark:text-slate-600 mt-4 font-black uppercase tracking-widest italic opacity-50">Highligt single word to save vocab</p>
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 gap-3">
            {Object.entries(currentQuestion.options).map(([key, value]) => (
              <button
                id={`opt-${key}`}
                key={key}
                onClick={() => handleAnswer(key)}
                className={cn(
                  "flex items-center gap-4 p-5 rounded-[1.5rem] border text-left transition-all group shadow-sm dark:shadow-none",
                  userAnswers[currentQuestion.id] === key 
                    ? isFinished 
                      ? key === currentQuestion.correctOption 
                        ? "bg-emerald-500 border-emerald-400 text-white" 
                        : "bg-rose-500 border-rose-400 text-white"
                      : "bg-indigo-600 border-indigo-400 text-white shadow-xl shadow-indigo-600/20 scale-[1.02]" 
                    : isFinished && key === currentQuestion.correctOption
                      ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500 text-emerald-600 dark:text-emerald-400"
                      : "bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-slate-700 text-slate-600 dark:text-slate-300"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg transition-all",
                  userAnswers[currentQuestion.id] === key ? "bg-white text-indigo-600" : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700"
                )}>
                  {key}
                </div>
                <span className="text-lg font-medium">{renderMath(value)}</span>
              </button>
            ))}
          </div>

          <AnimatePresence>
            {isFinished && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-6 shadow-sm dark:shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {userAnswers[currentQuestion.id] === currentQuestion.correctOption ? (
                      <CheckCircle2 className="w-8 h-8 text-emerald-500 dark:text-emerald-400" />
                    ) : (
                      <XCircle className="w-8 h-8 text-rose-500 dark:text-rose-400" />
                    )}
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                      Opsi {currentQuestion.correctOption} benar.
                    </h3>
                  </div>
                  <button 
                    onClick={() => setShowExplanation(!showExplanation)}
                    className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                  >
                    <Info className="w-5 h-5" />
                    {showExplanation ? "Hide Explanation" : "See Explanation"}
                  </button>
                </div>
                
                {showExplanation && (
                  <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-white/5 italic">
                    {renderMath(currentQuestion.explanation)}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Nav */}
        <div className="w-full lg:w-80 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-col shrink-0 shadow-sm dark:shadow-none">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black tracking-widest text-xs text-slate-400 dark:text-slate-500 uppercase">Question Nav</h3>
            <ListFilter className="w-4 h-4 text-slate-300 dark:text-slate-600" />
          </div>

          <div className="grid grid-cols-5 md:grid-cols-8 lg:grid-cols-4 gap-2 flex-1 content-start overflow-y-auto custom-scrollbar pr-2">
            {questions.map((q, i) => (
              <button
                key={q.id}
                onClick={() => handleNavigation(i)}
                className={cn(
                  "aspect-square rounded-xl flex items-center justify-center text-sm font-black transition-all relative overflow-hidden",
                  currentIndex === i 
                    ? "bg-indigo-600 text-white scale-110 shadow-xl ring-2 ring-indigo-500/20" 
                    : userAnswers[q.id] 
                      ? isFinished
                        ? userAnswers[q.id] === q.correctOption 
                          ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                          : "bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30"
                        : "bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30" 
                      : "bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-transparent"
                )}
              >
                {i + 1}
                {flagged[q.id] && <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-amber-500 rounded-full" />}
              </button>
            ))}
          </div>

          <div className="mt-8 space-y-4 pt-8 border-t border-slate-100 dark:border-slate-800/50">
             <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                <span>Terjawab: {Object.keys(userAnswers).length}/{questions.length}</span>
                <span>Level {currentQuestion.level}</span>
             </div>
             <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full transition-all duration-500",
                    isFinished ? "bg-emerald-500" : "bg-indigo-500"
                  )} 
                  style={{ width: `${(Object.keys(userAnswers).length / questions.length) * 100}%` }} 
                />
             </div>
             
             <div className="flex gap-2">
                <button 
                  onClick={() => handleNavigation(currentIndex - 1)}
                  disabled={currentIndex === 0}
                  className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-white rounded-2xl font-bold flex items-center justify-center disabled:opacity-30 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleNavigation(currentIndex + 1)}
                  disabled={currentIndex === questions.length - 1}
                  className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-white rounded-2xl font-bold flex items-center justify-center disabled:opacity-30 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
             </div>
          </div>
        </div>
      </div>

      {/* Vocab Modal */}
      <AnimatePresence>
        {vocabModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm">
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 space-y-6 shadow-2xl"
             >
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">Save Vocab?</h3>
                  <button onClick={() => setVocabModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
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
                    onChange={(e) => setMeaning(e.target.value)}
                    placeholder="Ketik artinya di sini..."
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-100 focus:ring-2 focus:ring-indigo-500 transition-all outline-none min-h-[100px]"
                  />
                </div>

                <div className="flex gap-3">
                   <button 
                     onClick={() => setVocabModalOpen(false)}
                     className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                   >
                     Batal
                   </button>
                   <button 
                     onClick={saveVocab}
                     className="flex-1 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all"
                   >
                     Simpen Kuy!
                   </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
