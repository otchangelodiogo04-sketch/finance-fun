import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle,
  XCircle,
  Trophy,
  Star,
  RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// --- COMPONENTE DE ANÚNCIO REUTILIZÁVEL ---
const AdBanner = ({ scriptSrc, containerId, config }: { scriptSrc: string, containerId?: string, config?: any }) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (adRef.current && !adRef.current.innerHTML) {
      if (config) { (window as any).atOptions = config; }
      
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

  return <div ref={adRef} className="my-6 flex justify-center w-full overflow-hidden min-h-[90px]" />;
};

// ... (Mantenha o objeto LESSONS exatamente como está no seu código)

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

  const lesson = LESSONS[lessonId || ""] || LESSONS["1"];
  const hasQuiz = !!lesson.quiz;
  const totalPages = lesson.content.length;

  // Funções de navegação (Mantidas do original)
  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    } else if (hasQuiz) {
      setShowQuiz(true);
    } else {
      handleCompleteLesson();
    }
  };

  const handlePrev = () => {
    if (showQuiz) {
      setShowQuiz(false);
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setShowResult(false);
    } else if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleAnswerSelect = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer === null) return;
    setShowResult(true);
    if (selectedAnswer === lesson.quiz![currentQuestion].correctIndex) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < lesson.quiz!.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleCompleteLesson = () => {
    const earnedPoints = hasQuiz ? score * 50 + 100 : 100;
    addPoints(earnedPoints);
    updateUser({ lessonsCompleted: (user?.lessonsCompleted || 0) + 1 });
    toast({ title: "Aula concluída! 🎉", description: `Ganhaste ${earnedPoints} pontos!` });
    navigate("/dashboard/modulos/1");
  };

  const handleRetryQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizCompleted(false);
  };

  return (
    <div className="max-w-2xl mx-auto pb-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <button
          onClick={() => navigate("/dashboard/modulos/1")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Voltar ao módulo
        </button>
        <h1 className="text-2xl font-display font-bold">{lesson.title}</h1>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ 
                width: showQuiz 
                  ? quizCompleted ? "100%" : `${((currentQuestion + 1) / lesson.quiz!.length) * 100}%`
                  : `${((currentPage + 1) / totalPages) * 100}%` 
              }}
            />
          </div>
          <span className="text-sm text-muted-foreground">
            {showQuiz ? `Quiz ${currentQuestion + 1}/${lesson.quiz?.length}` : `${currentPage + 1}/${totalPages}`}
          </span>
        </div>
      </motion.div>

      {/* --- ANÚNCIO TOPO (SCRIPT 2) --- */}
      <AdBanner scriptSrc="https://pl28732098.effectivegatecpm.com/54/12/76/541276d4b5fce0f41a042b01ea43858e.js" />

      {/* Content Section */}
      <AnimatePresence mode="wait">
        {!showQuiz ? (
          <motion.div
            key={`page-${currentPage}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="bg-card border border-border rounded-2xl p-6">
              <p className="text-lg leading-relaxed">{lesson.content[currentPage]}</p>
            </div>

            {/* --- ANÚNCIO DENTRO DA AULA (SCRIPT 3 - CONTAINER) --- */}
            <AdBanner 
              containerId="d4dce3f93652c4b3a7c47751f5f525c8"
              scriptSrc="https://pl28742564.effectivegatecpm.com/d4dce3f93652c4b3a7c47751f5f525c8/invoke.js" 
            />
          </motion.div>
        ) : !quizCompleted ? (
          <motion.div
            key={`quiz-${currentQuestion}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-card border border-border rounded-2xl p-6 mb-6"
          >
            <div className="mb-6">
              <span className="text-sm text-primary font-medium">Pergunta {currentQuestion + 1}</span>
              <h2 className="text-xl font-semibold mt-1">{lesson.quiz![currentQuestion].question}</h2>
            </div>

            <div className="space-y-3">
              {lesson.quiz![currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                  className={cn(
                    "w-full p-4 rounded-xl border-2 text-left transition-all",
                    selectedAnswer === index
                      ? showResult
                        ? index === lesson.quiz![currentQuestion].correctIndex ? "border-success bg-success/10" : "border-destructive bg-destructive/10"
                        : "border-primary bg-primary/10"
                      : showResult && index === lesson.quiz![currentQuestion].correctIndex ? "border-success bg-success/10" : "border-border hover:border-primary/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold",
                      selectedAnswer === index ? (showResult ? (index === lesson.quiz![currentQuestion].correctIndex ? "bg-success text-white" : "bg-destructive text-white") : "bg-primary text-white") : "bg-muted"
                    )}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="flex-1">{option}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* --- ANÚNCIO IFRAME (SCRIPT 1) - APARECE APENAS NO QUIZ --- */}
            <div className="mt-6 flex justify-center">
                <AdBanner 
                    scriptSrc="https://www.highperformanceformat.com/4fec2a0ad6a72672d864205367950127/invoke.js"
                    config={{
                        'key' : '4fec2a0ad6a72672d864205367950127',
                        'format' : 'iframe',
                        'height' : 50, // Ajustado para ser um banner horizontal pequeno no quiz
                        'width' : 320,
                        'params' : {}
                    }}
                />
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-card border border-border rounded-2xl p-8 text-center mb-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <Trophy className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-display font-bold mb-2">Quiz Concluído!</h2>
            <p className="text-muted-foreground mb-4">Acertaste {score} de {lesson.quiz!.length} perguntas</p>
            <div className="flex items-center justify-center gap-1 mb-6">
              {[...Array(lesson.quiz!.length)].map((_, i) => (
                <Star key={i} className={cn("w-8 h-8", i < score ? "text-warning fill-warning" : "text-muted")} />
              ))}
            </div>
            
            {/* ANÚNCIO FINAL DE RESULTADO */}
            <AdBanner scriptSrc="https://pl28732098.effectivegatecpm.com/54/12/76/541276d4b5fce0f41a042b01ea43858e.js" />

            <div className="flex gap-3 justify-center mt-6">
              {score < lesson.quiz!.length && (
                <Button variant="outline" onClick={handleRetryQuiz}><RotateCcw className="w-4 h-4 mr-2" /> Tentar de novo</Button>
              )}
              <Button variant="gradient" onClick={handleCompleteLesson}>Concluir Aula</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Controls */}
      {!quizCompleted && (
        <div className="flex gap-3">
          <Button variant="outline" size="lg" className="flex-1" onClick={handlePrev} disabled={currentPage === 0 && !showQuiz}>
            <ChevronLeft className="w-5 h-5 mr-2" /> Anterior
          </Button>
          
          {showQuiz ? (
            showResult ? (
              <Button variant="gradient" size="lg" className="flex-1" onClick={handleNextQuestion}>
                {currentQuestion < lesson.quiz!.length - 1 ? "Próxima" : "Ver Resultado"}
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            ) : (
              <Button variant="gradient" size="lg" className="flex-1" onClick={handleCheckAnswer} disabled={selectedAnswer === null}>
                Verificar
              </Button>
            )
          ) : (
            <Button variant="gradient" size="lg" className="flex-1" onClick={handleNext}>
              {currentPage < totalPages - 1 ? "Próximo" : hasQuiz ? "Iniciar Quiz" : "Concluir"}
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default Lesson;