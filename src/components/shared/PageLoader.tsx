import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export const PageLoader: React.FC<{ isLanding?: boolean, fullScreen?: boolean }> = ({ isLanding = false, fullScreen = true }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Failsafe Rule: If loading completes under 250ms, don't show loader.
    const timer = setTimeout(() => setShow(true), 250);
    return () => clearTimeout(timer);
  }, []);

  if (isLanding) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col pt-16">
        {/* Soft skeleton for landing */}
        <motion.div 
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          animate={{ opacity: show ? 1 : 0, filter: show ? 'blur(0px)' : 'blur(10px)' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="max-w-4xl mx-auto w-full flex flex-col items-center justify-center pt-24 px-6"
        >
          <div className="w-48 h-8 rounded-full bg-slate-50 dark:bg-white/5 mb-8 animate-pulse" />
          <div className="w-full max-w-2xl h-16 sm:h-32 rounded-2xl bg-slate-50 dark:bg-white/5 mb-6 animate-pulse" />
          <div className="w-3/4 max-w-lg h-8 px-4 rounded-xl bg-slate-50 dark:bg-white/5 mb-10 animate-pulse" />
          <div className="flex flex-col sm:flex-row gap-4 items-center">
             <div className="w-48 h-12 rounded-full bg-slate-50 dark:bg-white/5 animate-pulse" />
             <div className="w-48 h-12 rounded-full bg-slate-50 dark:bg-white/5 animate-pulse" />
          </div>
        </motion.div>
      </div>
    );
  }

  const LoaderDots = () => (
    <div className="flex gap-1.5 items-center justify-center">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          initial={{ y: 0, opacity: 0.3 }}
          animate={{ y: [-3, 3, -3], opacity: [0.3, 1, 0.3] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.15,
          }}
          className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400"
        />
      ))}
    </div>
  );

  if (!fullScreen) {
    return (
      <AnimatePresence>
        {show && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center p-8 w-full h-full min-h-[200px]"
          >
            <LoaderDots />
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 dark:bg-slate-950/40 backdrop-blur-sm"
        >
          <LoaderDots />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
