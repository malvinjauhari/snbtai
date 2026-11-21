import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { db, auth } from '@/src/services/firebase';
import { doc, collection, setDoc, serverTimestamp } from 'firebase/firestore';
import { useNotification } from '@/src/context/NotificationContext';
import { useProgress } from '@/src/context/ProgressContext';
import { QuestionPageAPI } from './api';
import { Question } from './types';
import { QuestionHeader } from './components/QuestionHeader';
import { QuestionDisplay } from './components/QuestionDisplay';
import { AnswerOptions } from './components/AnswerOptions';
import { ExplanationSection } from './components/ExplanationSection';
import { QuestionSidebar } from './components/QuestionSidebar';
import { VocabModal } from './components/VocabModal';
import { FinishConfirmModal } from './components/FinishConfirmModal';
import { ExitConfirmModal } from './components/ExitConfirmModal';

export default function QuestionPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { refreshStats } = useProgress();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [sessionMode, setSessionMode] = useState<'latihan' | 'simulasi'>('latihan');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Finish Confirm State
  const [showFinishConfirm, setShowFinishConfirm] = useState(false);
  
  // Exit Confirm State
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  
  // Vocab State
  const [vocabModalOpen, setVocabModalOpen] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [meaning, setMeaning] = useState('');

  // Protect against accidental exit
  useEffect(() => {
    // 1. Block page reload/tab close
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isFinished) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // 2. Trapping browser back button is complex with React Router unless using data routers.
    // The main in-app back button in QuestionHeader is safely trapped already.

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isFinished]);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const data = await QuestionPageAPI.fetchSession(slug);
        
        if (data) {
          const qList = data.questions || [];
          const localWishlist = JSON.parse(localStorage.getItem('pejuang_wishlist') || '[]');
          const wishlistedIds = new Set(localWishlist.map((q: any) => q.id));
          
          const updatedQList = qList.map((q: any) => ({
            ...q,
            isWishlisted: wishlistedIds.has(q.id)
          }));
          setQuestions(updatedQList);
          
          const mode = data.mode || 'latihan';
          setSessionMode(mode);
          
          if (!data.isFinished && mode === 'simulasi') {
             // 5 Questions = 5 Minutes
             setTimeLeft(qList.length * 60);
          } else {
             setTimeLeft(null); // No timer in default mode
          }

          if (data.isFinished) {
            setIsFinished(true);
            setUserAnswers(data.userAnswers || {});
          }
        } else {
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

  useEffect(() => {
    if (sessionMode === 'simulasi' && timeLeft !== null && timeLeft > 0 && !isFinished && !loading) {
      const timer = setInterval(() => setTimeLeft(prev => prev! - 1), 1000);
      return () => clearInterval(timer);
    } else if (sessionMode === 'simulasi' && timeLeft === 0 && !isFinished) {
      handleFinish(); // Auto submit
    }
  }, [timeLeft, isFinished, loading, sessionMode]);

  const formatTime = (seconds: number | null) => {
    if (seconds === null) return "--:--";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (optionOrValue: string) => {
    if (isFinished) return;
    setUserAnswers(prev => ({ ...prev, [questions[currentIndex].id]: optionOrValue }));
  };

  const handleWishlist = (question: Question) => {
    try {
      const localWishlist = JSON.parse(localStorage.getItem('pejuang_wishlist') || '[]');
      if (question.isWishlisted) {
        const updatedWishlist = localWishlist.filter((q: any) => q.id !== question.id);
        localStorage.setItem('pejuang_wishlist', JSON.stringify(updatedWishlist));
        setQuestions(prev => prev.map(q => q.id === question.id ? { ...q, isWishlisted: false } : q));
        showNotification("Dihapus dari Wishlist lokal.", "info");
      } else {
        const updatedWishlist = [...localWishlist, { ...question, isWishlisted: true, savedAt: new Date().toISOString() }];
        localStorage.setItem('pejuang_wishlist', JSON.stringify(updatedWishlist));
        setQuestions(prev => prev.map(q => q.id === question.id ? { ...q, isWishlisted: true } : q));
        showNotification("Berhasil simpan ke Wishlist lokal! ⭐", "success");
      }
    } catch (error) {
      showNotification("Gagal update wishlist lokal.", "error");
    }
  };

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
    if (!user || !meaning.trim()) return;
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

  const handleFinishConfirm = () => {
    setShowFinishConfirm(true);
  };

  const handleFinish = async () => {
    setShowFinishConfirm(false);
    if (!slug) return;
    try {
      let totalWeight = 0, earnedWeight = 0;
      questions.forEach(q => {
        const weight = 1 + (q.level - 1) * 0.5;
        totalWeight += weight;
        
        const ans = userAnswers[q.id];
        let isCorrect = false;
        
        if (q.answerType === 'short_answer') {
           // Normalize short answer: remove spaces, dots
           const cleanAns = ans?.toString().replace(/[\s.]/g, '').trim() || "";
           const cleanTruth = q.correctAnswer?.toString().replace(/[\s.]/g, '').trim() || "";
           isCorrect = cleanAns === cleanTruth && cleanTruth !== "";
        } else {
           isCorrect = (ans === q.correctOption);
        }

        if (isCorrect) earnedWeight += weight;
      });
      const score = Math.round((earnedWeight / totalWeight) * 1000);
      await QuestionPageAPI.saveResults(slug, userAnswers, score);
      setIsFinished(true);
      showNotification("Sesi Selesai! Skor lu: " + score, "success");
      await refreshStats();
    } catch (error) {
      showNotification("Gagal nyimpen hasil.", "error");
    }
  };

  const unansweredCount = useMemo(() => {
    return questions.filter(q => !userAnswers[q.id]).length;
  }, [questions, userAnswers]);

  const flaggedCount = useMemo(() => {
    return Object.values(flagged).filter(Boolean).length;
  }, [flagged]);

  if (loading) return (
    <div className="flex items-center justify-center h-[calc(100vh-100px)]">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-400 font-bold animate-pulse">Menyiapkan Level Neraka...</p>
      </div>
    </div>
  );

  const currentQuestion = questions[currentIndex];

  if (!currentQuestion) return (
    <div className="flex items-center justify-center h-[calc(100vh-100px)] text-center p-8">
       <div className="space-y-4">
          <h2 className="text-4xl font-black text-rose-500">404: Soal Gaib</h2>
          <p className="text-slate-400">Slug ini kayaknya ga ada di database. Coba generate ulang di chat.</p>
          <button onClick={() => navigate('/chat')} className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl">Ke Chat Sini</button>
       </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto md:px-4 flex flex-col min-h-full h-[calc(100svh-180px)] md:h-[calc(100vh-140px)]">
      <QuestionHeader 
        subtest={currentQuestion.subtest}
        timeLeft={timeLeft}
        isFinished={isFinished}
        formatTime={formatTime}
        onBack={() => {
          if (isFinished) {
            navigate(-1);
          } else {
            setShowExitConfirm(true);
          }
        }}
        onFinish={handleFinishConfirm}
        onClose={() => navigate('/dashboard')}
      />

      <FinishConfirmModal 
        isOpen={showFinishConfirm}
        unansweredCount={unansweredCount}
        flaggedCount={flaggedCount}
        onConfirm={handleFinish}
        onCancel={() => setShowFinishConfirm(false)}
      />

      <ExitConfirmModal
        isOpen={showExitConfirm}
        onConfirm={() => {
          setShowExitConfirm(false);
          navigate(-1);
        }}
        onCancel={() => setShowExitConfirm(false)}
      />

      <div className="flex-1 flex flex-col lg:flex-row gap-3 md:gap-6 mt-3 md:mt-6 overflow-hidden text-slate-100">
        <div className="flex-1 overflow-y-auto space-y-6 pr-2 md:pr-4 custom-scrollbar order-last lg:order-first">
          <QuestionDisplay 
            question={currentQuestion}
            currentIndex={currentIndex}
            isFlagged={!!flagged[currentQuestion.id]}
            onToggleFlag={() => setFlagged({ ...flagged, [currentQuestion.id]: !flagged[currentQuestion.id] })}
            onWishlist={() => handleWishlist(currentQuestion)}
            onSelection={handleSelection}
          />

          <AnswerOptions 
            options={currentQuestion.options}
            userAnswer={userAnswers[currentQuestion.id]}
            correctOption={currentQuestion.correctOption}
            correctAnswer={currentQuestion.correctAnswer}
            answerType={currentQuestion.answerType}
            isFinished={isFinished}
            onAnswer={handleAnswer}
          />

          <AnimatePresence>
            {isFinished && (
              <ExplanationSection 
                isCorrect={
                  currentQuestion.answerType === 'short_answer'
                    ? userAnswers[currentQuestion.id]?.replace(/[\s.]/g, '').trim() === currentQuestion.correctAnswer?.replace(/[\s.]/g, '').trim() && !!currentQuestion.correctAnswer
                    : userAnswers[currentQuestion.id] === currentQuestion.correctOption
                }
                correctOption={currentQuestion.correctOption || currentQuestion.correctAnswer || ""}
                explanation={currentQuestion.explanation}
                showExplanation={showExplanation}
                onToggleExplanation={() => setShowExplanation(!showExplanation)}
              />
            )}
          </AnimatePresence>
        </div>

        <QuestionSidebar 
          questions={questions}
          currentIndex={currentIndex}
          userAnswers={userAnswers}
          isFinished={isFinished}
          flagged={flagged}
          onNavigate={setCurrentIndex}
        />
      </div>

      <VocabModal 
        isOpen={vocabModalOpen}
        selectedText={selectedText}
        meaning={meaning}
        onMeaningChange={setMeaning}
        onClose={() => setVocabModalOpen(false)}
        onSave={saveVocab}
      />
    </div>
  );
}
