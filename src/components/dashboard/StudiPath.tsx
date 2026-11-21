import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Sparkles, Plus, Check, MoreVertical, X, Loader, MessageSquare, AlertCircle } from 'lucide-react';
import { useAuth } from '@/src/context/AuthContext';
import { getActiveStudiPath, getStudiPathTasks, saveStudiPathAndTasks, updateTaskStatus, rescheduleTask, StudiPath, StudiPathTask } from '@/src/services/studipath';
import { gatherStudiPathContext, generateStudiPathPlan } from '@/src/services/aiStudiPath';
import { CreditCostPreview } from '@/src/components/credits/CreditCostPreview';
import { useNotification } from '@/src/context/NotificationContext';
import { StudiPathBoard } from '@/src/components/dashboard/StudiPath/StudiPathBoard';

export default function StudiPathView() {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [activePath, setActivePath] = useState<StudiPath | null>(null);
  const [tasks, setTasks] = useState<StudiPathTask[]>([]);
  
  // Creation States
  const [chatHistory, setChatHistory] = useState<{role: string, text: string}[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isGathering, setIsGathering] = useState(false);
  const [previewContext, setPreviewContext] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const path = await getActiveStudiPath(user!.uid);
      setActivePath(path);
      if (path) {
        const pTasks = await getStudiPathTasks(path.id, user!.uid);
        setTasks(pTasks);
      }
    } catch (err) {
      console.error(err);
      showNotification("Gagal memuat StudiPath", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isGathering) return;
    const msg = chatInput.trim();
    setChatInput("");
    setChatHistory(prev => [...prev, { role: "user", text: msg }]);
    setIsGathering(true);

    try {
      const formattedHistory = chatHistory.map(h => ({
        role: h.role, parts: [{ text: h.text }]
      }));
      const res = await gatherStudiPathContext(msg, formattedHistory);
      
      setChatHistory(prev => [...prev, { role: "model", text: res.aiResponse }]);
      
      if (res.isContextComplete && res.extractedContext) {
        setPreviewContext(res.extractedContext);
      }
    } catch (err) {
      showNotification("Gagal memproses pesan, silakan coba lagi.", "error");
    } finally {
      setIsGathering(false);
    }
  };

  const handleGenerateFinal = async () => {
    if (!previewContext || !user) return;
    setIsGenerating(true);
    try {
      // This will deduct 5 credits in the backend
      const plan = await generateStudiPathPlan(previewContext);
      
      const tasksData: Omit<StudiPathTask, "id" | "studyPathId" | "userId" | "createdAt" | "updatedAt">[] = plan.dailyTasks.map((t: any) => ({
        title: t.title,
        description: t.description,
        subject: t.subject,
        topic: t.topic,
        taskType: t.taskType,
        estimatedMinutes: t.estimatedMinutes,
        date: new Date(Date.now() + (t.dayNumber - 1) * 86400000).toISOString().split('T')[0],
        weekNumber: t.weekNumber,
        dayNumber: t.dayNumber,
        status: "todo",
        priority: t.priority || "medium",
      }));

      const pathData: Omit<StudiPath, "id" | "userId" | "createdAt" | "updatedAt"> = {
        title: plan.title || "StudiPath SNBT",
        targetExam: previewContext.targetExam || "SNBT",
        preparationDuration: previewContext.preparationDuration || "1 Bulan",
        dailyStudyTime: previewContext.dailyStudyTime || "60 Menit",
        weakSubjects: previewContext.weakSubjects || [],
        strongSubjects: previewContext.strongSubjects || [],
        aiDiagnosis: plan.aiDiagnosis || "",
        strategySummary: plan.strategySummary || "",
        studyRatio: plan.studyRatio || {},
        weeklyRoadmap: plan.weeklyRoadmap || [],
        dashboardSummary: plan.dashboardSummary || {
          todayFocus: "Persiapan",
          estimatedMinutes: 30,
          message: "Ayo mulai!"
        }
      };

      await saveStudiPathAndTasks(user.uid, pathData, tasksData);
      showNotification("StudiPath berhasil dibuat!", "success");
      setPreviewContext(null);
      await loadData();
    } catch (err: any) {
      if (err.message === 'INSUFFICIENT_CREDITS' || err.message === 'DAILY_LIMIT_EXCEEDED') {
         showNotification("Kredit tidak cukup (Butuh 5 kredit).", "error");
      } else {
         showNotification("Gagal membuat StudiPath. Kredit tidak terpotong.", "error");
      }
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, newStatusOrCurrent: string) => {
    try {
      let newStatus: any = newStatusOrCurrent;
      if (newStatusOrCurrent === 'done' || newStatusOrCurrent === 'todo' || newStatusOrCurrent === 'missed' || newStatusOrCurrent === 'upcoming') {
         // Direct update from droppable area or direct toggle logic from board
         // Wait, the board does: `task.status === 'done' ? 'todo' : 'done'` for the check button,
         // and passes `targetColId` for drag and drop. Both are valid new statuses.
      } else {
         // Fallback just in case
         newStatus = newStatusOrCurrent === 'done' ? 'todo' : 'done';
      }
      
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
      await updateTaskStatus(taskId, newStatus);
    } catch (err) {
      showNotification("Gagal update task", "error");
      await loadData(); // revert
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 min-h-[400px]">
        <Loader className="w-8 h-8 animate-spin text-indigo-600 mb-4" />
        <p className="text-slate-500 font-medium">Memuat Study Path...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <Compass className="text-indigo-600 dark:text-indigo-400" />
            Study Path
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Sistem belajar SNBT terpersonalisasi dengan AI.
          </p>
        </div>
      </div>

      {!activePath ? (
        <div className="flex flex-col items-center justify-center max-w-2xl mx-auto mt-20 space-y-6 text-center">
            <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-2">
              <Compass className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-2xl font-black dark:text-white">Belum ada Study Path aktif.</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-md">
              Buat recana belajar SNBT harian yang dirancang otomatis oleh AI berdasarkan kelemahan, kelebihan, dan durasi persiapanmu.
            </p>
            <button
               onClick={() => window.location.href = '/chat?flow=studipath'}
               className="mt-4 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold shadow-xl shadow-indigo-600/20 flex items-center gap-2 transform hover:-translate-y-0.5 transition-all"
            >
               <Sparkles className="w-5 h-5" />
               Buat Study Path dari Chat AI
            </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
           {/* Sidebar Info */}
           <div className="lg:col-span-1 space-y-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm">
                <h3 className="font-bold text-lg dark:text-white mb-4">{activePath.title}</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">Diagnosis AI</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{activePath.aiDiagnosis}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">Fokus Hari Ini</p>
                    <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{activePath.dashboardSummary.todayFocus}</p>
                  </div>
                </div>
              </div>
           </div>

           {/* Task Board */}
           <div className="lg:col-span-3">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm min-h-[500px]">
                <h3 className="font-bold text-lg dark:text-white mb-6">Task Board</h3>
                <StudiPathBoard tasks={tasks} onTaskUpdate={handleUpdateTaskStatus} />
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
