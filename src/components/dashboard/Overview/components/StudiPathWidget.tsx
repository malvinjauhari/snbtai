import React, { useEffect, useState } from 'react';
import { Compass, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { auth } from '@/src/services/firebase';
import { getActiveStudiPath, getStudiPathTasks, StudiPath, StudiPathTask, updateTaskStatus } from '@/src/services/studipath';

export function StudiPathWidget() {
  const [activePath, setActivePath] = useState<StudiPath | null>(null);
  const [tasks, setTasks] = useState<StudiPathTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPath = async () => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const path = await getActiveStudiPath(user.uid);
        if (path) {
          setActivePath(path);
          const allTasks = await getStudiPathTasks(path.id, user.uid);
          // Just get today's or pending tasks for the widget
          const pending = allTasks.filter(t => t.status !== 'done' && t.status !== 'missed');
          setTasks(pending.slice(0, 3));
        }
      } catch (err) {
        console.error("Widget StudiPath Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPath();
  }, []);

  const handleQuickCheck = async (taskId: string) => {
    const newTasks = tasks.filter(t => t.id !== taskId);
    setTasks(newTasks);
    await updateTaskStatus(taskId, 'done');
  };

  if (loading) {
     return <div className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl h-32 animate-pulse" />;
  }

  if (!activePath) {
    return (
      <div className="p-5 bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/30 dark:to-slate-900 border border-indigo-100 dark:border-indigo-500/20 rounded-3xl flex items-center justify-between">
        <div className="pt-1">
           <h3 className="text-base font-bold text-slate-800 dark:text-white mb-1 flex items-center gap-2">
             <Compass className="w-5 h-5 text-indigo-500" />
             Study Path
           </h3>
           <p className="text-xs text-slate-500 max-w-xs">AI akan merancang jadwal belajarmu secara personal. 🚀</p>
        </div>
        <Link to="/dashboard/studipath" className="px-5 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20 whitespace-nowrap">
          Buat Sekarang
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 shadow-sm rounded-3xl">
      <div className="flex items-center justify-between mb-4">
        <div>
           <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
             <Compass className="w-5 h-5 text-indigo-500" />
             Study Path: {activePath.title}
           </h3>
           <p className="text-[11px] text-slate-500 uppercase tracking-widest font-black mt-1">Fokus: {activePath.dashboardSummary.todayFocus}</p>
        </div>
        <Link to="/dashboard/studipath" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
          Buka Board
        </Link>
      </div>

      <div className="space-y-2 mt-4">
        {tasks.length > 0 ? (
          tasks.map(task => (
            <div key={task.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-white/5 group transition-colors">
              <button 
                onClick={() => handleQuickCheck(task.id)}
                className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center shrink-0 hover:border-indigo-500 text-transparent hover:text-indigo-500 transition-colors mt-0.5"
              >
                <Check className="w-3 h-3" />
              </button>
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-white leading-tight">{task.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] font-black uppercase text-indigo-500">{task.subject}</span>
                  <span className="text-[9px] text-slate-400">• {task.estimatedMinutes} Mnt</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-white/5 text-center">
            <p className="text-sm font-medium text-slate-500">Semua task hari ini selesai! 🎉</p>
          </div>
        )}
      </div>
    </div>
  );
}
