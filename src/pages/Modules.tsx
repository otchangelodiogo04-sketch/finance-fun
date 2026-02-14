import { useState } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  Lock,
  CheckCircle,
  Play,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Mock module data
const MODULES_DATA: Record<string, {
  title: string;
  description: string;
  levels: {
    id: number;
    title: string;
    lessons: {
      id: number;
      title: string;
      duration: string;
      completed: boolean;
      locked: boolean;
    }[];
  }[];
}> = {
  "1": {
    title: "Fundamentos Financeiros",
    description: "Aprenda os conceitos básicos de finanças pessoais",
    levels: [
      {
        id: 1,
        title: "Nível 1 - Introdução",
        lessons: [
          { id: 1, title: "O que é dinheiro?", duration: "5 min", completed: true, locked: false },
          { id: 2, title: "Receitas e Despesas", duration: "7 min", completed: true, locked: false },
          { id: 3, title: "Necessidades vs Desejos", duration: "6 min", completed: true, locked: false },
          { id: 4, title: "A importância de poupar", duration: "8 min", completed: true, locked: false },
          { id: 5, title: "O Poder dos Juros Compostos", duration: "10 min", completed: false, locked: false },
          { id: 6, title: "Quiz - Nível 1", duration: "5 min", completed: false, locked: false },
        ],
      },
      {
        id: 2,
        title: "Nível 2 - Orçamento Básico",
        lessons: [
          { id: 1, title: "Criando um orçamento simples", duration: "8 min", completed: false, locked: true },
          { id: 2, title: "Controlando gastos diários", duration: "7 min", completed: false, locked: true },
          { id: 3, title: "Metas financeiras", duration: "6 min", completed: false, locked: true },
          { id: 4, title: "Revisão mensal", duration: "5 min", completed: false, locked: true },
          { id: 5, title: "Ajustando o orçamento", duration: "7 min", completed: false, locked: true },
          { id: 6, title: "Quiz - Nível 2", duration: "5 min", completed: false, locked: true },
        ],
      },
      {
        id: 3,
        title: "Nível 3 - Poupança Inteligente",
        lessons: [
          { id: 1, title: "Estratégias de poupança", duration: "10 min", completed: false, locked: true },
          { id: 2, title: "Fundo de emergência", duration: "8 min", completed: false, locked: true },
          { id: 3, title: "Poupança automática", duration: "6 min", completed: false, locked: true },
          { id: 4, title: "Onde guardar o dinheiro", duration: "9 min", completed: false, locked: true },
          { id: 5, title: "Calculando objetivos", duration: "7 min", completed: false, locked: true },
          { id: 6, title: "Quiz - Nível 3", duration: "5 min", completed: false, locked: true },
        ],
      },
      {
        id: 4,
        title: "Nível 4 - Avançado",
        lessons: [
          { id: 1, title: "Introdução a investimentos", duration: "12 min", completed: false, locked: true },
          { id: 2, title: "Tipos de investimentos", duration: "10 min", completed: false, locked: true },
          { id: 3, title: "Risco e retorno", duration: "8 min", completed: false, locked: true },
          { id: 4, title: "Diversificação", duration: "9 min", completed: false, locked: true },
          { id: 5, title: "Primeiro investimento", duration: "11 min", completed: false, locked: true },
          { id: 6, title: "Quiz Final", duration: "10 min", completed: false, locked: true },
        ],
      },
    ],
  },
  "2": {
    title: "Gestão de Orçamento",
    description: "Domine a arte de gerir o seu dinheiro",
    levels: [
      {
        id: 1,
        title: "Nível 1 - Básico",
        lessons: [
          { id: 1, title: "Princípios do orçamento", duration: "6 min", completed: true, locked: false },
          { id: 2, title: "Categorias de gastos", duration: "7 min", completed: true, locked: false },
          { id: 3, title: "Priorizando despesas", duration: "8 min", completed: false, locked: false },
          { id: 4, title: "Ferramentas de controle", duration: "6 min", completed: false, locked: false },
          { id: 5, title: "Erros comuns", duration: "7 min", completed: false, locked: false },
          { id: 6, title: "Quiz - Nível 1", duration: "5 min", completed: false, locked: false },
        ],
      },
      {
        id: 2,
        title: "Nível 2 - Intermediário",
        lessons: [
          { id: 1, title: "Orçamento 50/30/20", duration: "9 min", completed: false, locked: true },
          { id: 2, title: "Reduzindo despesas", duration: "8 min", completed: false, locked: true },
          { id: 3, title: "Aumentando receitas", duration: "10 min", completed: false, locked: true },
          { id: 4, title: "Planejamento anual", duration: "7 min", completed: false, locked: true },
          { id: 5, title: "Imprevistos financeiros", duration: "8 min", completed: false, locked: true },
          { id: 6, title: "Quiz - Nível 2", duration: "5 min", completed: false, locked: true },
        ],
      },
    ],
  },
};

