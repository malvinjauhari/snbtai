import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  MapPin, 
  ChevronRight, 
  Sparkles, 
  Trophy, 
  User,
  Heart,
  GraduationCap,
  Star,
  CheckCircle
} from 'lucide-react';
import { auth, db } from '@/src/services/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { useProgress } from '@/src/context/ProgressContext';
import { getBadge } from '@/src/lib/badgeUtils';

export default function Overview({ profile }: { profile: any }) {
  const { stats } = useProgress();
  const [recentSessions, setRecentSessions] = useState<any[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const badgeStyle = getBadge(stats.completedQuestions);

  useEffect(() => {
    const fetchRecent = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoadingSessions(false);
        return;
      }
      try {
        const q = query(
          collection(db, 'subtest_sessions'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc'),
          limit(3)
        );
        const snap = await getDocs(q);
        setRecentSessions(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching recent sessions:", error);
      } finally {
        setLoadingSessions(false);
      }
    };
    fetchRecent();
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pt-2 pb-24 md:pb-20 animate-in fade-in duration-500 px-1 sm:px-4">
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column (2/3 width on desktop) */}
        <div className="xl:col-span-2 space-y-6 flex flex-col">
          
          {/* Top Left Panel: Student ID Card */}
          <div className="relative overflow-hidden rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row gap-6 sm:gap-8 items-center min-h-[300px]">
            {/* Background Glows */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px]" />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px]" />
            
            <div className="relative shrink-0">
               <div className="w-32 h-40 bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-white/10 relative group">
                  {profile?.photoBase64 || auth.currentUser?.photoURL ? (
                    <img src={profile?.photoBase64 || auth.currentUser?.photoURL || ''} alt="User Avatar" className="w-full h-full object-cover transition-transform group-hover:scale-110" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                      <User className="w-16 h-16 text-slate-400 dark:text-slate-600" />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent" />
               </div>
               
               {/* Trophy Badge */}
               <div className={`absolute -bottom-4 -right-4 w-12 h-12 ${badgeStyle.iconBg} border-2 ${badgeStyle.border} rounded-full flex items-center justify-center shadow-xl rotate-12`}>
                  <Trophy className="w-6 h-6 text-white" />
               </div>
            </div>

            <div className="flex-1 w-full space-y-5 relative z-10">
               <div className="space-y-3">
                  <div className="flex items-center gap-3">
                     <span className="px-3 py-1 bg-indigo-600 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg shadow-indigo-600/20">
                        Kartu Tanda Calon Mahasiswa
                     </span>
                     <span className="text-[10px] font-bold text-slate-400 font-mono">#{(auth.currentUser?.uid || 'USER').substring(0, 12).toUpperCase()}</span>
                  </div>
                  
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white leading-none tracking-tight">
                      {profile?.displayName || auth.currentUser?.displayName || 'Pejuang SNBT'}
                    </h2>
                    <Link to="/student-levels" className="flex items-center gap-2 mt-1 px-2 py-0.5 bg-slate-100 dark:bg-white/5 w-fit rounded-lg border border-slate-200/50 dark:border-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors cursor-pointer group/level">
                      <span className={`w-2 h-2 rounded-full ${badgeStyle.iconBg.replace('bg-', 'animate-pulse bg-')}`} />
                      <span className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest group-hover/level:text-indigo-600 dark:group-hover/level:text-indigo-400 transition-colors">{badgeStyle.level} Badge Member</span>
                      <ChevronRight className="w-3 h-3 text-slate-400 group-hover/level:text-indigo-600 dark:group-hover/level:text-indigo-400 transition-colors" />
                    </Link>
                  </div>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                     <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.1em] block">Universitas Tujuan</span>
                     <p className="font-bold text-slate-800 dark:text-indigo-400 text-sm flex items-center gap-1.5">
                       <MapPin className="w-3.5 h-3.5" />
                       {profile?.dreamUniversity || 'Belum diatur'}
                     </p>
                  </div>
                  <div className="space-y-1">
                     <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.1em] block">Program Studi</span>
                     <p className="font-bold text-slate-800 dark:text-purple-400 text-sm flex items-center gap-1.5">
                       <GraduationCap className="w-3.5 h-3.5" />
                       {profile?.dreamMajor || 'Belum diatur'}
                     </p>
                  </div>
               </div>

               <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <div className="flex -space-x-2">
                       {[1,2,3].map(item => (
                         <div key={item} className="w-5 h-5 rounded-full border-2 border-white dark:border-slate-900 bg-indigo-500 flex items-center justify-center">
                            <CheckCircle className="w-2.5 h-2.5 text-white" />
                         </div>
                       ))}
                     </div>
                     <span className="text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest">Active Member</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-black text-slate-500 dark:text-white/40 uppercase tracking-[0.15em] block">Valid Thru</span>
                    <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase">SNBT 2026</span>
                  </div>
               </div>
            </div>
          </div>

          {/* Bottom Center Panel: Target SNBT */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl flex-1 min-h-[300px]">
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                   Target SNBT <Sparkles className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
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

        </div>

        {/* Right Column (1/3 width on desktop) */}
        <div className="xl:col-span-1 space-y-6 flex flex-col">
           
           {/* Metric 1 */}
           <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-6 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity" />
              <div className="flex items-center gap-4 relative z-10">
                 <div className="w-12 h-12 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/10 rounded-xl flex items-center justify-center shrink-0">
                    <BookOpen className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
                 </div>
                 <div>
                    <h4 className="text-3xl font-black text-slate-900 dark:text-white">{stats.materiPercentage || 0}%</h4>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1 leading-snug">Materi Silabus Dikuasai</p>
                 </div>
              </div>
           </div>

           {/* Metric 2 */}
           <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-6 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity" />
              <div className="flex items-center gap-4 relative z-10">
                 <div className="w-12 h-12 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/10 rounded-xl flex items-center justify-center shrink-0">
                    <CheckCircle className="w-6 h-6 text-purple-500 dark:text-purple-400" />
                 </div>
                 <div>
                    <h4 className="text-3xl font-black text-slate-900 dark:text-white">{stats.completedQuestions || 0}</h4>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1 leading-snug">Total Soal Dikerjakan</p>
                 </div>
              </div>
           </div>

           {/* Community Activity Stats */}
           <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative flex-1 flex flex-col justify-center overflow-hidden group min-h-[240px]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity" />
              <div className="flex items-center justify-between mb-4 relative z-10">
                 <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Aktivitas Komunitas</span>
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              </div>
              <div className="relative z-10">
                 <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">124.5K+</span>
                 <p className="text-xs font-bold text-slate-500 mt-2">Soal di Bank Soal Semua User</p>
              </div>
              <div className="mt-8 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between relative z-10">
                 <div className="space-y-1">
                   <p className="text-[10px] uppercase font-black text-slate-400">Pejuang Aktif</p>
                   <p className="text-sm font-bold text-slate-700 dark:text-slate-300">12,400+</p>
                 </div>
                 <div className="space-y-1 text-right">
                   <p className="text-[10px] uppercase font-black text-slate-400">Playlist Dibuat</p>
                   <p className="text-sm font-bold text-slate-700 dark:text-slate-300">3,200+</p>
                 </div>
              </div>
           </div>

        </div>
      </div>

      {/* Recent History Section - Wide Bottom Panel */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl">
         <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Riwayat Terakhir</h3>
            <Link to="/dashboard/bank-soal" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 flex items-center gap-1">
               Lihat Semua <ChevronRight className="w-3 h-3" />
            </Link>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loadingSessions ? (
              [1, 2, 3].map(i => (
                <div key={i} className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 p-5 rounded-2xl flex flex-col animate-pulse opacity-50">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
                    <div className="w-16 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
                  </div>
                  <div className="w-full h-5 bg-slate-200 dark:bg-slate-800 rounded mb-4" />
                  <div className="mt-auto flex items-center justify-between border-t border-slate-100 dark:border-white/5 pt-4">
                    <div className="w-12 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
                    <div className="w-12 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
                  </div>
                </div>
              ))
            ) : recentSessions.length > 0 ? (
              recentSessions.map((session, idx) => (
                <div key={session.id} className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 p-5 rounded-2xl flex flex-col transition-all hover:border-slate-200 dark:hover:border-white/10">
                   <div className="flex items-center gap-2 mb-3">
                      <div className="px-2 py-1 bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-wider rounded">{session.subtest}</div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase">
                        {session.createdAt?.toDate ? session.createdAt.toDate().toLocaleDateString() : 'Baru aja'}
                      </span>
                   </div>
                   <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-4">{session.subtest} Level {session.level}</h4>
                   <div className="mt-auto flex items-center justify-between border-t border-slate-100 dark:border-white/5 pt-4">
                      <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-500">
                         <Star className="w-4 h-4 fill-current" />
                         <span className="font-black text-sm text-slate-700 dark:text-amber-500">Skor IRT</span>
                      </div>
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">{session.isFinished ? 'Selesai' : 'Sedang Dikerjakan'}</span>
                   </div>
                </div>
              ))
            ) : (
                <div className="col-span-full py-10 flex flex-col items-center justify-center text-center space-y-4">
                   <div className="w-16 h-16 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-full flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-indigo-500/50" />
                   </div>
                   <div>
                      <p className="text-slate-600 dark:text-slate-400 font-bold">Waduh, belum ada soal yang lu buat nih</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Generate simulasi kustom lu pertama kali di menu AI Magic!</p>
                   </div>
                   <Link to="/chat" className="px-6 py-2 bg-indigo-600 text-white text-xs font-black rounded-xl hover:scale-105 transition-all">
                      Bikin Soal Sekarang
                   </Link>
                </div>
            )}
         </div>
      </div>
    </div>
  );
}
