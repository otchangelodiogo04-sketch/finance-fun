import { useState } from "react";
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

// Mock lesson content
const LESSONS: Record<string, {
  title: string;
  content: string[];
  quiz?: {
    question: string;
    options: string[];
    correctIndex: number;
  }[];
}> = {
  "1": {
    title: "O que é dinheiro?",
    content: [
      "O dinheiro é uma ferramenta que usamos para trocar por coisas que queremos ou precisamos. Antigamente, as pessoas trocavam objetos diretamente - por exemplo, trocavam ovos por leite. Isso chamava-se escambo.",
      "Hoje, usamos notas e moedas como dinheiro. O dinheiro tem três funções principais: 1) Meio de troca - compramos coisas com ele. 2) Unidade de conta - medimos o valor das coisas. 3) Reserva de valor - podemos guardá-lo para usar depois.",
      "O dinheiro digital também é muito comum hoje em dia. Quando os teus pais usam o cartão ou o telemóvel para pagar, estão a usar dinheiro digital - é o mesmo que dinheiro, mas guardado eletronicamente.",
    ],
    quiz: [
      {
        question: "O que é o escambo?",
        options: [
          "Guardar dinheiro no banco",
          "Trocar objetos diretamente sem usar dinheiro",
          "Pagar com cartão de crédito",
          "Comprar coisas online"
        ],
        correctIndex: 1
      },
      {
        question: "Qual é uma das funções do dinheiro?",
        options: [
          "Fazer barulho",
          "Ser bonito",
          "Meio de troca",
          "Fazer exercício"
        ],
        correctIndex: 2
      },
      {
        question: "O que é dinheiro digital?",
        options: [
          "Notas e moedas",
          "Dinheiro guardado eletronicamente",
          "Ouro e prata",
          "Cheques em papel"
        ],
        correctIndex: 1
      }
    ]
  },
  "5": {
    title: "O Poder dos Juros Compostos",
    content: [
      "Os juros compostos são como uma bola de neve que cresce sozinha! Quando poupas dinheiro e ganhas juros, esses juros também começam a ganhar juros. É dinheiro a trabalhar para ti!",
      "Imagina que guardas 100€ e ganhas 10% de juros por ano. No primeiro ano, tens 110€. No segundo ano, ganhas 10% sobre 110€, então tens 121€. E assim por diante!",
      "Quanto mais cedo começares a poupar, mais tempo os juros compostos têm para fazer a tua poupança crescer. É por isso que começar jovem é tão importante!",
      "O famoso investidor Warren Buffett começou a investir aos 11 anos. Hoje é um dos homens mais ricos do mundo, graças ao poder dos juros compostos ao longo de décadas."
    ],
    quiz: [
      {
        question: "O que são juros compostos?",
        options: [
          "Juros que só crescem uma vez",
          "Juros sobre juros - crescimento exponencial",
          "Dinheiro emprestado",
          "Taxas do banco"
        ],
        correctIndex: 1
      },
      {
        question: "Porque é importante começar a poupar cedo?",
        options: [
          "Para gastar mais depois",
          "Porque os adultos obrigam",
          "Para dar mais tempo aos juros compostos crescerem",
          "Não é importante"
        ],
        correctIndex: 2
      },
      {
        question: "Se tens 100€ com 10% de juros, quanto terás após 1 ano?",
        options: [
          "100€",
          "105€",
          "110€",
          "120€"
        ],
        correctIndex: 2
      },
      {
        question: "Com que idade Warren Buffett começou a investir?",
        options: [
          "21 anos",
          "18 anos",
          "11 anos",
          "30 anos"
        ],
        correctIndex: 2
      }
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

  const lesson = LESSONS[lessonId || ""] || LESSONS["1"];
  const hasQuiz = !!lesson.quiz;
  const totalPages = lesson.content.length;

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    } else if (hasQuiz) {
      setShowQuiz(true);
    } else {
      // Complete lesson
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
    
    toast({
      title: "Aula concluída! 🎉",
      description: `Ganhaste ${earnedPoints} pontos!`,
    });
    
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
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <button
          onClick={() => navigate("/dashboard/modulos/1")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar ao módulo
        </button>
        <h1 className="text-2xl font-display font-bold">{lesson.title}</h1>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ 
                width: showQuiz 
                  ? quizCompleted 
                    ? "100%" 
                    : `${((currentQuestion + 1) / lesson.quiz!.length) * 100}%`
                  : `${((currentPage + 1) / totalPages) * 100}%` 
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <span className="text-sm text-muted-foreground">
            {showQuiz 
              ? `Quiz ${currentQuestion + 1}/${lesson.quiz?.length}`
              : `${currentPage + 1}/${totalPages}`
            }
          </span>
        </div>
      </motion.div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {!showQuiz ? (
          <motion.div
            key={`page-${currentPage}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-card border border-border rounded-2xl p-6 mb-6"
          >
            <p className="text-lg leading-relaxed">{lesson.content[currentPage]}</p>
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
              <h2 className="text-xl font-semibold mt-1">
                {lesson.quiz![currentQuestion].question}
              </h2>
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
                        ? index === lesson.quiz![currentQuestion].correctIndex
                          ? "border-success bg-success/10"
                          : "border-destructive bg-destructive/10"
                        : "border-primary bg-primary/10"
                      : showResult && index === lesson.quiz![currentQuestion].correctIndex
                        ? "border-success bg-success/10"
                        : "border-border hover:border-primary/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold",
                      selectedAnswer === index
                        ? showResult
                          ? index === lesson.quiz![currentQuestion].correctIndex
                            ? "bg-success text-success-foreground"
                            : "bg-destructive text-destructive-foreground"
                          : "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="flex-1">{option}</span>
                    {showResult && index === lesson.quiz![currentQuestion].correctIndex && (
                      <CheckCircle className="w-5 h-5 text-success" />
                    )}
                    {showResult && selectedAnswer === index && index !== lesson.quiz![currentQuestion].correctIndex && (
                      <XCircle className="w-5 h-5 text-destructive" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "mt-4 p-4 rounded-xl",
                  selectedAnswer === lesson.quiz![currentQuestion].correctIndex
                    ? "bg-success/20 text-success"
                    : "bg-destructive/20 text-destructive"
                )}
              >
                {selectedAnswer === lesson.quiz![currentQuestion].correctIndex
                  ? "Correto! Muito bem! 🎉"
                  : "Incorreto. A resposta certa está destacada acima."}
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border rounded-2xl p-8 text-center mb-6"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <Trophy className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-display font-bold mb-2">Quiz Concluído!</h2>
            <p className="text-muted-foreground mb-4">
              Acertaste {score} de {lesson.quiz!.length} perguntas
            </p>
            <div className="flex items-center justify-center gap-1 mb-6">
              {[...Array(lesson.quiz!.length)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-8 h-8",
                    i < score ? "text-warning fill-warning" : "text-muted"
                  )}
                />
              ))}
            </div>
            <p className="text-lg font-semibold text-primary mb-6">
              +{score * 50 + 100} pontos!
            </p>
            <div className="flex gap-3 justify-center">
              {score < lesson.quiz!.length && (
                <Button variant="outline" onClick={handleRetryQuiz}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Tentar de novo
                </Button>
              )}
              <Button variant="gradient" onClick={handleCompleteLesson}>
                Concluir Aula
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      {!quizCompleted && (
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={handlePrev}
            disabled={currentPage === 0 && !showQuiz}
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Anterior
          </Button>
          
          {showQuiz ? (
            showResult ? (
              <Button
                variant="gradient"
                size="lg"
                className="flex-1"
                onClick={handleNextQuestion}
              >
                {currentQuestion < lesson.quiz!.length - 1 ? "Próxima" : "Ver Resultado"}
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            ) : (
              <Button
                variant="gradient"
                size="lg"
                className="flex-1"
                onClick={handleCheckAnswer}
                disabled={selectedAnswer === null}
              >
                Verificar
              </Button>
            )
          ) : (
            <Button
              variant="gradient"
              size="lg"
              className="flex-1"
              onClick={handleNext}
            >
              {currentPage < totalPages - 1 
                ? "Próximo" 
                : hasQuiz 
                  ? "Iniciar Quiz" 
                  : "Concluir"
              }
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default Lesson;
