import { motion } from 'motion/react';
import { Mail, Github, Twitter, Globe, MessageSquare } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 space-y-16">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500">
           The Vision.
        </h1>
        <p className="text-slate-400 font-medium text-xl max-w-2xl mx-auto">
          Membangun masa depan pendidikan Indonesia dengan AI. Membantu setiap pejuang menemukan jalannya ke PTN impian.
        </p>
      </div>

      <div className="p-12 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-[3rem] space-y-8">
        <div className="prose prose-invert prose-indigo max-w-none">
          <p className="text-lg text-slate-300 leading-relaxed font-medium">
             <strong>SNBT AI</strong> lahir dari kegelisahan akan sulitnya akses persiapan ujian yang berkualitas dan personal. Kita percaya setiap siswa punya potensi, tapi nggak semua punya pelatih pribadi 24/7.
          </p>
          <p className="text-lg text-slate-300 leading-relaxed font-medium">
             Dengan teknologi Gemini AI, kita bikin "Pelatih Pribadi" itu nyata. Dia bisa baca curhatan materi lu, buatin soal simulasi yang menjebak, dan jelasin konsepnya sampe lu ngelindur pun paham.
          </p>
        </div>
        
        <div className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-800">
          <div>
            <h4 className="text-sm font-black text-indigo-400 uppercase tracking-widest mb-4">Misi Kita</h4>
            <ul className="space-y-3 text-slate-400 font-bold">
              <li>• Personalisasi Belajar Tanpa Batas</li>
              <li>• Demokratisasi Bank Soal Premium</li>
              <li>• Sistem Penilaian IRT yang Akurat</li>
              <li>• Komunitas Pejuang Sehat</li>
            </ul>
          </div>
          <div className="flex flex-col justify-end items-end gap-4">
             <div className="flex gap-2">
                {[Github, Twitter, Globe].map((Icon, i) => (
                  <div key={i} className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center hover:text-indigo-400 transition-colors cursor-pointer">
                    <Icon className="w-5 h-5" />
                  </div>
                ))}
             </div>
             <p className="text-[10px] font-bold text-slate-600 tracking-widest">EST. 2026 • JAKARTA, ID</p>
          </div>
        </div>
      </div>
    </div>
  );
}
