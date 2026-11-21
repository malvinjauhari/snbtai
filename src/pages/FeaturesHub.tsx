import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  MessageSquare, 
  Library, 
  GraduationCap, 
  BookOpen, 
  TrendingUp, 
  Star, 
  PenTool, 
  Heart, 
  Flame,
  ChevronRight,
  Compass
} from 'lucide-react';

const features = [
  {
    id: 'chat',
    title: 'Chat AI',
    description: 'Tanya soal dan bedah materi bareng asisten AI',
    icon: MessageSquare,
    path: '/chat',
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-500/10',
    border: 'border-blue-200 dark:border-blue-500/20'
  },
  {
    id: 'studipath',
    title: 'Study Path',
    description: 'Roadmap belajar personal rakitan AI',
    icon: Compass,
    path: '/studipath',
    color: 'text-rose-500',
    bg: 'bg-rose-50 dark:bg-rose-500/10',
    border: 'border-rose-200 dark:border-rose-500/20',
    wide: true
  },
  {
    id: 'playlist',
    title: 'Playlist Soal',
    description: 'Eksplor dan susun daftar latihan soal andalanmu',
    icon: Library,
    path: '/playlist/explore',
    color: 'text-indigo-500',
    bg: 'bg-indigo-50 dark:bg-indigo-500/10',
    border: 'border-indigo-200 dark:border-indigo-500/20',
    wide: true
  },
  {
    id: 'ptnpedia',
    title: 'PTN Pedia',
    description: 'Info daya tampung & keketatan PTN',
    icon: GraduationCap,
    path: '/ptnpedia',
    color: 'text-violet-500',
    bg: 'bg-violet-50 dark:bg-violet-500/10',
    border: 'border-violet-200 dark:border-violet-500/20'
  },
  {
    id: 'bank-soal',
    title: 'Bank Soal',
    description: 'Ribuan soal asli SNBT tahun-tahun sebelumnya',
    icon: BookOpen,
    path: '/dashboard/bank-soal',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    border: 'border-emerald-200 dark:border-emerald-500/20'
  },
  {
    id: 'progress',
    title: 'Progress',
    description: 'Pantau perkembangan belajarmu',
    icon: TrendingUp,
    path: '/fiturambis/progress',
    color: 'text-sky-500',
    bg: 'bg-sky-50 dark:bg-sky-500/10',
    border: 'border-sky-200 dark:border-sky-500/20'
  },
  {
    id: 'vocab',
    title: 'Vocab',
    description: 'Latihan kosakata bahasa Inggris',
    icon: Star,
    path: '/fiturambis/vocab',
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-500/10',
    border: 'border-amber-200 dark:border-amber-500/20'
  },
  {
    id: 'eyd-test',
    title: 'EYD Habit',
    description: 'Nge-drill ejaan dan tanda baca',
    icon: PenTool,
    path: '/fiturambis/eyd-test',
    color: 'text-cyan-500',
    bg: 'bg-cyan-50 dark:bg-cyan-500/10',
    border: 'border-cyan-200 dark:border-cyan-500/20'
  },
  {
    id: 'wishlist',
    title: 'Wishlist',
    description: 'Soal tersimpan',
    icon: Heart,
    path: '/fiturambis/wishlist',
    color: 'text-pink-500',
    bg: 'bg-pink-50 dark:bg-pink-500/10',
    border: 'border-pink-200 dark:border-pink-500/20'
  }
];

export default function FeaturesHub() {
  return (
    <div className="space-y-6 pb-6">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          Fitur Unggulan
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Akses semua fitur belajar dalam satu tempat.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {features.map((feature, i) => (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className={feature.wide ? "col-span-2 md:col-span-2" : "col-span-1"}
          >
            <Link 
              to={feature.path}
              className={`block h-full group p-4 rounded-[1.25rem] glass-panel hover:border-slate-300 dark:hover:border-white/10 shadow-sm hover:shadow-md transition-all active:scale-[0.98] ${feature.wide ? 'flex flex-row items-center gap-4' : 'flex flex-col'}`}
            >
              <div className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl mb-3 ${feature.bg} ${feature.color} ${feature.wide ? 'mb-0 shrink-0' : ''}`}>
                <feature.icon className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm md:text-base font-bold text-slate-800 dark:text-slate-100">
                    {feature.title}
                  </h3>
                  {feature.wide && (
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors" />
                  )}
                </div>
                <p className={`text-xs text-slate-500 dark:text-slate-400 mt-1 pb-1 ${feature.wide ? 'line-clamp-1' : 'line-clamp-2 md:line-clamp-3 leading-relaxed'}`}>
                  {feature.description}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