const Modules = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();

  // Show module list
  if (!moduleId) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-display font-bold mb-2">Módulos</h1>
          <p className="text-muted-foreground">Escolha um módulo para começar a aprender</p>
        </motion.div>

        <div className="space-y-4">
          {Object.entries(MODULES_DATA).map(([id, module], index) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={`/dashboard/modulos/${id}`}
                className="block bg-card border border-border rounded-xl p-5 hover:border-primary/50 hover:shadow-glow-sm transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
                    <BookOpen className="w-7 h-7 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{module.title}</h3>
                    <p className="text-sm text-muted-foreground">{module.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span>{module.levels.length} níveis</span>
                      <span className="text-muted-foreground">
                        {module.levels.reduce((acc, l) => acc + l.lessons.length, 0)} aulas
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // Show module detail
  const module = MODULES_DATA[moduleId];
  if (!module) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Módulo não encontrado</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/dashboard/modulos")}>
          Voltar aos módulos
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          onClick={() => navigate("/dashboard/modulos")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar
        </button>
        <h1 className="text-2xl font-display font-bold mb-2">{module.title}</h1>
        <p className="text-muted-foreground">{module.description}</p>
      </motion.div>

      {/* Levels */}
      <div className="space-y-6">
        {module.levels.map((level, levelIndex) => (
          <motion.div
            key={level.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: levelIndex * 0.1 }}
            className="bg-card border border-border rounded-xl overflow-hidden"
          >
            <div className="p-4 border-b border-border">
              <h2 className="font-semibold">{level.title}</h2>
              <p className="text-sm text-muted-foreground">
                {level.lessons.filter(l => l.completed).length}/{level.lessons.length} aulas concluídas
              </p>
            </div>
            <div className="divide-y divide-border">
              {level.lessons.map((lesson) => (
                <Link
                  key={lesson.id}
                  to={lesson.locked ? "#" : `/dashboard/modulos/${moduleId}/aula/${lesson.id}`}
                  className={cn(
                    "flex items-center gap-4 p-4 transition-colors",
                    lesson.locked 
                      ? "opacity-50 cursor-not-allowed" 
                      : "hover:bg-card-elevated"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    lesson.completed 
                      ? "bg-success/20" 
                      : lesson.locked 
                        ? "bg-muted" 
                        : "bg-primary/20"
                  )}>
                    {lesson.completed ? (
                      <CheckCircle className="w-5 h-5 text-success" />
                    ) : lesson.locked ? (
                      <Lock className="w-4 h-4 text-muted-foreground" />
                    ) : lesson.title.includes("Quiz") ? (
                      <FileText className="w-5 h-5 text-primary" />
                    ) : (
                      <Play className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "font-medium truncate",
                      lesson.completed && "text-muted-foreground"
                    )}>
                      {lesson.title}
                    </p>
                    <p className="text-sm text-muted-foreground">{lesson.duration}</p>
                  </div>
                  {!lesson.locked && !lesson.completed && (
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  )}
                </Link>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Modules;
