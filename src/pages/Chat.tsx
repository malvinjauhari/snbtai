import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Send,
  Plus,
  MessageSquare,
  Camera,
  Sparkles,
  ChevronRight,
  Settings,
  BrainCircuit,
  Binary,
  BookOpenCheck,
  FileText,
  Languages,
  PenTool,
  Loader2,
  User as UserIcon,
  Trash2,
  Play as LucidePlay,
  Library,
  Link2,
  Youtube,
  CheckCircle2,
  Mic,
  MicOff,
  X,
  Zap,
  Timer,
  Info,
  BookOpen,
} from "lucide-react";
import {
  chatWithAI,
  generateQuestion,
  generateQuestionFromImage,
  analyzeMaterial,
  socraticNovaChat,
  saveSubtestSession,
  deleteChat,
  generateRoadmapDraft,
} from "@/src/services/ai";
import { cn } from "@/src/lib/utils";
import { db, auth } from "@/src/services/firebase";
import { ImageUploader } from "@/src/components/common/ImageUploader";
import {
  processMultipleFiles,
  FileData,
} from "@/src/utils/multi-source-processor";
import "katex/dist/katex.min.css";
import { renderMath } from "@/src/utils/textParser";
import { useNotification } from "@/src/context/NotificationContext";
import { useNavBlock } from "@/src/context/NavBlockContext";
import { useCreditBalance } from "@/src/hooks/useCreditBalance";
import { AIActivityIndicator } from "@/src/components/chat/AIActivityIndicator";
import ConfirmModal from "@/src/components/shared/ConfirmModal";
import { CreditCostPreview } from "@/src/components/credits/CreditCostPreview";
import {
  gatherStudiPathContext,
  generateStudiPathPlan,
} from "@/src/services/aiStudiPath";
import {
  saveStudiPathAndTasks,
  StudiPath,
  StudiPathTask,
} from "@/src/services/studipath";
import { Compass } from "lucide-react";
import {
  collection,
  addDoc,
  updateDoc,
  serverTimestamp,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  setDoc,
  deleteDoc,
  limit,
  writeBatch,
  getDocs,
} from "firebase/firestore";

interface Message {
  id: string;
  type: "user" | "ai";
  text: string;
  isQuestion?: boolean;
  action?: {
    label: string;
    onClick?: () => void;
    link?: string;
  };
}

interface NovaMetadata {
  subject: string;
  subtopic: string;
  difficulty: number;
  summary: string;
  internalSolution: string;
  firstQuestion: string;
  isLearningMode: boolean;
}

