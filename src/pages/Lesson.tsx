import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ChevronLeft, 
  Trophy,
  RotateCcw,
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// --- COMPONENTE DE ANÚNCIO (SIDEBAR) ---
const AdSidebar = ({ side }: { side: 'left' | 'right' }) => (
  <div className={cn(
    "fixed top-24 hidden xl:flex flex-col gap-4 w-40 h-[600px]",
    side === 'left' ? "left-4" : "right-4"
  )}>
    <AdsterraElement scriptSrc="https://pl28732098.effectivegatecpm.com/54/12/76/541276d4b5fce0f41a042b01ea43858e.js" />
  </div>
);

const AdsterraElement = ({ scriptSrc, containerId, config }: { scriptSrc: string, containerId?: string, config?: any }) => {
  const adRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (adRef.current && adRef.current.children.length === 0) {
      if (config) (window as any).atOptions = config;
      const script = document.createElement("script");
      script.src = scriptSrc;
      script.async = true;
      if (containerId) {
        const div = document.createElement("div");
        div.id = `container-${containerId}`;
        adRef.current.appendChild(div);
      }
      adRef.current.appendChild(script);
    }
  }, [scriptSrc, containerId, config]);
  return <div ref={adRef} className="w-full min-h-[90px] overflow-hidden flex justify-center" />;
};

// --- CONTEÚDO EXPANDIDO ---
const LESSONS: Record<string, any> = {
  "1": { /* ... Omitido para brevidade, mantém o seu original ... */ },
  "2": { /* ... Omitido para brevidade, mantém o seu original ... */ },
  "3": { /* ... Omitido para brevidade, mantém o seu original ... */ },
  "4": { /* ... Omitido para brevidade, mantém o seu original ... */ },
  "5": { /* ... Omitido para brevidade, mantém o seu original ... */ },
  "6": {
    title: "O que é Investir?",
    content: [
      "Investir é colocar o teu dinheiro para trabalhar para ti. Em vez de apenas guardar, compras ativos que podem aumentar de valor ou pagar rendimentos.",
      "Existem vários tipos: Ações (partes de empresas), Obrigações (empréstimos ao estado/empresas) e Imobiliário.",
      "Todo investimento tem um risco. Geralmente, quanto maior o lucro potencial, maior o risco de perder dinheiro."
    ],
    quiz: [
      { question: "O que é um investimento?", options: ["Gastar dinheiro em doces", "Comprar algo que pode render mais dinheiro no futuro", "Guardar dinheiro debaixo do colchão", "Pedir dinheiro emprestado"], correctIndex: 1 }
    ]
  },
  "7": {
    title: "Cuidado com as Dívidas",
    content: [
      "Uma dívida acontece quando pedes dinheiro emprestado e tens de o devolver com juros. Juros aqui trabalham CONTRA ti.",
      "Dívida Boa: Ajuda a construir valor (ex: crédito habitação ou curso universitário).",
      "Dívida Má: Gastar dinheiro que não tens em coisas que perdem valor rapidamente (ex: cartões de crédito para compras supérfluas)."
    ],
    quiz: [
      { question: "O que torna uma dívida perigosa?", options: ["Os juros altos", "O banco ser simpático", "O dinheiro ser digital", "Pagar a horas"], correctIndex: 0 }
    ]
  }
};

const Lesson = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { addPoints, updateUser, user } = useAuth();
  const { toast } = useToast();

  const [currentPage, setCurrentPage] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const lesson = LESSONS[lessonId || "1"] || LESSONS["1"];
  const totalPages = lesson.content.length;

  // Lógica de Desbloqueio e Conclusão
  const handleCompleteLesson = () => {
    const earnedPoints = score * 50 + 100;
    const currentLessonNum = parseInt(lessonId || "1");
    
    // Atualiza o progresso global do usuário
    const nextLessonToUnlock = Math.max(user?.lessonsCompleted || 0, currentLessonNum);
    
    updateUser({ 
      lessonsCompleted: nextLessonToUnlock,
      totalPoints: (user?.totalPoints || 0) + earnedPoints
    });

    toast({ title: "Aula concluída! 🚀", description: `Ganhaste ${earnedPoints} pontos!` });
    navigate("/dashboard/modulos/1");
  };

  // ... (Manter as funções handleNext, handlePrev, handleCheckAnswer igual ao original)

  return (
    <div className="relative min-h-screen">
      {/* ANÚNCIOS NAS LATERAIS */}
      <AdSidebar side="left" />
      <AdSidebar side="right" />

      <div className="max-w-2xl mx-auto pb-20 px-4">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 mt-4">
          <button onClick={() => navigate("/dashboard/modulos/1")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
            <ChevronLeft className="w-4 h-4" /> Voltar
          </button>
          <h1 className="text-2xl font-bold">{lesson.title}</h1>
          
          <div className="flex items-center gap-4 mt-2">
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-primary" 
                animate={{ width: `${((currentPage + 1) / totalPages) * 100}%` }} 
              />
            </div>
          </div>
        </motion.div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {!showQuiz ? (
            <motion.div key="content" className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <p className="text-lg leading-relaxed">{lesson.content[currentPage]}</p>
            </motion.div>
          ) : !quizCompleted ? (
            <motion.div key="quiz" className="bg-card border border-border rounded-2xl p-6">
               <h2 className="text-xl font-semibold mb-6">{lesson.quiz[currentQuestion].question}</h2>
               <div className="space-y-3">
                 {lesson.quiz[currentQuestion].options.map((option: string, index: number) => (
                   <button
                    key={index}
                    onClick={() => !showResult && setSelectedAnswer(index)}
                    className={cn(
                      "w-full p-4 rounded-xl border-2 text-left transition-all",
                      selectedAnswer === index ? "border-primary bg-primary/10" : "border-border"
                    )}
                   >
                     {option}
                   </button>
                 ))}
               </div>
            </motion.div>
          ) : (
            <div className="text-center p-8 bg-card rounded-2xl border border-border">
              <Trophy className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
              <h2 className="text-2xl font-bold">Excelente!</h2>
              <p className="mb-6">Acertaste {score} questões.</p>
              <Button onClick={handleCompleteLesson} variant="gradient" size="lg">Desbloquear Próxima Aula</Button>
            </div>
          )}
        </AnimatePresence>

        {/* Botões de Navegação (Fixos em baixo para facilitar) */}
        {!quizCompleted && (
          <div className="flex gap-3 mt-8">
            <Button variant="outline" onClick={() => currentPage > 0 && setCurrentPage(currentPage - 1)}>Anterior</Button>
            <Button className="flex-1" onClick={() => currentPage < totalPages - 1 ? setCurrentPage(currentPage + 1) : setShowQuiz(true)}>
              {currentPage < totalPages - 1 ? "Próximo" : "Iniciar Desafio"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Lesson;