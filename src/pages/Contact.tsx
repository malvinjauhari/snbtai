import { motion } from 'motion/react';
import { Mail, MessageSquare, MapPin, Send } from 'lucide-react';

export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500">
           Reach Out.
        </h1>
        <p className="text-slate-400 font-medium text-xl max-w-2xl mx-auto">
          Ada kendala atau mau kolaborasi bareng tim SNBT AI? Kita standby buat bantu lu.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Email Us', val: 'halo@snbt.ai', icon: Mail },
          { label: 'Chat Admin', val: '@snbt_support', icon: MessageSquare },
          { label: 'Basecamp', val: 'Jakarta, ID', icon: MapPin },
        ].map((item, i) => (
          <div key={i} className="p-8 bg-slate-900 border border-slate-800 rounded-[2.5rem] flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-indigo-400">
               <item.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-loose">{item.label}</p>
              <p className="font-bold text-slate-200">{item.val}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-10 bg-slate-900/40 border border-slate-800 rounded-[3rem] max-w-2xl mx-auto">
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" placeholder="Nama Lu" className="w-full px-6 py-4 bg-slate-900 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none font-bold" />
            <input type="email" placeholder="Email Lu" className="w-full px-6 py-4 bg-slate-900 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none font-bold" />
          </div>
          <textarea rows={4} placeholder="Pesan lu..." className="w-full px-6 py-4 bg-slate-900 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none h-40 resize-none font-medium" />
          <button className="w-full py-5 bg-white text-slate-950 font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2">
             Kirim Pesan <Send className="w-5 h-5 text-indigo-600" />
          </button>
        </form>
      </div>
    </div>
  );
}
