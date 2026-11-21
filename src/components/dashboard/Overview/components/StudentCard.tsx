import React from 'react';
import { User, Trophy, MapPin, GraduationCap, GripHorizontal } from 'lucide-react';
import { auth } from '@/src/services/firebase';
import { UserProfile } from '../types';
import { BadgeStyle } from '@/src/lib/badgeUtils';

interface StudentCardProps {
  profile: UserProfile | null;
  badgeStyle: BadgeStyle;
}

export const StudentCard: React.FC<StudentCardProps> = ({ profile, badgeStyle }) => {
  const userUID = auth.currentUser?.uid || 'GUEST-000000000000';
  const formattedUID = userUID.substring(0, 16).toUpperCase().replace(/(.{4})/g, '$1 ');

  return (
    <div className="student-card-premium relative overflow-hidden w-full max-w-2xl mx-auto rounded-3xl p-6 relative group transition-all">
      {/* Background Glows and Noise pattern */}
      <div className={`absolute -top-10 -right-10 w-64 h-64 ${badgeStyle.glow} opacity-10 transition-opacity group-hover:opacity-20 rounded-full blur-2xl pointer-events-none transform-gpu hidden`} />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '16px 16px' }} />
      
      {/* Header: Republic / Title */}
      <div className="flex justify-between items-start border-b border-white/10 pb-4 mb-5 relative z-10">
        <div className="flex flex-col">
           <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-slate-400">SNBT AI Card</span>
           <h1 className={`text-lg md:text-xl font-black uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-r ${badgeStyle.color}`}>
             Kartu Tanda Calon Mahasiswa
           </h1>
        </div>
        <div className="flex-shrink-0 flex items-center justify-center w-10 h-8 rounded-md bg-gradient-to-br from-amber-200/80 via-yellow-400/80 to-amber-600/80 shadow-[inset_0_0_8px_rgba(255,255,255,0.5)] border border-yellow-200/30 overflow-hidden">
           {/* Simulated Chip pattern */}
           <div className="w-full h-full flex flex-col justify-around py-1 px-1 opacity-50">
             <div className="border border-amber-900/40 rounded-sm w-full h-[1px]" />
             <div className="grid grid-cols-2 gap-1 h-3">
               <div className="border border-amber-900/40 rounded-sm" />
               <div className="border border-amber-900/40 rounded-sm" />
             </div>
             <div className="border border-amber-900/40 rounded-sm w-full h-[1px]" />
           </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-6 relative z-10 w-full">
        {/* Left: Photo */}
        <div className="shrink-0 flex flex-col items-center">
           <div className={`w-28 h-36 md:w-32 md:h-40 bg-slate-800 rounded-xl overflow-hidden flex items-center justify-center relative border-2 ${badgeStyle.border} shadow-xl`}>
             {profile?.photoBase64 || auth.currentUser?.photoURL ? (
               <img src={profile?.photoBase64 || auth.currentUser?.photoURL || ''} alt="User Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
             ) : (
               <div className="w-full h-full flex items-center justify-center bg-slate-800">
                 <User className="w-12 h-12 text-slate-500" />
               </div>
             )}
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
             <div className="absolute top-2 right-2 opacity-30">
               <GripHorizontal className="w-4 h-4 text-white" />
             </div>
           </div>
           
           {/* Small badge below photo */}
           <div className={`mt-[-12px] z-20 px-3 py-1 rounded-full ${badgeStyle.iconBg} border border-white/20 shadow-lg flex items-center gap-1.5`}>
              <Trophy className="w-3 h-3 text-white" />
              <span className="text-[9px] md:text-[10px] font-black text-white uppercase tracking-wider">{badgeStyle.level}</span>
           </div>
        </div>

        {/* Right: Details Grid */}
        <div className="flex-1 w-full space-y-4 md:space-y-5">
           <div>
             <span className="text-[8px] md:text-[9px] text-slate-400 uppercase tracking-widest font-black block mb-0.5">Nomor Identitas (UID)</span>
             <p className="font-mono text-sm md:text-base text-slate-200 tracking-[0.1em] font-medium leading-none">
               {formattedUID}
             </p>
           </div>

           <div className="space-y-4">
             <div>
                <span className="text-[8px] md:text-[9px] text-slate-400 uppercase tracking-widest font-black block mb-0.5">Nama Lengkap</span>
                <p className="font-bold text-slate-100 text-sm md:text-base uppercase tracking-wide leading-none">
                  {profile?.displayName || auth.currentUser?.displayName || 'Pejuang SNBT'}
                </p>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                   <span className="text-[8px] md:text-[9px] text-slate-400 uppercase tracking-widest font-black block mb-1">Universitas Tujuan</span>
                   <p className="font-bold text-slate-200 text-xs md:text-sm uppercase flex items-center gap-1.5 leading-none">
                     <MapPin className="w-3.5 h-3.5 text-slate-400" />
                     {profile?.dreamUniversity || 'BELUM DIATUR'}
                   </p>
                </div>
                <div>
                   <span className="text-[8px] md:text-[9px] text-slate-400 uppercase tracking-widest font-black block mb-1">Program Studi</span>
                   <p className="font-bold text-slate-200 text-xs md:text-sm uppercase flex items-center gap-1.5 leading-none">
                     <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                     {profile?.dreamMajor || 'BELUM DIATUR'}
                   </p>
                </div>
             </div>
           </div>

           <div className="flex items-end justify-between pt-4 mt-2 border-t border-white/10 w-full">
              <div>
                <span className="text-[8px] md:text-[9px] text-slate-400 uppercase tracking-widest font-black block mb-1">Valid Thru</span>
                <p className={`font-black text-xs md:text-sm uppercase bg-clip-text text-transparent bg-gradient-to-r ${badgeStyle.color}`}>SNBT 2026</p>
              </div>
              
              {/* Barcode / Decor */}
              <div className="flex flex-col items-end opacity-40">
                 <div className="h-6 w-24 md:w-32 flex justify-end gap-[2px] items-stretch pr-1">
                   {[...Array(12)].map((_, i) => (
                     <div key={i} className={`bg-slate-300 ${i % 3 === 0 ? 'w-1' : i % 5 === 0 ? 'w-1.5' : 'w-0.5'}`} />
                   ))}
                 </div>
                 <span className="font-mono text-[6px] md:text-[7px] tracking-[0.3em] mt-1 text-slate-300">AUTH-{badgeStyle.level.toUpperCase()}</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

