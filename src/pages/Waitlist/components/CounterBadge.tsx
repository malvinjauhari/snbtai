import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users } from 'lucide-react';

export default function CounterBadge() {
  const [count, setCount] = useState(1402); // Initial base count

  useEffect(() => {
    // Dynamic simulation of waitlist growing
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setCount(prev => prev + Math.floor(Math.random() * 3) + 1);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 backdrop-blur-sm shadow-xl hover:bg-indigo-500/20 transition-colors">
      <div className="flex -space-x-2 mr-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`w-6 h-6 rounded-full border-2 border-[#0B0F19] bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white z-${10-i}`}>
            <Users className="w-3 h-3" />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs font-bold text-indigo-300">
          <motion.span 
            key={count}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block"
          >
            {count.toLocaleString()}
          </motion.span>
          {' '}Pejuang bergabung
        </span>
      </div>
    </div>
  );
}