export default function Chat() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showNotification } = useNotification();
  const [chatId, setChatId] = useState<string | null>(null);
  const chatIdRef = useRef<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  // Create refs to track if we've initialized special flows to avoid duplicate invocations in StrictMode
  const hasInitializedStudiPath = useRef(false);

  useEffect(() => {
    // Lock AppLayout scroll on desktop so we only have one scrollbar in chat
    document.body.classList.add("chat-desktop-lock");
    return () => {
      document.body.classList.remove("chat-desktop-lock");
    };
  }, []);

  // Initialize with greeting
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const flow = searchParams.get("flow");

    if (flow === "studipath" && !hasInitializedStudiPath.current) {
      hasInitializedStudiPath.current = true;
      setCurrentFlow("STUDIPATH_GATHERING");
      setMessages([
        {
          id: Date.now().toString(),
          type: "ai",
          text: "Halo! Aku akan bantu bikin Study Path untuk persiapan SNBT 2026. Ceritakan kondisi belajarmu: bagian yang paling lemah, bagian yang cukup kuat, targetmu, durasi persiapan, dan berapa menit atau jam kamu bisa belajar per hari.",
        },
      ]);
      return;
    }

    const user = auth.currentUser;
    const name = user?.displayName?.split(" ")[0] || "pejuang";
    if (!hasInitializedStudiPath.current) {
      setMessages([
        {
          id: "welcome",
          type: "ai",
          text: `Halo ${name}! Ada yang bikin lu pusing hari ini? Curhatin aja di sini, atau paste materi yang bikin lu stuck. Biar gw ubah jadi simulasi SNBT.`,
        },
      ]);
    }
  }, [location.search]);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { setIsProcessing } = useNavBlock();

  const [isOcrLoading, setIsOcrLoading] = useState(false);
  const [currentFlow, setCurrentFlow] = useState<
    | "AWAITING_MATERIAL"
    | "SUBTEST_SELECTION"
    | "CONFIG_SELECTION"
    | "GENERATING"
    | "READY"
    | "PLAYLIST_INIT"
    | "PLAYLIST_WAITING_TITLE"
    | "PLAYLIST_WAITING_SUBTEST"
    | "PLAYLIST_COLLECTING_LINKS"
    | "PLAYLIST_PROCESSING"
    | "PLAYLIST_PREVIEW"
    | "LENS_ANALYZED"
    | "STUDIPATH_GATHERING"
    | "STUDIPATH_PREVIEW"
    | "STUDIPATH_SUCCESS"
  >("AWAITING_MATERIAL");
  const [previewContext, setPreviewContext] = useState<any>(null);
  const [sessionParams, setSessionParams] = useState({
    subtest: "",
    level: 3,
    mode: "latihan",
  });
  const [material, setMaterial] = useState("");
  const [isMaterialFromLens, setIsMaterialFromLens] = useState(false);
  const [generatedSessionId, setGeneratedSessionId] = useState<string | null>(
    null,
  );

  // Nova Learning Metadata
  const [novaMetadata, setNovaMetadata] = useState<NovaMetadata | null>(null);

  // Speech Recognition State
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // AI Lens State
  const [aiLensModalOpen, setAiLensModalOpen] = useState(false);
  const [lensFiles, setLensFiles] = useState<FileData[] | null>(null);
  const [isLensGenerating, setIsLensGenerating] = useState(false);

  useEffect(() => {
    const hasInput = input.trim().length > 0;
    const isFlowActive =
      currentFlow !== "AWAITING_MATERIAL" && currentFlow !== "READY";
    const isWorking = isGenerating || isLensGenerating || isOcrLoading;
    setIsProcessing(hasInput || isFlowActive || isWorking);
  }, [
    input,
    currentFlow,
    isGenerating,
    isLensGenerating,
    isOcrLoading,
    setIsProcessing,
  ]);

  // Playlist Builder State
  const [playlistDraft, setPlaylistDraft] = useState<{
    title: string;
    slug: string;
    category: string;
    videos: { youtubeUrl: string; title: string; videoId: string }[];
  } | null>(null);
  const [playlistTempData, setPlaylistTempData] = useState({
    title: "",
    subtest: "",
    slug: "",
    links: [] as string[],
  });

  // Modals state
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(
    null,
  );
  const [showQuotaModal, setShowQuotaModal] = useState(false);

  // Vocab State
  const [vocabModalOpen, setVocabModalOpen] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [meaning, setMeaning] = useState("");

  const [isModeMenuOpen, setIsModeMenuOpen] = useState(false);
  const { balance } = useCreditBalance();

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // We now rely entirely on NavBlockContext for navigation blocking.
  // setIsProcessing is synced via the useEffect above.

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const scHeight = textarea.scrollHeight;
      // Limit to ~6 lines (roughly 180-200px)
      const maxHeight = 192;
      textarea.style.height = `${Math.min(scHeight, maxHeight)}px`;

      // Toggle scrollbar visibility
      if (scHeight > maxHeight) {
        textarea.style.overflowY = "auto";
      } else {
        textarea.style.overflowY = "hidden";
      }
    }
  }, [input]);

  // Sync ref with state
  useEffect(() => {
    chatIdRef.current = chatId;
  }, [chatId]);

  // Fetch History
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "chats"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chats = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHistory(chats);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isGenerating]);

  const saveChatToFirebase = async (updatedMessages: any[]) => {
    const user = auth.currentUser;
    if (!user) return null;

    const formattedMessages = updatedMessages
      .filter((m) => m.id !== "welcome")
      .map((m) => ({
        role: m.type,
        content: m.text,
      }));

    try {
      const currentChatId = chatIdRef.current;
      if (!currentChatId) {
        // New Chat
        const firstUserMsg = updatedMessages.find((m) => m.type === "user");
        const title = firstUserMsg
          ? firstUserMsg.text.substring(0, 30)
          : "New Conversation";

        const docRef = await addDoc(collection(db, "chats"), {
          userId: user.uid,
          title,
          messages: formattedMessages,
          createdAt: serverTimestamp(),
        });
        setChatId(docRef.id);
        chatIdRef.current = docRef.id;
        return docRef.id;
      } else {
        // Update Existing
        const chatDocRef = doc(db, "chats", currentChatId);
        await setDoc(
          chatDocRef,
          {
            messages: formattedMessages,
          },
          { merge: true },
        );
        return currentChatId;
      }
    } catch (error) {
      console.error("Error saving chat:", error);
      return null;
    }
  };

  const handleSend = async (overrideInput?: string) => {
    const textToSend = overrideInput || input;
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      type: "user",
      text: textToSend,
    };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    const currentInput = textToSend;
    if (!overrideInput) setInput("");

    // Handle Lens Analysis Response
    if (currentFlow === "LENS_ANALYZED") {
      const lowerInput = currentInput.toLowerCase();

      // Intent: Belajar / Step-by-Step
      if (
        lowerInput.includes("belajar") ||
        lowerInput.includes("ajarin") ||
        lowerInput.includes("bimbing") ||
        lowerInput.includes("step")
      ) {
        if (!novaMetadata) return;

        setNovaMetadata((prev) =>
          prev ? { ...prev, isLearningMode: true } : null,
        );

        setIsGenerating(true);
        setTimeout(() => {
          const aiMsg: Message = {
            id: (Date.now() + 1).toString(),
            type: "ai",
            text: `Oke, Nova siap bimbing pejuang! Kita mulai ya...\n\n${novaMetadata.firstQuestion}`,
          };
          setMessages((prev) => [...prev, aiMsg]);
          setIsGenerating(false);
          saveChatToFirebase([...newMessages, aiMsg]);
        }, 800);
        return;
      }

      // Intent: Soal Serupa / Challenge
      if (
        lowerInput.includes("soal") ||
        lowerInput.includes("serupa") ||
        lowerInput.includes("challenge") ||
        lowerInput.includes("mirip")
      ) {
        setSessionParams((prev) => ({
          ...prev,
          subtest: novaMetadata?.subject || "",
        }));
        setCurrentFlow("CONFIG_SELECTION");

        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          text: `Siap! Gue bakal bikin simulasi soal yang polanya mirip banget sama screenshot lu. \n\nMau tingkat kesulitan level berapa (1-5)? Defaultnya Level 3.`,
        };
        setMessages((prev) => [...prev, aiMsg]);
        saveChatToFirebase([...newMessages, aiMsg]);
        return;
      }

      // Intent: Udah Cukup / Quit Lens flow
      if (
        lowerInput.includes("cukup") ||
        lowerInput.includes("beres") ||
        lowerInput.includes("selesai")
      ) {
        setCurrentFlow("AWAITING_MATERIAL");
        setNovaMetadata(null);
        setIsMaterialFromLens(false);
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          text: `Sip! Kalo butuh bantuan bedah materi lagi, tinggal pencet ikon Kamera ya. Ada lagi yang mau lu curhatin?`,
        };
        setMessages((prev) => [...prev, aiMsg]);
        saveChatToFirebase([...newMessages, aiMsg]);
        return;
      }
    }

    // Handle Socratic Learning Flow
    if (novaMetadata?.isLearningMode) {
      const lowerInput = currentInput.toLowerCase();

      // Exit learning mode intent
      if (
        lowerInput.includes("berhenti") ||
        lowerInput.includes("stop belajar") ||
        lowerInput.includes("cukup")
      ) {
        setNovaMetadata((prev) =>
          prev ? { ...prev, isLearningMode: false } : null,
        );
        setCurrentFlow("AWAITING_MATERIAL");
        const aiMsg: Message = {
          id: Date.now().toString(),
          type: "ai",
          text: "Sip, belajarnya kita stop dulu ya. Ada lagi yang mau dibantu?",
        };
        setMessages((prev) => [...prev, aiMsg]);
        return;
      }

      setIsGenerating(true);
      try {
        const response = await socraticNovaChat(currentInput, messages, {
          originalText: material,
          internalSolution: novaMetadata.internalSolution,
          subject: novaMetadata.subject,
        });

        const aiMsg: Message = {
          id: Date.now().toString(),
          type: "ai",
          text: response,
        };
        setMessages((prev) => [...prev, aiMsg]);
        saveChatToFirebase([...newMessages, aiMsg]);
      } catch (err) {
        console.error(err);
        showNotification("Gagal ngobrol sama Nova", "error");
      } finally {
        setIsGenerating(false);
      }
      return;
    }
    if (currentFlow === "PLAYLIST_WAITING_TITLE") {
      const title = currentInput.substring(0, 50);
      setPlaylistTempData((prev) => ({ ...prev, title }));

      setIsGenerating(true);
      setTimeout(() => {
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          text: `Sip, judulnya "${title}". 🔥\n\nSekarang sebutin subtesnya dong (misal: Penalaran Matematika atau Literasi Inggris).`,
        };
        setMessages((prev) => [...prev, aiMsg]);
        setCurrentFlow("PLAYLIST_WAITING_SUBTEST");
        setIsGenerating(false);
      }, 800);
      return;
    }

    if (currentFlow === "PLAYLIST_WAITING_SUBTEST") {
      const subtest = currentInput;
      const cleanInput = playlistTempData.title
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, " ")
        .trim();
      const generatedSlug = cleanInput
        .split(" ")
        .filter(Boolean)
        .slice(0, 5)
        .join("-");

      setPlaylistTempData((prev) => ({
        ...prev,
        subtest: subtest,
        slug: generatedSlug || `roadmap-${Date.now().toString().slice(-4)}`,
      }));

      setIsGenerating(true);
      setTimeout(() => {
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          text: `Nangkep! Subtes: "${subtest}".\n\nLink playlist otomatis: snbtai.com/playlist/${generatedSlug || `roadmap-${Date.now().toString().slice(-4)}`}\n\nSekarang gas kirim link YouTube-nya satu per satu. Ketik "udah" kalo udah beres semua.`,
        };
        setMessages((prev) => [...prev, aiMsg]);
        setCurrentFlow("PLAYLIST_COLLECTING_LINKS");
        setIsGenerating(false);
      }, 800);
      return;
    }

    if (currentFlow === "PLAYLIST_COLLECTING_LINKS") {
      if (currentInput.toLowerCase() === "udah") {
        if (playlistTempData.links.length === 0) {
          const aiMsg: Message = {
            id: (Date.now() + 1).toString(),
            type: "ai",
            text: `Minimal masukin satu link dulu dong pejuang! Biar ada isi playlist-nya.`,
          };
          setMessages((prev) => [...prev, aiMsg]);
          return;
        }

        handleStartSynthesis();
        return;
      }

      // Check if it's a youtube link
      const youtubeRegex =
        /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
      if (youtubeRegex.test(currentInput)) {
        setPlaylistTempData((prev) => ({
          ...prev,
          links: [...prev.links, currentInput],
        }));
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          text: `Video ke-${playlistTempData.links.length + 1} masuk! ✅ Ada lagi? Atau ketik "udah" kalau beres.`,
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          text: `Linknya kayaknya salah deh. Pastiin itu link YouTube ya pejuang!`,
        };
        setMessages((prev) => [...prev, aiMsg]);
      }
      return;
    }

    if (currentFlow === "STUDIPATH_GATHERING") {
      setIsGenerating(true);
      try {
        const formattedHistory = newMessages.map((m) => ({
          role: m.type === "user" ? "user" : "model",
          parts: [{ text: m.text }],
        }));

        const res = await gatherStudiPathContext(
          currentInput,
          formattedHistory,
        );
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          text: res.aiResponse,
        };
        setMessages((prev) => [...prev, aiMsg]);
        await saveChatToFirebase([...newMessages, aiMsg]);

        if (res.isContextComplete && res.extractedContext) {
          setPreviewContext(res.extractedContext);
          setCurrentFlow("STUDIPATH_PREVIEW");
        }
      } catch (err) {
        showNotification("Gagal memproses pesan StudiPath.", "error");
      } finally {
        setIsGenerating(false);
      }
      return;
    }

    if (currentFlow === "AWAITING_MATERIAL") {
      setMaterial(currentInput);
      setIsGenerating(true);
      try {
        await saveChatToFirebase(newMessages);
        const aiResponse = await chatWithAI(currentInput, newMessages);
        const nextPrompt = `${aiResponse}\n\nMenarik. Gw bisa bantu lu paham materi ini pake gaya soal yang seru. Kita mau hajar subtest mana?`;
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          text: nextPrompt,
        };
        const updatedMsgs = [...newMessages, aiMsg];
        setMessages(updatedMsgs);
        setCurrentFlow("SUBTEST_SELECTION");
        await saveChatToFirebase(updatedMsgs);
      } catch (error: any) {
        console.error(error);
        if (error.message === "QUOTA_EXCEEDED") {
          setShowQuotaModal(true);
        } else {
          showNotification(
            "Aduh, ada error pas ngobrol ama AI. Coba lagi ya!",
            "error",
          );
        }
      } finally {
        setIsGenerating(false);
      }
    } else {
      // Normal chat if not in a specific creation flow
      setIsGenerating(true);
      try {
        await saveChatToFirebase(newMessages);
        const aiResponse = await chatWithAI(currentInput, newMessages);
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          text: aiResponse,
        };
        const finalMessages = [...newMessages, aiMsg];
        setMessages(finalMessages);
        await saveChatToFirebase(finalMessages);
      } catch (error: any) {
        console.error(error);
        if (error.message === "QUOTA_EXCEEDED") {
          setShowQuotaModal(true);
        } else {
          showNotification("Koneksi AI lagi gak stabil nih.", "error");
        }
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const handleLensGenerate = async () => {
    if (!lensFiles || lensFiles.length === 0) return;
    setIsLensGenerating(true);
    setAiLensModalOpen(false);

    setIsOcrLoading(true);
    const loadingMsg: Message = {
      id: "lens-" + Date.now().toString(),
      type: "user",
      text: `[Memproses ${lensFiles.length} gambar untuk AI Lens...]`,
    };
    setMessages((prev) => [...prev, loadingMsg]);

    try {
      const combinedText = await processMultipleFiles(lensFiles);
      setMaterial(combinedText);
      setIsMaterialFromLens(true);

      // Analyze with Nova
      const analysis = await analyzeMaterial(combinedText);
      if (analysis) {
        setNovaMetadata({
          ...analysis,
          isLearningMode: false,
        });

        setCurrentFlow("LENS_ANALYZED");

        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          text: `Gue lihat ini soal tentang ${analysis.subject} (Materi: ${analysis.subtopic}).\n\n${analysis.summary}\n\nMau gue bantu pelajari step-by-step biar makin paham polanya, atau langsung gas bikin simulasi soal serupa?`,
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        // Fallback to old flow if analysis fails
        setCurrentFlow("SUBTEST_SELECTION");
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          text: `Keren! 🚀 Gw udah baca gambarnya. Mau dijadiin simulasi subtest apa nih?`,
        };
        setMessages((prev) => [...prev, aiMsg]);
      }
    } catch (e) {
      console.error(e);
      showNotification("Gagal memproses gambar", "error");
    } finally {
      setIsOcrLoading(false);
      setIsLensGenerating(false);
      setLensFiles(null);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      showNotification(
        "Browser lu kaga support Speech Recognition nih pejuang. Pake Chrome atau Edge ya!",
        "error",
      );
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "id-ID";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
      showNotification("Microphone aktif! Ayo ngomong...", "success");
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      const totalTranscript = finalTranscript || interimTranscript;
      if (totalTranscript) {
        setInput((prev) => {
          // If we are listening, we want to append or replace the current session's text
          // For simplicity, we'll just set it to the recognized text if it's a new word,
          // but better UX is to keep existing text and append the new part.
          // However, continuous mode with interim results can be tricky with simple state.
          // Let's try appending if it's the start of a transcript session.
          return totalTranscript;
        });
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech Recognition Error:", event.error);
      setIsListening(false);
      if (event.error === "not-allowed") {
        showNotification(
          "Izin mic ditolak. Cek setting browser lu ya!",
          "error",
        );
      } else {
        showNotification("Speech error. Coba lagi pejuang!", "error");
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const handleStartSynthesis = async () => {
    setCurrentFlow("PLAYLIST_PROCESSING");
    setIsGenerating(true);

    const processingMsg: Message = {
      id: "processing-roadmap",
      type: "ai",
      text: "Sabar ya, AI lagi sedang memasak dan ngeracik playlist lo...",
    };
    setMessages((prev) => [...prev, processingMsg]);

    try {
      const draft = await generateRoadmapDraft(
        playlistTempData.title,
        playlistTempData.subtest || "SNBT",
        playlistTempData.links,
      );

      setPlaylistDraft({
        ...draft,
        slug: playlistTempData.slug,
      });
      setCurrentFlow("PLAYLIST_PREVIEW");
    } catch (error) {
      console.error("Synthesis error:", error);
      showNotification("Gagal ngeracik playlist. Coba lagi ya!", "error");
      setCurrentFlow("PLAYLIST_COLLECTING_LINKS");
    } finally {
      setIsGenerating(false);
    }
  };

  const startStudiPathFlow = () => {
    setCurrentFlow("STUDIPATH_GATHERING");
    setIsModeMenuOpen(false);
    const aiMsg: Message = {
      id: Date.now().toString(),
      type: "ai",
      text: "Halo! Aku akan bantu bikin Study Path untuk persiapan SNBT 2026. Ceritakan kondisi belajarmu: bagian yang paling lemah, bagian yang cukup kuat, targetmu, durasi persiapan, dan berapa menit atau jam kamu bisa belajar per hari.",
    };
    setMessages((prev) => [...prev, aiMsg]);
  };

  const handleGenerateStudiPath = async () => {
    if (!previewContext || !auth.currentUser) return;
    try {
      setIsGenerating(true);
      setCurrentFlow("STUDIPATH_GENERATING");

      const loadingMsg: Message = {
        id: "studipath-loading",
        type: "ai",
        text: "Sedang meracik Study Path spesial buat kamu... (Bisa butuh waktu 10-20 detik, sabar ya)",
      };
      setMessages((prev) => [...prev, loadingMsg]);

      // 5 credit deduction will be checked inside api endpoint if we use one,
      // but here we can just use the provided function in our codebase,
      // let's assume we can deduct later.
      const plan = await generateStudiPathPlan(previewContext);

      const tasksData =
        plan.dailyTasks?.map((t: any) => ({
          title: t.title,
          description: t.description,
          subject: t.subject,
          topic: t.topic,
          taskType: t.taskType,
          estimatedMinutes: t.estimatedMinutes,
          date: t.date,
          weekNumber: t.weekNumber,
          dayNumber: t.dayNumber,
          status: "todo",
          priority: "medium",
        })) || [];

      const pathData = {
        title: plan.title || "Study Path SNBT",
        targetExam: previewContext.targetExam || "SNBT",
        preparationDuration: previewContext.preparationDuration || "",
        dailyStudyTime: previewContext.dailyStudyTime || "",
        weakSubjects: previewContext.weakSubjects || [],
        strongSubjects: previewContext.strongSubjects || [],
        aiDiagnosis: plan.overallDiagnosis || "",
        strategySummary: plan.strategySummary || "",
        studyRatio: plan.recommendedStudyRatio || {},
        weeklyRoadmap: plan.weeklyRoadmap || [],
        dashboardSummary: {
          todayFocus: plan.dailyTasks?.[0]?.topic || "Pendalaman Materi",
          estimatedMinutes: plan.dailyTasks?.[0]?.estimatedMinutes || 60,
          message: "Siap mulai?",
        },
      };

      await saveStudiPathAndTasks(auth.currentUser.uid, pathData, tasksData);

      const resMsg: Message = {
        id: Date.now().toString(),
        type: "ai",
        text: "Study Path kamu berhasil dibuat! Cek sekarang aja.",
      };
      setMessages((prev) =>
        prev.filter((m) => m.id !== "studipath-loading").concat(resMsg),
      );
      setCurrentFlow("STUDIPATH_SUCCESS");

      // Deduct 5 credits remotely from the client (we're assuming no api call here, need to investigate how credits are deducted)
      // We will leave credit deducting out until we know how it works in the app. Let's see the useCreditBalance.
    } catch (error) {
      console.error(error);
      showNotification("Gagal melakukan generasi.", "error");
      setCurrentFlow("STUDIPATH_PREVIEW");
      setMessages((prev) => prev.filter((m) => m.id !== "studipath-loading"));
    } finally {
      setIsGenerating(false);
    }
  };

  const savePlaylistDraft = async () => {
    if (!playlistDraft) return;

    const user = auth.currentUser;
    if (!user) return;

    try {
      setIsGenerating(true);

      // Check slug conflict
      const slugQuery = query(
        collection(db, "playlists"),
        where("slug", "==", playlistDraft.slug),
      );
      const slugSnap = await getDocs(slugQuery);
      if (!slugSnap.empty) {
        showNotification(
          "Waduh, slug ini udah dipake orang lain. Ganti dulu di Editor ya!",
          "error",
        );
      }

      const playlistRef = await addDoc(collection(db, "playlists"), {
        title: playlistDraft.title,
        description: "Deskripsi masih kosong, silakan diedit kembali.",
        slug: playlistDraft.slug,
        category: playlistDraft.category,
        mode: "normal",
        isPublic: true,
        thumbnail:
          playlistDraft.videos.length > 0
            ? `https://img.youtube.com/vi/${playlistDraft.videos[0].videoId}/hqdefault.jpg`
            : "",
        creatorId: user.uid,
        creatorName: user.displayName || "Pejuang",
        videoCount: playlistDraft.videos.length,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      const batch = writeBatch(db);
      const itemsCollection = collection(
        db,
        "playlists",
        playlistRef.id,
        "items",
      );

      playlistDraft.videos.forEach((v, index) => {
        const itemRef = doc(itemsCollection);
        batch.set(itemRef, {
          youtubeUrl: v.youtubeUrl,
          videoId: v.videoId,
          title: v.title,
          category: playlistDraft.category,
          position: index,
          createdAt: serverTimestamp(),
        });
      });

      await batch.commit();

      showNotification("Playlist berhasil disimpan! 🚀", "success");
      navigate(`/playlist/edit/${playlistRef.id}`);
    } catch (error) {
      console.error("Save error:", error);
      showNotification("Gagal simpan playlist.", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const startPlaylistFlow = () => {
    const action = () => {
      setChatId(null);
      chatIdRef.current = null;
      setCurrentFlow("PLAYLIST_WAITING_TITLE");
      setPlaylistTempData({ title: "", subtest: "", slug: "", links: [] });
      setMessages([
        {
          id: "playlist-welcome",
          type: "ai",
          text: `Wih, mau rintis playlist belajar nih? Mantap! 🔥\n\nMau dikasih judul apa playlist-nya?`,
        },
      ]);
    };

    if (currentFlow !== "AWAITING_MATERIAL") {
      if (
        window.confirm(
          "Bikin playlist baru akan menghentikan sesi saat ini. Yakin?",
        )
      ) {
        action();
      }
    } else {
      action();
    }
  };

  const loadChat = (chat: any) => {
    setChatId(chat.id);
    chatIdRef.current = chat.id;
    const loadedMessages: Message[] = chat.messages.map(
      (m: any, i: number) => ({
        id: `m-${i}`,
        type: m.role as "user" | "ai",
        text: m.content,
      }),
    );
    setMessages(loadedMessages);
    setCurrentFlow("AWAITING_MATERIAL");
  };

  const handleDeleteChat = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirmDelete(id);
  };

  const confirmDeleteChat = async () => {
    if (!showConfirmDelete) return;
    try {
      await deleteChat(showConfirmDelete);
      if (chatId === showConfirmDelete) {
        setChatId(null);
        chatIdRef.current = null;
        setMessages([]);
      }
      showNotification("Conversation deleted", "success");
    } catch (error) {
      showNotification("Failed to delete chat", "error");
    } finally {
      setShowConfirmDelete(null);
    }
  };

  const [mobileSelectionVisible, setMobileSelectionVisible] = useState(false);

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();

      // Clear selection UI on mobile if collapsed
      if (window.innerWidth < 1024) {
        if (!selection || selection.isCollapsed || !text) {
          setMobileSelectionVisible(false);
          // if modal isn't open, we could also clear selectedText but let's just hide the bar
        }
      }
    };
    document.addEventListener("selectionchange", handleSelectionChange);
    return () =>
      document.removeEventListener("selectionchange", handleSelectionChange);
  }, []);

  const handleSelection = () => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();
    if (text && text.length > 1 && text.length < 100) {
      setSelectedText(text);

      if (window.innerWidth < 1024) {
        // Mobile/Tablet: Show floating action bar
        setMobileSelectionVisible(true);
      } else {
        // Desktop: Open modal instantly (preserves existing behavior)
        setVocabModalOpen(true);
      }
    }
  };

  const openVocabModalFromMobile = () => {
    setMobileSelectionVisible(false);
    setVocabModalOpen(true);
  };

  const saveVocab = async () => {
    const user = auth.currentUser;
    if (!user) return;
    if (!meaning.trim()) return;

    try {
      const vocabRef = doc(collection(db, `users/${user.uid}/vocabs`));
      await setDoc(vocabRef, {
        word: selectedText,
        meaning: meaning,
        subtest: "Chat",
        createdAt: serverTimestamp(),
      });
      showNotification(`Saved "${selectedText}"! 📚`, "success");
      setVocabModalOpen(false);
      setMeaning("");
      window.getSelection()?.removeAllRanges();
    } catch (error) {
      showNotification("Failed to save vocab.", "error");
      console.error(error);
    }
  };

  const handleSubtestSelect = (subId: string) => {
    setSessionParams((prev) => ({ ...prev, subtest: subId }));
    const selectionMsg: Message = {
      id: `sub-${Date.now()}`,
      type: "user",
      text:
        subId === "PK"
          ? "Pengetahuan Kuantitatif"
          : subId === "PM"
            ? "Penalaran Matematika"
            : subId === "PU"
              ? "Penalaran Umum"
              : subId === "PBM"
                ? "PBM"
                : subId === "LBI"
                  ? "Literasi Bahasa Indonesia"
                  : subId === "LBE"
                    ? "Literasi Bahasa Inggris"
                    : "PPU",
    };
    const newMessages = [...messages, selectionMsg];
    setMessages(newMessages);

    setTimeout(() => {
      const aiMsg: Message = {
        id: `ask-${Date.now()}`,
        type: "ai",
        text: "Sip. Terakhir, seberapa brutal lu mau dibantai, dan mau mode apa?",
      };
      const updatedMsgs = [...newMessages, aiMsg];
      setMessages(updatedMsgs);
      setCurrentFlow("CONFIG_SELECTION");
      saveChatToFirebase(updatedMsgs);
    }, 600);
  };

  const startGeneration = async () => {
    setCurrentFlow("GENERATING");
    const initMsg: Message = {
      id: "gen-init",
      type: "ai",
      text: "Bentar ya, gw lagi nyisir pola soal yang paling sering ngejebak anak-anak tahun lalu...",
    };
    const updatedMessages = [...messages, initMsg];
    setMessages(updatedMessages);

    try {
      // Simulate RAG moment
      await new Promise((r) => setTimeout(r, 2000));
      let questions;
      if (isMaterialFromLens) {
        questions = await generateQuestionFromImage(
          material,
          sessionParams.subtest,
          sessionParams.level,
          sessionParams.mode,
        );
      } else {
        questions = await generateQuestion(
          material,
          sessionParams.subtest,
          sessionParams.level,
          sessionParams.mode,
        );
      }

      const sessionId = await saveSubtestSession(
        sessionParams.subtest,
        sessionParams.level,
        questions,
        sessionParams.mode,
      );
      setGeneratedSessionId(sessionId);

      const resultMsg: Message = {
        id: "gen-result",
        type: "ai",
        text: `Got it. 5 Soal ${sessionParams.subtest}, Level ${sessionParams.level}, Mode ${sessionParams.mode}. Tarik napas.`,
      };
      const finalMessages = [...updatedMessages, resultMsg];
      setMessages(finalMessages);
      setCurrentFlow("READY");
      saveChatToFirebase(finalMessages);
    } catch (error: any) {
      console.error(error);
      if (error.message === "QUOTA_EXCEEDED") {
        setShowQuotaModal(true);
      } else if (error.message === "INSUFFICIENT_CREDITS") {
        showNotification("Kredit kamu tidak cukup untuk operasi ini.", "error");
      } else if (error.message === "DAILY_LIMIT_EXCEEDED") {
        showNotification(
          "Limit pemakaian dari kredit harian kamu sudah habis.",
          "error",
        );
      } else {
        showNotification("Gagal ngeracik soal. Coba lagi bentar ya!", "error");
      }
      setCurrentFlow("SUBTEST_SELECTION");
    }
  };

  const performNewChat = () => {
    const name = auth.currentUser?.displayName?.split(" ")[0] || "pejuang";
    setChatId(null);
    chatIdRef.current = null;
    setCurrentFlow("AWAITING_MATERIAL");
    setMaterial("");
    setGeneratedSessionId(null);
    setMessages([
      {
        id: "welcome",
        type: "ai",
        text: `Halo ${name}! Ada yang bikin lu pusing hari ini? Curhatin aja di sini, atau paste materi yang bikin lu stuck. Biar gw ubah jadi simulasi SNBT.`,
      },
    ]);
  };

  const handleNewChatClick = () => {
    if (currentFlow !== "AWAITING_MATERIAL") {
      if (
        window.confirm(
          "Bikin chat baru akan menghentikan sesi saat ini. Yakin?",
        )
      ) {
        performNewChat();
      }
    } else {
      performNewChat();
    }
  };

  const handleChatSwitch = (chat: any) => {
    const action = () => {
      loadChat(chat);
    };

    if (currentFlow !== "AWAITING_MATERIAL") {
      if (
        window.confirm("Pindah chat akan menghentikan sesi saat ini. Yakin?")
      ) {
        action();
      }
    } else {
      action();
    }
  };

  return (
    <div className="flex h-[calc(100vh-140px)] md:h-[calc(100vh-160px)] lg:h-[calc(100vh-64px)] lg:-mx-10 lg:-mt-10 lg:-mb-10 lg:rounded-none lg:border-x-0 lg:border-t-0 lg:border-b-0 overflow-hidden bg-white/40 dark:bg-slate-900/20 rounded-[2rem] border border-slate-200 dark:border-white/5 relative shadow-sm">
      {/* Sidebar - Balanced and Modern */}
      <aside className="hidden lg:flex flex-col w-80 bg-slate-50/40 dark:bg-slate-900/40 border-r border-slate-200 dark:border-white/5 backdrop-blur-xl shrink-0">
        <div className="p-6">
          <button
            onClick={handleNewChatClick}
            className="flex items-center justify-center gap-2 w-full py-4 bg-indigo-600 text-white rounded-[1.25rem] font-bold shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 hover:scale-[1.02] active:scale-95 transition-all mb-8 group"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            <span className="tracking-tight">Percakapan Baru</span>
          </button>

          <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4 ml-2">
            Sesi Terakhir
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto px-4 space-y-2 premium-scroll pb-6">
          {history.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs italic font-medium opacity-50">
              Belum ada riwayat. Mulai berjuang sekarang!
            </div>
          ) : (
            history.map((chat) => (
              <div key={chat.id} className="relative group/history">
                <button
                  onClick={() => handleChatSwitch(chat)}
                  className={cn(
                    "w-full text-left p-4 rounded-2xl transition-all text-sm truncate flex items-center gap-3 border border-transparent",
                    chatId === chat.id
                      ? "bg-white dark:bg-white/10 border-slate-200 dark:border-white/10 text-indigo-600 dark:text-white font-bold shadow-sm dark:shadow-lg"
                      : "text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5",
                  )}
                >
                  <MessageSquare
                    className={cn(
                      "w-4 h-4 shrink-0",
                      chatId === chat.id
                        ? "text-indigo-500 dark:text-indigo-400"
                        : "opacity-40",
                    )}
                  />
                  <span className="truncate flex-1 tracking-tight">
                    {chat.title}
                  </span>
                </button>
                <button
                  onClick={(e) => handleDeleteChat(e, chat.id)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-rose-500 opacity-0 group-hover/history:opacity-100 transition-all z-20 cursor-pointer"
                  title="Hapus Chat"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t border-slate-100 dark:border-white/5 bg-slate-50/40 dark:bg-slate-900/40">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center font-black text-white shadow-lg shadow-indigo-600/20">
              {auth.currentUser?.displayName?.[0] || "P"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {auth.currentUser?.displayName || "Pejuang"}
              </p>
              <p
                className={cn(
                  "text-[10px] uppercase tracking-widest font-black",
                  balance !== null && balance < 50
                    ? "text-amber-500 dark:text-amber-400"
                    : "text-slate-500",
                )}
              >
                {balance === null
                  ? "Loading Credits..."
                  : `Credits: ${balance.toLocaleString()}`}
              </p>
            </div>
            <Settings className="w-4 h-4 text-slate-400 hover:text-indigo-600 dark:hover:text-white cursor-pointer transition-colors" />
          </div>
        </div>
      </aside>

      {/* Main Container - Professional Centering */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50/20 dark:bg-slate-950/40">
        {/* Chat Stream */}
        <div
          ref={scrollRef}
          onMouseUp={handleSelection}
          className="flex-1 overflow-y-auto px-4 md:px-12 py-8 md:py-10 space-y-6 md:space-y-8 premium-scroll scroll-smooth selection:bg-indigo-500 selection:text-white font-sans"
        >
          {messages.map((msg) => {
            if (msg.id === "welcome" || msg.id === "playlist-welcome") {
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, scale: 0.95, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto py-16 md:py-24 px-4"
                >
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 border border-indigo-100 dark:border-indigo-500/20 shadow-sm transition-transform hover:scale-105">
                    <Sparkles className="w-6 h-6 md:w-7 md:h-7 text-indigo-600 dark:text-indigo-400" />
                  </div>

                  {msg.id === "welcome" ? (
                    <>
                      <h2 className="text-2xl md:text-3xl font-medium text-slate-800 dark:text-slate-100 tracking-tight mb-4 leading-tight">
                        Halo{" "}
                        {auth.currentUser?.displayName?.split(" ")[0] ||
                          "Pejuang"}
                        !
                      </h2>
                      <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
                        Ada yang bikin pusing hari ini? Curhatin aja di sini,
                        atau paste materi yang bikin stuck. Biar diubah jadi
                        simulasi SNBT.
                      </p>
                    </>
                  ) : (
                    <div className="text-lg md:text-xl font-medium text-slate-800 dark:text-slate-100 tracking-tight leading-relaxed max-w-lg mx-auto">
                      {renderMath(msg.text)}
                    </div>
                  )}

                  {msg.action && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="mt-8"
                    >
                      <button
                        onClick={() => {
                          if (msg.action?.onClick) msg.action.onClick();
                          else if (msg.action?.link) navigate(msg.action.link);
                        }}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 md:px-8 md:py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-indigo-600/20 active:scale-95"
                      >
                        <LucidePlay className="w-4 h-4 fill-current" />
                        {msg.action.label}
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              );
            }

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex w-full max-w-5xl mx-auto",
                  msg.type === "user" ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[100%] md:max-w-[85%] p-4 md:p-5 rounded-[1.25rem] md:rounded-[1.75rem] relative group",
                    msg.type === "user"
                      ? "bg-indigo-600 text-white font-medium rounded-br-sm shadow-md shadow-indigo-600/10 text-sm md:text-base leading-relaxed tracking-tight"
                      : "bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 rounded-bl-sm pr-8 md:pr-10 shadow-sm text-sm md:text-base leading-relaxed tracking-tight",
                  )}
                >
                  <div className="">{renderMath(msg.text)}</div>

                  {msg.action && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6"
                    >
                      <button
                        onClick={() => {
                          if (msg.action?.onClick) msg.action.onClick();
                          else if (msg.action?.link) navigate(msg.action.link);
                        }}
                        className="w-full py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-xl flex items-center justify-center gap-2 text-sm uppercase tracking-wide"
                      >
                        <LucidePlay className="w-4 h-4 fill-current" />
                        {msg.action.label}
                      </button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}

          {/* Inline Interactive Flow Components */}
          <AnimatePresence>
            {currentFlow === "STUDIPATH_PREVIEW" && previewContext && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-[85%] md:max-w-xl premium-card p-8 rounded-[2rem] shadow-xl space-y-6"
              >
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-[0.2em] text-[10px]">
                  <Compass className="w-4 h-4" /> Pratinjau Study Path
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    Review Konteks Belajar
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/10">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">
                        Target Ujian
                      </p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {previewContext.targetExam || "-"}
                      </p>
                    </div>
                    <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/10">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">
                        Durasi Persiapan
                      </p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {previewContext.preparationDuration || "-"}
                      </p>
                    </div>
                    <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/10">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">
                        Waktu Harian
                      </p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {previewContext.dailyStudyTime || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">
                        Mata Pelajaran Lemah
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {previewContext.weakSubjects?.map((s: string) => (
                          <span
                            key={s}
                            className="bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-500/20 px-2.5 py-1 rounded-full text-xs font-semibold"
                          >
                            {s}
                          </span>
                        )) || <span className="text-slate-400 text-xs">-</span>}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">
                        Mata Pelajaran Kuat
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {previewContext.strongSubjects?.map((s: string) => (
                          <span
                            key={s}
                            className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20 px-2.5 py-1 rounded-full text-xs font-semibold"
                          >
                            {s}
                          </span>
                        )) || <span className="text-slate-400 text-xs">-</span>}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-500/30 flex justify-between items-center">
                  <div>
                    <p className="text-xs font-bold text-slate-500">
                      Biaya Generate
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Zap className="w-4 h-4 text-amber-500" />
                      <span className="font-black text-indigo-900 dark:text-indigo-100">
                        5 Kredit
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">
                      Saldo Kamu
                    </p>
                    <p className="text-sm font-black text-slate-900 dark:text-white">
                      {balance || 0} Kredit
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100 dark:border-white/10">
                  <button
                    onClick={() => setCurrentFlow("STUDIPATH_GATHERING")}
                    className="flex-1 py-3.5 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                  >
                    Edit Konteks
                  </button>
                  <button
                    onClick={handleGenerateStudiPath}
                    disabled={isGenerating || (balance || 0) < 5}
                    className="flex-[2] py-3.5 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 group"
                  >
                    Generate Study Path - 5 Kredit
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            )}

            {currentFlow === "STUDIPATH_SUCCESS" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-sm mt-4"
              >
                <button
                  onClick={() => navigate("/dashboard/studipath")}
                  className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-500 transition-all shadow-xl flex items-center justify-center gap-2 group"
                >
                  <Compass className="w-4 h-4" />
                  Lihat Study Path Saya
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            )}

            {currentFlow === "PLAYLIST_PREVIEW" && playlistDraft && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-[85%] md:max-w-2xl premium-card p-8 rounded-[2.5rem] shadow-2xl space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-[0.2em] text-[10px]">
                    <Library className="w-4 h-4" /> Pratinjau Playlist
                  </div>
                  <span className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                    {playlistDraft.category}
                  </span>
                </div>

                <div className="space-y-4">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                    {playlistDraft.title}
                  </h3>
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                    <Link2 className="w-4 h-4" />
                    <span>snbtai.com/playlist/{playlistDraft.slug}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">
                    Daftar Video ({playlistDraft.videos.length})
                  </p>
                  <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                    {playlistDraft.videos.map((v, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 bg-slate-50 dark:bg-white/5 p-3 rounded-xl border border-slate-100 dark:border-white/5 hover:border-indigo-500/20 transition-all"
                      >
                        <div className="w-20 aspect-video rounded-lg overflow-hidden shrink-0">
                          <img
                            src={`https://img.youtube.com/vi/${v.videoId}/mqdefault.jpg`}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-800 dark:text-white truncate">
                            {v.title}
                          </p>
                          <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
                            <Youtube className="w-3 h-3" />
                            Video YouTube
                          </div>
                        </div>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={savePlaylistDraft}
                  disabled={isGenerating}
                  className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-500 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/20 uppercase tracking-wider text-sm disabled:opacity-50"
                >
                  {isGenerating ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Sparkles className="w-5 h-5" />
                  )}
                  Simpan ke Playlist
                </button>
              </motion.div>
            )}

            {currentFlow === "SUBTEST_SELECTION" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-[85%] md:max-w-[70%] glass-panel p-8 rounded-[2rem] shadow-xl dark:shadow-2xl space-y-6"
              >
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-[0.2em] text-[10px]">
                  <Sparkles className="w-4 h-4" /> Pilih Medan Tempur
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { id: "PK", icon: Binary, name: "PK" },
                    { id: "PM", icon: PenTool, name: "PM" },
                    { id: "PU", icon: BrainCircuit, name: "PU" },
                    { id: "PBM", icon: BookOpenCheck, name: "PBM" },
                    { id: "LBI", icon: Languages, name: "Indo" },
                    { id: "LBE", icon: Languages, name: "English" },
                    { id: "PPU", icon: FileText, name: "PPU" },
                  ].map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => handleSubtestSelect(sub.id)}
                      className="flex flex-col items-center gap-2 p-5 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl hover:border-indigo-500 hover:bg-indigo-500/10 transition-all text-center group"
                    >
                      <sub.icon className="w-6 h-6 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white">
                        {sub.id}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {currentFlow === "CONFIG_SELECTION" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-[85%] md:max-w-[70%] premium-card p-8 rounded-[2rem] space-y-8"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      Level Brutalitas
                    </span>
                    <span
                      className={cn(
                        "text-xl font-black",
                        sessionParams.level <= 2
                          ? "text-emerald-500"
                          : sessionParams.level <= 4
                            ? "text-indigo-600 dark:text-indigo-400"
                            : "text-rose-500",
                      )}
                    >
                      Lv. {sessionParams.level}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={sessionParams.level}
                    onChange={(e) =>
                      setSessionParams({
                        ...sessionParams,
                        level: parseInt(e.target.value),
                      })
                    }
                    className="w-full h-2 bg-slate-100 dark:bg-white/5 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400 dark:text-slate-600 font-black uppercase tracking-widest">
                    <span>Warm-up</span>
                    <span>HOTS / Hell</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex gap-4">
                    <button
                      onClick={() =>
                        setSessionParams({ ...sessionParams, mode: "latihan" })
                      }
                      className={cn(
                        "flex-1 p-5 rounded-2xl border-2 text-xs font-black uppercase tracking-widest transition-all",
                        sessionParams.mode === "latihan"
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-600/20"
                          : "border-slate-100 dark:border-white/5 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-slate-300",
                      )}
                    >
                      Mode Latihan
                    </button>
                    <button
                      onClick={() =>
                        setSessionParams({ ...sessionParams, mode: "simulasi" })
                      }
                      className={cn(
                        "flex-1 p-5 rounded-2xl border-2 text-xs font-black uppercase tracking-widest transition-all relative overflow-hidden",
                        sessionParams.mode === "simulasi"
                          ? "bg-indigo-950 border-indigo-500 text-indigo-400 shadow-xl shadow-indigo-500/20"
                          : "border-slate-100 dark:border-white/5 text-slate-400 dark:text-slate-500 hover:text-indigo-500 dark:hover:text-slate-300",
                      )}
                    >
                      {sessionParams.mode === "simulasi" && (
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(99,102,241,0.1)_50%,transparent_75%)] bg-[length:250%_250%] animate-shimmer" />
                      )}
                      <span className="relative z-10 flex items-center justify-center gap-1.5">
                        <Timer className="w-3.5 h-3.5" /> Simulasi SNBT
                      </span>
                    </button>
                  </div>
                  {sessionParams.mode === "simulasi" && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="text-[10px] sm:text-xs text-indigo-500 font-bold bg-indigo-50 dark:bg-indigo-500/10 p-3 rounded-xl border border-indigo-100 dark:border-indigo-500/20 mt-1 flex items-start gap-2"
                    >
                      <Info className="w-4 h-4 shrink-0 mt-0.5" />
                      Timer 5 Menit diaktifkan. Model soal akan sangat
                      bervariasi mengikuti format asli UTBK.
                    </motion.p>
                  )}
                </div>

                <CreditCostPreview
                  featureName="Generate Soal Latihan"
                  cost={2}
                  onConfirm={startGeneration}
                  isLoading={isGenerating}
                />
              </motion.div>
            )}

            {currentFlow === "READY" && generatedSessionId && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 max-w-sm"
              >
                <button
                  onClick={() => navigate(`/question/${generatedSessionId}`)}
                  className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-500 transition-all shadow-2xl flex items-center justify-center gap-3 group px-8"
                >
                  Mulai Uji Nyali 🚀
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="w-full flex justify-start">
            <AIActivityIndicator
              isGenerating={isGenerating || isLensGenerating}
            />
          </div>
        </div>

        {/* Improved Input Area - Cleaner, Centered */}
        <div className="p-6 md:p-10 lg:p-12 hover:bg-gradient-to-t bg-gradient-to-t from-white dark:from-slate-950/80 via-white/50 dark:via-slate-950/40 to-transparent">
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex flex-wrap gap-2 justify-center mb-2 px-2 relative">
              {/* Response Chips (Quick Actions) */}
              {(novaMetadata?.isLearningMode
                ? [
                    { label: "Lanjut", icon: ChevronRight },
                    { label: "Gue Paham", icon: CheckCircle2 },
                    { label: "Soal Serupa", icon: Sparkles },
                  ]
                : currentFlow === "LENS_ANALYZED"
                  ? [
                      { label: "Bantu Gue Belajar", icon: BrainCircuit },
                      { label: "Gas Soal Serupa", icon: Sparkles },
                      { label: "Udah Cukup", icon: CheckCircle2 },
                    ]
                  : []
              ).map((chip) => (
                <button
                  key={chip.label}
                  onClick={() => handleSend(chip.label)}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 dark:hover:text-white hover:border-indigo-500/30 dark:hover:border-white/20 transition-all group shadow-sm"
                >
                  <chip.icon className="w-3 h-3 group-hover:animate-pulse" />
                  {chip.label}
                </button>
              ))}
            </div>

            <div className="relative group flex items-end gap-2 premium-card rounded-[2rem] p-2 md:p-2.5 transition-all focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/20">
              {/* Minimalist Tool Trigger (Mode Popover) */}
              {!novaMetadata?.isLearningMode &&
                currentFlow !== "LENS_ANALYZED" && (
                  <div className="relative z-30 shrink-0 self-end mb-1 md:mb-1.5 ml-1">
                    <div className="relative">
                      <AnimatePresence>
                        {isModeMenuOpen && (
                          <>
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              onClick={() => setIsModeMenuOpen(false)}
                              className="fixed inset-0 z-40"
                            />
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.95 }}
                              className="absolute bottom-full mb-4 left-0 w-56 bg-zinc-900/90 dark:bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 rounded-2xl p-2 shadow-2xl z-50 overflow-hidden"
                            >
                              <div className="space-y-1">
                                <button
                                  onClick={() => {
                                    startPlaylistFlow();
                                    setIsModeMenuOpen(false);
                                  }}
                                  className="flex items-center gap-3 w-full p-3 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-all group"
                                >
                                  <Library className="w-4 h-4 group-hover:text-indigo-400 transition-colors" />
                                  <span className="text-xs font-bold tracking-tight">
                                    Bikin Playlist
                                  </span>
                                </button>
                                <button
                                  onClick={() => {
                                    setAiLensModalOpen(true);
                                    setIsModeMenuOpen(false);
                                  }}
                                  className="flex items-center gap-3 w-full p-3 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-all group"
                                >
                                  <Camera className="w-4 h-4 group-hover:text-indigo-400 transition-colors" />
                                  <span className="text-xs font-bold tracking-tight">
                                    Bantu Belajar
                                  </span>
                                </button>
                                <button
                                  onClick={() => {
                                    startStudiPathFlow();
                                    setIsModeMenuOpen(false);
                                  }}
                                  className="flex items-center gap-3 w-full p-3 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-all group"
                                >
                                  <Compass className="w-4 h-4 group-hover:text-indigo-400 transition-colors" />
                                  <span className="text-xs font-bold tracking-tight">
                                    Bikin Rencana Belajar
                                  </span>
                                </button>
                              </div>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>

                      <button
                        onClick={() => setIsModeMenuOpen(!isModeMenuOpen)}
                        className={cn(
                          "p-2.5 rounded-full transition-all shrink-0",
                          isModeMenuOpen
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-indigo-600 dark:hover:text-white",
                        )}
                        aria-label="More options"
                      >
                        <Plus
                          className={cn(
                            "w-5 h-5 transition-transform duration-300",
                            isModeMenuOpen && "rotate-45",
                          )}
                        />
                      </button>
                    </div>
                  </div>
                )}

              <textarea
                ref={textareaRef}
                rows={1}
                placeholder={
                  isOcrLoading
                    ? "Sedang memproses gambar..."
                    : "Ketik pesan atau paste materi... (Shift+Enter)"
                }
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                className={cn(
                  "w-full bg-transparent border-none text-slate-900 dark:text-white px-2 py-3.5",
                  novaMetadata?.isLearningMode ||
                    currentFlow === "LENS_ANALYZED"
                    ? "pl-4"
                    : "",
                  "focus:outline-none",
                  "transition-all duration-200 ease-out text-sm md:text-base self-center",
                  "placeholder:text-slate-400 dark:placeholder:text-slate-500 min-h-[52px] max-h-32 custom-scrollbar resize-none",
                )}
              />
              <div className="shrink-0 flex items-center gap-1.5 self-end mb-1 pr-1">
                <button
                  onClick={toggleListening}
                  className={cn(
                    "p-2.5 rounded-full transition-all relative group focus:outline-none focus:ring-2 focus:ring-indigo-500/50",
                    isListening
                      ? "bg-rose-500 text-white animate-pulse"
                      : "text-slate-400 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5",
                  )}
                  title="Voice Input"
                  aria-label={
                    isListening ? "Matikan mikrofon" : "Gunakan mikrofon"
                  }
                >
                  {isListening ? (
                    <MicOff className="w-5 h-5" />
                  ) : (
                    <Mic className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isGenerating}
                  className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center bg-indigo-600 text-white rounded-full hover:bg-indigo-500 active:scale-95 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 disabled:scale-100 transition-all font-bold shadow-md shadow-indigo-600/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  title="Send Message"
                  aria-label="Kirim pesan"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vocab Modal */}
      <AnimatePresence>
        {vocabModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-slate-900 border border-white/10 rounded-[3rem] p-10 space-y-8 shadow-2xl"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-black text-white tracking-tighter">
                    Save Vocab?
                  </h2>
                  <button
                    onClick={() => setVocabModalOpen(false)}
                    className="p-3 hover:bg-white/5 rounded-2xl transition-all"
                  >
                    <Plus className="w-6 h-6 rotate-45 text-white" />
                  </button>
                </div>
                <div className="p-8 bg-indigo-500/10 border border-indigo-500/20 rounded-[2rem]">
                  <p className="text-indigo-400 font-black text-3xl tracking-tighter italic">
                    "{selectedText}"
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">
                  Maknanya buat lu?
                </label>
                <textarea
                  value={meaning}
                  onChange={(e) => setMeaning(e.target.value)}
                  placeholder="Maksimalin pemahaman lu..."
                  className="w-full p-6 bg-slate-800 border border-white/5 rounded-[1.75rem] text-white focus:ring-4 focus:ring-indigo-500/20 transition-all outline-none min-h-[140px] text-lg placeholder:text-slate-600 resize-none"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setVocabModalOpen(false)}
                  className="flex-1 py-5 bg-slate-800 text-slate-400 font-bold rounded-[1.5rem] hover:bg-slate-700 transition-colors tracking-tight"
                >
                  Batal
                </button>
                <button
                  onClick={saveVocab}
                  className="flex-1 py-5 bg-indigo-600 text-white font-black rounded-[1.5rem] shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all tracking-tight"
                >
                  Simpen Kuy!
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AI Lens Modal */}
      <AnimatePresence>
        {aiLensModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setAiLensModalOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem] w-full max-w-2xl shadow-2xl relative"
            >
              <button
                onClick={() => setAiLensModalOpen(false)}
                className="absolute top-6 right-6 p-2 bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight">
                    AI Lens
                  </h3>
                  <p className="text-slate-400 font-medium text-sm">
                    Upload screenshot materi atau soal SNBT-mu
                  </p>
                </div>
              </div>

              <ImageUploader
                onImageSelect={setLensFiles}
                onGenerate={handleLensGenerate}
                isGenerating={isLensGenerating}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileSelectionVisible && selectedText && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[90] w-max max-w-[90vw]"
          >
            <div className="bg-slate-900 border border-slate-700 shadow-2xl rounded-2xl p-2 flex items-center gap-3 pr-4">
              <div className="flex flex-col max-w-[180px]">
                <span className="text-[10px] text-slate-400 font-bold uppercase ml-2 mt-1 truncate">
                  Selected
                </span>
                <span className="text-white font-medium text-sm ml-2 truncate">
                  "{selectedText}"
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setMobileSelectionVisible(false)}
                  className="p-2 rounded-xl text-slate-400 hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <button
                  onClick={openVocabModalFromMobile}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-bold text-sm shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2 tracking-tight"
                >
                  <BookOpen className="w-4 h-4" />
                  Save
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmModal
        isOpen={showConfirmDelete !== null}
        onClose={() => setShowConfirmDelete(null)}
        onConfirm={confirmDeleteChat}
        title="Hapus Chat?"
        message="Percakapan ini bakal dihapus permanen. Lu serius mau ngilangin jejak?"
        confirmText="Hapus"
      />

      <ConfirmModal
        isOpen={showQuotaModal}
        onClose={() => setShowQuotaModal(false)}
        onConfirm={() => setShowQuotaModal(false)}
        title="AI Lagi Capek!"
        message="Waduh pejuang, kuota AI lagi limit nih karena banyak banget yang belajar hari ini. Coba lagi dalam 30-60 detik ya biar AI-nya napas dulu!"
        confirmText="Oke, Gw Tunggu"
        variant="warning"
      />
    </div>
  );
}
