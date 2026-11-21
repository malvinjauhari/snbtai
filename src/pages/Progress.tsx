import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  CheckCircle2, 
  BookOpen, 
  Clock, 
  Target, 
  Sparkles,
  Brain,
  Book,
  Lightbulb,
  Calculator,
  PenTool,
  Globe,
  Languages,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { silabusData, subjectMetadata } from '@/src/constants/silabus';
import { db, auth } from '@/src/services/firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useProgress } from '@/src/context/ProgressContext';
import { useNotification } from '@/src/context/NotificationContext';

const IconMap = {
  Brain,
  Book,
  Lightbulb,
  Calculator,
  PenTool,
  Globe,
  Languages
};

export default function Progress() {
  const navigate = useNavigate();
  const { stats, refreshStats } = useProgress();
  const { showNotification } = useNotification();
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [expandedSubjects, setExpandedSubjects] = useState<Record<string, boolean>>({
    'penalaran_umum': true
  });

  // Fetch Progress
  useEffect(() => {
    const fetchProgress = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const progressRef = doc(db, `users/${user.uid}/progress/materi_snbt`);
        const snap = await getDoc(progressRef);
        
        if (snap.exists()) {
          setCompletedItems(snap.data().completedItems || {});
        }
      } catch (error) {
        console.error("Error fetching progress:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  const handleCheck = async (materiId: string) => {
    const user = auth.currentUser;
    if (!user) {
      showNotification("Login dulu pejuang!", "warning");
      return;
    }

    // Optimistic Update
    const newValue = !completedItems[materiId];
    const newItems = { ...completedItems, [materiId]: newValue };
    setCompletedItems(newItems);

    try {
      const progressRef = doc(db, `users/${user.uid}/progress/materi_snbt`);
      
      const totalItems = silabusData.length;
      const completedCount = Object.values(newItems).filter(Boolean).length;
      const percentage = Math.round((completedCount / totalItems) * 100);

      await setDoc(progressRef, {
        userId: user.uid,
        completedItems: newItems,
        percentage,
        updatedAt: serverTimestamp()
      }, { merge: true });
      
      refreshStats();
    } catch (error) {
      console.error("Error updating progress:", error);
      // Revert if failed
      setCompletedItems(completedItems);
      showNotification("Gagal update progress.", "error");
    }
  };

  const toggleSubject = (subject: string) => {
    setExpandedSubjects(prev => ({ ...prev, [subject]: !prev[subject] }));
  };

  const subjects = Object.entries(subjectMetadata);
  const totalCompleted = Object.values(completedItems).filter(Boolean).length;
  const overallPercentage = Math.round((totalCompleted / silabusData.length) * 100);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
             <BarChart3 className="w-8 h-8" />
             <h1 className="text-5xl font-black tracking-tight text-slate-900 dark:text-white">Silabus Tracker.</h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 font-medium text-lg max-w-2xl">
            Ceklis materi yang udah lu pahamin. Jangan cuma dibaca, tapi dikuasain ampe akar-akarnya.
          </p>
        </div>

        <div className="premium-card p-6 rounded-[2rem] flex items-center gap-6">
           <div className="relative w-20 h-20">
              <svg className="w-full h-full -rotate-90">
                <circle cx="40" cy="40" r="35" className="stroke-slate-100 dark:stroke-slate-800 fill-none" strokeWidth="8" />
                <circle 
                  cx="40" cy="40" r="35" 
                  className="stroke-indigo-500 fill-none" 
                  strokeWidth="8" 
                  strokeDasharray={`${2 * Math.PI * 35}`}
                  strokeDashoffset={`${2 * Math.PI * 35 * (1 - overallPercentage / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-black text-xl italic text-indigo-600 dark:text-indigo-400">
                {overallPercentage}%
              </div>
           </div>
           <div>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Total Progress</p>
              <p className="text-2xl font-black text-slate-900 dark:text-slate-100">{totalCompleted} <span className="text-slate-400 dark:text-slate-600">/ {silabusData.length}</span></p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {subjects.map(([slug, meta]) => {
            const Icon = IconMap[meta.icon as keyof typeof IconMap];
            const subjectMaterials = silabusData.filter(m => m.subject === slug);
            const subjectCompleted = subjectMaterials.filter(m => completedItems[m.id]).length;
            const subjectProgress = Math.round((subjectCompleted / subjectMaterials.length) * 100);
            const isExpanded = expandedSubjects[slug];

            return (
              <motion.div
                key={slug}
                layout
                className="glass-panel overflow-hidden hover:border-indigo-400 dark:hover:border-slate-500 rounded-[2.5rem] transition-all shadow-sm"
              >
                <div 
                  onClick={() => toggleSubject(slug)}
                  className="p-8 cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shadow-inner">
                       <Icon className="w-8 h-8" style={{ color: meta.color }} />
                    </div>
                    <div>
                       <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{meta.name}</h3>
                       <div className="flex items-center gap-3 mt-1">
                          <div className="w-32 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                             <div 
                               className="h-full transition-all duration-1000" 
                               style={{ width: `${subjectProgress}%`, backgroundColor: meta.color }} 
                             />
                          </div>
                          <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{subjectCompleted}/{subjectMaterials.length} MATERI</span>
                       </div>
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp className="text-slate-400 dark:text-slate-600" /> : <ChevronDown className="text-slate-400 dark:text-slate-600" />}
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-slate-100 dark:border-slate-800/50 bg-slate-50/30 dark:bg-slate-950/30"
                    >
                      <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-3">
                         {subjectMaterials.map((item) => (
                           <label 
                             key={item.id}
                             className={cn(
                               "flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer group",
                               completedItems[item.id] 
                                 ? "bg-indigo-50 dark:bg-slate-800/50 border-indigo-200 dark:border-indigo-500/30 text-indigo-900 dark:text-indigo-100 shadow-sm" 
                                 : "bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-indigo-100 dark:hover:border-slate-700"
                             )}
                           >
                              <div className="relative flex items-center justify-center">
                                <input 
                                  type="checkbox" 
                                  className="sr-only"
                                  checked={!!completedItems[item.id]}
                                  onChange={() => handleCheck(item.id)}
                                />
                                <div className={cn(
                                  "w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center",
                                  completedItems[item.id] 
                                    ? "bg-indigo-600 border-indigo-500" 
                                    : "border-slate-300 dark:border-slate-700 group-hover:border-indigo-300 dark:group-hover:border-slate-600"
                                )}>
                                   {completedItems[item.id] && <CheckCircle2 className="w-4 h-4 text-white fill-current" />}
                                </div>
                              </div>
                              <div className="flex-1">
                                 <p className="text-xs font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest leading-none mb-1">{item.topic}</p>
                                 <p className={cn(
                                   "font-bold transition-colors",
                                   completedItems[item.id] ? "text-indigo-950 dark:text-slate-100" : "text-slate-600 dark:text-slate-400"
                                 )}>{item.subtopic}</p>
                              </div>
                           </label>
                         ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <div className="space-y-6">
           <div className="p-8 premium-card rounded-[2.5rem] space-y-8 sticky top-24">
              <h4 className="text-xl font-black text-slate-900 dark:text-white">Quick Action</h4>
              <div className="space-y-6">
                 {[
                   { label: "Materi Selesai", val: `${totalCompleted}/${silabusData.length}`, icon: BookOpen },
                   { label: "Top Subject", val: subjects.reduce((max, curr) => {
                      const count = silabusData.filter(m => m.subject === curr[0] && completedItems[m.id]).length;
                      return count > max.count ? { name: curr[1].code, count } : max;
                   }, { name: "-", count: 0 }).name, icon: Target },
                 ].map((stat, i) => (
                   <div key={i} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                        <stat.icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{stat.label}</p>
                        <p className="font-bold text-slate-900 dark:text-slate-100">{stat.val}</p>
                      </div>
                   </div>
                 ))}
              </div>
              
              <button 
                onClick={() => navigate('/chat')}
                className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/20"
              >
                 Generate Study Plan <Sparkles className="w-4 h-4" />
              </button>

              <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                 <p className="text-xs text-slate-500 leading-relaxed italic">
                   "Pendidikan adalah senjata paling ampuh yang lu bisa pake buat ngerubah dunia."
                   <span className="block mt-2 font-bold">— Nelson Mandela (tapi relate kan?)</span>
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
