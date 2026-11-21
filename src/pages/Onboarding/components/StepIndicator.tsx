import React from 'react';
import { cn } from '@/src/lib/utils';

interface StepIndicatorProps {
  currentStep: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  return (
    <div className="absolute top-12 left-1/2 -translate-x-1/2 flex items-center gap-3">
      {[1, 2, 3].map((s) => (
        <div 
          key={s} 
          className={cn(
            "h-1.5 rounded-full transition-all duration-500",
            currentStep === s ? "w-8 bg-indigo-500" : "w-4 bg-slate-800"
          )} 
        />
      ))}
    </div>
  );
};
