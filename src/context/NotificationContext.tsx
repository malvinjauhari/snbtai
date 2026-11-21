import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, XCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/src/lib/utils';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface Notification {
  id: string;
  message: string;
  type: NotificationType;
}

interface NotificationContextType {
  showNotification: (message: string, type?: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback((message: string, type: NotificationType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {notifications.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              className={cn(
                "flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border pointer-events-auto backdrop-blur-xl min-w-[300px]",
                n.type === 'success' && "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
                n.type === 'error' && "bg-rose-500/10 border-rose-500/20 text-rose-400",
                n.type === 'warning' && "bg-amber-500/10 border-amber-500/20 text-amber-400",
                n.type === 'info' && "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
              )}
            >
              {n.type === 'success' && <CheckCircle2 className="w-5 h-5 shrink-0" />}
              {n.type === 'error' && <XCircle className="w-5 h-5 shrink-0" />}
              {n.type === 'warning' && <AlertTriangle className="w-5 h-5 shrink-0" />}
              {n.type === 'info' && <Info className="w-5 h-5 shrink-0" />}
              <p className="font-bold text-sm tracking-tight">{n.message}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
}

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within NotificationProvider');
  return context;
};
