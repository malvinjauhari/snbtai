import React from 'react';
import { Sparkles, MapPin, GraduationCap, Heart } from 'lucide-react';
import { UserProfile } from '../types';

export const TargetAmbis: React.FC<{ profile: UserProfile | null }> = ({ profile }) => {
  return (
    <div className="premium-card rounded-[2rem] p-8 flex-1 min-h-[300px]">
       <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
             Target UTBK <Sparkles className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
          </h3>
       </div>
       
       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Kampus Impian", value: profile?.dreamUniversity || "Atur di Profil", icon: MapPin },
            { label: "Jurusan Impian", value: profile?.dreamMajor || "Atur di Profil", icon: GraduationCap },
            { label: "Motivasi", value: profile?.reason || "Fokus demi masa depan!", icon: Heart },
          ].map((goal, i) => (
            <div key={i} className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 p-4 rounded-2xl flex flex-col gap-3">
               <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center">
                  <goal.icon className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
               </div>
               <div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">{goal.label}</span>
                  <p className="font-bold text-slate-700 dark:text-slate-200 text-sm line-clamp-2">{goal.value}</p>
               </div>
            </div>
          ))}
       </div>
    </div>
  );
};
