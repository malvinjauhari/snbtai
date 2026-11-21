import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Send, Plus, History, ChevronLeft, ChevronRight, Sparkles, Image as ImageIcon, Brain, Target, Zap } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import FloatingNavbar from '@/src/components/FloatingNavbar';
import { cn } from '@/src/lib/utils';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  type?: 'text' | 'selection' | 'level' | 'action';
  options?: string[];
  level?: number;
  mode?: 'learning' | 'game';
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      content: "Halo Pejuang! Lagi pusing mikirin apa hari ini? Curhatin aja di sini, atau paste materi yang bikin lu stuck. Biar gw ubah jadi simulasi SNBT."
    }
  ]);
  const [input, setInput] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Simulated AI Response logic based on the blueprint sequence
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: "Materi ini menarik! Gw bisa bikin lu paham pakai style soal yang menjebak. Kita mau hajar di subtes apa nih?",
        type: 'selection',
        options: ['Penalaran Umum', 'Penalaran Matematika', 'Literasi BI', 'Literasi BE', 'PPU', 'PBM']
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleOptionClick = (option: string) => {
    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: option };
    setMessages(prev => [...prev, userMessage]);
    
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: "Beres. Terakhir, seberapa brutal lu mau dibantai, dan mau mode apa?",
        type: 'level'
      }]);
    }, 8000); // Longer pause for 'thinking' effect as per blueprint
  };

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <FloatingNavbar />
      
      {/* Sidebar - History */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 320 : 0 }}
        className="glass border-r border-white/10 relative h-full flex flex-col z-20"
      >
        <div className="p-6">
          <button className="w-full premium-button flex items-center justify-center gap-2 mb-8">
            <Plus className="w-4 h-4" /> New Topic
          </button>
          
          <div className="space-y-6 overflow-y-auto">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-4 px-2">Recent Chats</p>
              <div className="space-y-1">
                {['Curhatan diputusin -> Soal PU', 'Analogi Mobile Legends -> PK', 'Matriks HOTS - Neraka'].map((chat, i) => (
                  <button key={i} className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 transition-colors flex items-center gap-3 text-sm text-slate-300">
                    <History className="w-4 h-4 opacity-50" />
                    <span className="truncate">{chat}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-12 glass border border-white/10 rounded-r-xl flex items-center justify-center hover:bg-slate-800 transition-colors z-30"
        >
          {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </motion.aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col relative h-full">
        {/* Header */}
        <div className="h-16 border-b border-white/10 flex items-center justify-between px-8 glass backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white">S</div>
            <h2 className="font-bold">SNBT AI Mentor</h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            AI Online (Gemini 2.5)
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-12 space-y-8 pb-40">
           {messages.map((msg, i) => (
             <motion.div
               key={msg.id}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className={cn(
                 "flex gap-4 max-w-2xl",
                 msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
               )}
             >
               <div className={cn(
                 "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
                 msg.role === 'ai' ? "bg-blue-600" : "bg-slate-800 border border-white/10"
               )}>
                 {msg.role === 'ai' ? <Sparkles className="w-5 h-5 text-white" /> : <span className="font-bold text-xs uppercase">Me</span>}
               </div>

               <div className="space-y-4 flex-1">
                 <div className={cn(
                   "p-5 rounded-2xl text-sm leading-relaxed",
                   msg.role === 'ai' 
                     ? "glass-card p-0 overflow-hidden border-white/5" 
                     : "bg-blue-600 text-white shadow-xl"
                 )}>
                   <div className="p-5">{msg.content}</div>
                   
                   {msg.type === 'selection' && (
                     <div className="p-4 bg-slate-900/50 border-t border-white/5 grid grid-cols-2 gap-2">
                        {msg.options?.map(opt => (
                          <button 
                            key={opt}
                            onClick={() => handleOptionClick(opt)}
                            className="text-left px-3 py-2.5 rounded-lg border border-white/10 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all text-xs"
                          >
                            {opt}
                          </button>
                        ))}
                     </div>
                   )}

                   {msg.type === 'level' && (
                     <div className="p-6 bg-slate-900/50 border-t border-white/5 space-y-6">
                        <div className="space-y-3">
                           <div className="flex justify-between text-xs text-slate-400 uppercase tracking-widest">
                              <span>Level Slider</span>
                              <span className="text-blue-400">HOTS / Neraka</span>
                           </div>
                           <input type="range" min="1" max="5" defaultValue="3" className="w-full accent-blue-500" />
                        </div>
                        
                        <div className="flex items-center justify-between">
                           <span className="text-xs text-slate-400 uppercase">Mode Switch</span>
                           <div className="flex glass rounded-lg p-1">
                              <button className="px-3 py-1 bg-white/5 rounded text-[10px] uppercase font-bold">Learning</button>
                              <button className="px-3 py-1 text-[10px] uppercase font-bold text-slate-500">Game Mode</button>
                           </div>
                        </div>

                        <button 
                          onClick={() => {
                            setMessages(prev => [...prev, {
                               id: Date.now().toString(),
                               role: 'ai',
                               content: "Dapet. 5 Soal Penalaran Matematika, Level 4, Mode Timer. Tarik napas.",
                               type: 'action'
                            }]);
                          }}
                          className="w-full premium-button text-xs py-3"
                        >
                          Generate Soal Sekarang
                        </button>
                     </div>
                   )}

                   {msg.type === 'action' && (
                     <div className="p-4 bg-slate-900/50 border-t border-white/5">
                        <button 
                          onClick={() => navigate('/question/matriks-hot-01')}
                          className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 font-bold text-sm tracking-widest uppercase hover:scale-[1.02] transition-transform active:scale-95"
                        >
                          Mulai Uji Nyali 🚀
                        </button>
                     </div>
                   )}
                 </div>
               </div>
             </motion.div>
           ))}
        </div>

        {/* Input Area */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-full max-w-3xl px-6">
           <div className="glass-card flex items-end gap-3 p-4 shadow-3xl bg-slate-900/60 transition-all hover:bg-slate-900/80">
              <button className="p-3 rounded-xl hover:bg-white/10 text-slate-400 transition-colors shrink-0 group">
                <Camera className="w-5 h-5 group-hover:text-blue-400" />
              </button>
              <button className="p-3 rounded-xl hover:bg-white/10 text-slate-400 transition-colors shrink-0 group">
                <ImageIcon className="w-5 h-5 group-hover:text-blue-400" />
              </button>
              
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                placeholder="Curhatin aja di sini..."
                className="flex-1 bg-transparent border-none outline-none resize-none h-12 py-3 text-sm"
              />

              <button 
                onClick={handleSend}
                className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 hover:bg-blue-500 transition-all active:scale-90"
              >
                <Send className="w-5 h-5" />
              </button>
           </div>
           
           <div className="flex justify-center gap-2 mt-4">
              {['Pilih Topik Random', 'Upload Catatan (AI Lens)', 'Lanjutin Tryout Kemarin'].map(chip => (
                <button key={chip} className="px-3 py-1.5 rounded-full glass border-white/10 text-[10px] uppercase font-semibold text-slate-400 hover:text-white transition-colors">
                  {chip}
                </button>
              ))}
           </div>
        </div>
      </main>
    </div>
  );
}
