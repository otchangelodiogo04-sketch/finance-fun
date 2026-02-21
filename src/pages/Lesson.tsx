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

// --- COMPONENTE DE INJEÇÃO DE ANÚNCIO (MÉTODO DASHBOARD) ---
const AdsterraElement = ({ scriptSrc, containerId, config }: { scriptSrc: string, containerId?: string, config?: any }) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (adRef.current && adRef.current.children.length === 0) {
      if (config) {
        (window as any).atOptions = config;
      }

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

  return <div ref={adRef} className="my-6 flex justify-center w-full min-h-[90px] overflow-hidden" />;
};

// Mock lesson content - TODAS AS AULAS PRESERVADAS
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
        options: ["Guardar dinheiro no banco", "Trocar objetos diretamente sem usar dinheiro", "Pagar com cartão de crédito", "Comprar coisas online"],
        correctIndex: 1
      },
      {
        question: "Qual é uma das funções do dinheiro?",
        options: ["Fazer barulho", "Ser bonito", "Meio de troca", "Fazer exercício"],
        correctIndex: 2
      },
      {
        question: "O que é dinheiro digital?",
        options: ["Notas e moedas", "Dinheiro guardado eletronicamente", "Ouro e prata", "Cheques em papel"],
        correctIndex: 1
      }
    ]
  },
  "2": {
    "title": "Receitas e despesas",
    "content": [
      "Receitas são todos os valores que recebemos, como o dinheiro do nosso trabalho, mesada ou presentes. É o que entra no nosso bolso.",
      "Despesas são todos os gastos que temos, como comprar comida, roupas, pagar contas ou transporte. É o que sai do nosso bolso.",
      "É importante controlar receitas e despesas para não gastar mais do que ganhamos. Assim, podemos planejar melhor o nosso dinheiro e evitar problemas."
    ],
    "quiz": [
      {
        "question": "O que são receitas?",
        "options": ["Dinheiro que gastamos", "Dinheiro que recebemos", "Objetos que trocamos", "Coisas que compramos online"],
        "correctIndex": 1
      },
      {
        "question": "O que são despesas?",
        "options": ["Dinheiro que recebemos", "Dinheiro que gastamos", "Dinheiro guardado no banco", "Dinheiro digital"],
        "correctIndex": 1
      },
      {
        "question": "Por que é importante controlar receitas e despesas?",
        "options": ["Para gastar mais do que ganhamos", "Para planejar melhor o dinheiro e evitar problemas", "Para comprar só coisas caras", "Para trocar dinheiro com amigos"],
        "correctIndex": 1
      }
    ]
  },
  "3": {
    "title": "Necessidades vs Desejos",
    "content": [
      "Necessidades são coisas que precisamos para viver, como comida, água, roupa e casa. Sem elas, nossa vida ficaria difícil.",
      "Desejos são coisas que queremos, mas não precisamos para sobreviver, como brinquedos, videogames ou roupas de marca.",
      "Saber diferenciar necessidades e desejos ajuda a gastar o dinheiro com inteligência, priorizando o que é essencial antes de comprar o que é supérfluo."
    ],
    "quiz": [
      {
        "question": "O que é uma necessidade?",
        "options": ["Comida e casa", "Brinquedos e jogos", "Carros de luxo", "Férias em outro país"],
        "correctIndex": 0
      },
      {
        "question": "O que é um desejo?",
        "options": ["Água e roupas", "Brinquedos e videogames", "Comida e remédios", "Transporte e luz elétrica"],
        "correctIndex": 1
      },
      {
        "question": "Por que é importante diferenciar necessidades de desejos?",
        "options": ["Para gastar o dinheiro com inteligência", "Para comprar o que todos têm", "Para não trabalhar", "Para pedir mais dinheiro aos pais"],
        "correctIndex": 0
      }
    ]
  },
  "4": {
    "title": "A importância de poupar",
    "content": [
      "Poupar significa guardar uma parte do dinheiro que recebemos, em vez de gastar tudo. Isso nos ajuda a estar preparados para emergências e realizar sonhos no futuro.",
      "Poupar também permite planejar compras grandes, como um computador, uma viagem ou educação. Não precisamos recorrer a empréstimos se já tivermos economizado.",
      "Existem várias formas de poupar: guardar dinheiro em casa, no banco ou usar aplicativos de poupança. O importante é criar o hábito de guardar regularmente."
    ],
    "quiz": [
      {
        "question": "O que significa poupar?",
        "options": ["Gastar todo o dinheiro", "Guardar uma parte do dinheiro que recebemos", "Trocar dinheiro com amigos", "Comprar desejos primeiro"],
        "correctIndex": 1
      },
      {
        "question": "Por que poupar é importante?",
        "options": ["Para estar preparado para emergências e realizar sonhos", "Para gastar com tudo que quisermos", "Para jogar dinheiro fora", "Para comprar coisas inúteis"],
        "correctIndex": 0
      },
      {
        "question": "Qual é uma forma de poupar dinheiro?",
        "options": ["Guardar dinheiro no banco ou em casa", "Comprar tudo que vemos", "Trocar dinheiro com amigos", "Usar cartão de crédito sem limite"],
        "correctIndex": 0
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
        options: ["Juros que só crescem uma vez", "Juros sobre juros - crescimento exponencial", "Dinheiro emprestado", "Taxas do banco"],
        correctIndex: 1
      },
      {
        question: "Porque é importante começar a poupar cedo?",
        options: ["Para gastar mais depois", "Porque os adultos obrigam", "Para dar mais tempo aos juros compostos crescerem", "Não é importante"],
        correctIndex: 2
      },
      {
        question: "Se tens 100€ com 10% de juros, quanto terás após 1 ano?",
        options: ["100€", "105€", "110€", "120€"],
        correctIndex: 2
      },
      {
        question: "Com que idade Warren Buffett começou a investir?",
        options: ["21 anos", "18 anos", "11 anos", "30 anos"],
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
    <div className="max-w-2xl mx-auto pb-20 px-4">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 mt-4">
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
              transition={{ duration: 0.3 }}
            />
          </div>
          <span className="text-sm text-muted-foreground">
            {showQuiz ? `Quiz ${currentQuestion + 1}/${lesson.quiz?.length}` : `${currentPage + 1}/${totalPages}`}
          </span>
        </div>
      </motion.div>

      {/* ANÚNCIO 1: TOPO (Banner Fixo) */}
      <AdsterraElement scriptSrc="https://pl28732098.effectivegatecpm.com/54/12/76/541276d4b5fce0f41a042b01ea43858e.js" />

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {!showQuiz ? (
          <motion.div
            key={`page-${currentPage}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <p className="text-lg leading-relaxed">{lesson.content[currentPage]}</p>
            </div>

            {/* ANÚNCIO 2: DENTRO DO CONTEÚDO (Script Invoke) */}
            <AdsterraElement 
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
                      selectedAnswer === index ? (showResult ? (index === lesson.quiz![currentQuestion].correctIndex ? "bg-success text-white" : "bg-destructive text-white") : "bg-primary text-white") : "bg-muted text-foreground"
                    )}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="flex-1">{option}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* ANÚNCIO 3: DENTRO DO QUIZ (Iframe/Banner Horizontal) */}
            <AdsterraElement 
              scriptSrc="https://www.highperformanceformat.com/4fec2a0ad6a72672d864205367950127/invoke.js"
              config={{
                'key': '4fec2a0ad6a72672d864205367950127',
                'format': 'iframe',
                'height': 50,
                'width': 320,
                'params': {}
              }}
            />
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-card border border-border rounded-2xl p-8 text-center mb-6">
            <Trophy className="w-16 h-16 mx-auto text-primary mb-4" />
            <h2 className="text-2xl font-bold mb-2">Quiz Concluído!</h2>
            <p className="text-muted-foreground mb-4">Acertaste {score} de {lesson.quiz!.length}</p>
            
            {/* ANÚNCIO 4: TELA FINAL (Recarregando Banner Principal) */}
            <AdsterraElement scriptSrc="https://pl28732098.effectivegatecpm.com/54/12/76/541276d4b5fce0f41a042b01ea43858e.js" />

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
        <div className="flex gap-3 mt-6">
          <Button variant="outline" size="lg" className="flex-1" onClick={handlePrev} disabled={currentPage === 0 && !showQuiz}>
            Anterior
          </Button>
          
          {showQuiz ? (
            showResult ? (
              <Button variant="gradient" size="lg" className="flex-1" onClick={handleNextQuestion}>
                {currentQuestion < lesson.quiz!.length - 1 ? "Próxima" : "Resultado"}
              </Button>
            ) : (
              <Button variant="gradient" size="lg" className="flex-1" onClick={handleCheckAnswer} disabled={selectedAnswer === null}>
                Verificar
              </Button>
            )
          ) : (
            <Button variant="gradient" size="lg" className="flex-1" onClick={handleNext}>
              {currentPage < totalPages - 1 ? "Próximo" : hasQuiz ? "Iniciar Quiz" : "Concluir"}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default Lesson;