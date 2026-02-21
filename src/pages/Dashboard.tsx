import { motion } from "framer-motion";
import { 
  BookOpen, 
  Target, 
  Zap, 
  ChevronRight,
  TrendingUp,
  Loader2
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import RankProgress, { RANK_CONFIG, RankType } from "@/components/RankProgress";

const MODULES = [
  { id: 1, title: "Fundamentos", progress: 75, lessons: 6, completed: 4 },
  { id: 2, title: "Orçamento", progress: 30, lessons: 6, completed: 2 },
  { id: 3, title: "Poupança", progress: 0, lessons: 6, completed: 0, locked: true },
  { id: 4, title: "Investimentos", progress: 0, lessons: 6, completed: 0, locked: true },
];

const Dashboard = () => {
  // Adicionei 'isLoading' (verifique se seu AuthContext exporta isso)
  const { user } = useAuth();

  // --- TRAVA DE SEGURANÇA ---
  // Se o usuário ainda não carregou, mostra um spinner em vez de uma tela preta
  if (!user) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const getProfileWelcome = () => {
    switch (user?.profile) {
      case "crianca": return "Olá, Campeão! 🌟";
      case "jovem": return "E aí! 💪";
      case "pais": return "Bem-vindo de volta! 👋";
      default: return "Olá!";
    }
  };

  const getProfileTip = () => {
    switch (user?.profile) {
      case "crianca": return "Continue aprendendo para ganhar mais estrelas!";
      case "jovem": return "Complete módulos para subir no ranking!";
      case "pais": return "Gerir bem as finanças familiares começa aqui!";
      default: return "Continue a sua jornada financeira!";
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4">
       {/* Welcome section */}
       <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         className="space-y-4"
       >
         <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-card to-accent/10 border border-border p-6 shadow-sm">
           <div className="relative z-10">
             <h1 className="text-2xl md:text-3xl font-display font-bold mb-2 text-foreground">
               {getProfileWelcome()}
             </h1>
             <p className="text-muted-foreground mb-4">{getProfileTip()}</p>
             
             {/* Lessons completed stat */}
             <div className="flex items-center gap-3 bg-card/80 backdrop-blur-sm rounded-xl p-3 w-fit border border-border/50">
               <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                 <BookOpen className="w-5 h-5 text-accent" />
               </div>
               <div>
                 <p className="text-xl font-bold">{user?.lessonsCompleted || 0}</p>
                 <p className="text-xs text-muted-foreground">Aulas Concluídas</p>
               </div>
             </div>
           </div>

           <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
           <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl" />
         </div>
         
         <RankProgress 
           points={user?.points || 0} 
           rank={(user?.rank || "D") as RankType}
           variant="card"
         />
       </motion.div>

      {/* Continue learning */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-semibold flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Continuar
          </h2>
          <Link to="/dashboard/modulos" className="text-sm text-primary hover:underline">
            Ver todos
          </Link>
        </div>

        <Link 
          to="/dashboard/modulos/1/aula/5"
          className="block group"
        >
          <div className="bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-all duration-200 hover:shadow-glow-sm">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-muted-foreground">Módulo 1 • Aula 5</p>
                <p className="font-semibold truncate">O Poder dos Juros Compostos</p>
                <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: "60%" }} />
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </Link>
      </motion.section>

      {/* Modules progress */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-semibold flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Módulos
          </h2>
        </div>

        <div className="grid gap-3">
          {MODULES.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
            >
              <Link
                to={module.locked ? "#" : `/dashboard/modulos/${module.id}`}
                className={cn(
                  "block bg-card border border-border rounded-xl p-4 transition-all duration-200",
                  module.locked 
                    ? "opacity-60 cursor-not-allowed" 
                    : "hover:border-primary/50 hover:shadow-glow-sm"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center font-display font-bold text-lg",
                    module.locked ? "bg-muted text-muted-foreground" : "bg-primary/20 text-primary"
                  )}>
                    {module.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{module.title}</p>
                      {module.locked && (
                        <span className="text-[10px] bg-muted px-2 py-0.5 rounded uppercase font-bold text-muted-foreground">Bloqueado</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {module.completed}/{module.lessons} aulas
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={cn(
                      "text-sm font-semibold",
                      module.progress === 100 ? "text-green-500" : "text-primary"
                    )}>
                      {module.progress}%
                    </p>
                  </div>
                </div>
                {!module.locked && (
                  <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${module.progress}%` }}
                      transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                    />
                  </div>
                )}
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Quick actions */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-2 gap-3 pb-8"
      >
          <Link 
            to="#" 
            className="bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-all duration-200 hover:shadow-glow-sm flex flex-col items-center gap-2"
          >
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br",
              RANK_CONFIG[(user?.rank || "D") as RankType]?.gradient || "from-gray-400 to-gray-600"
            )}>
              <span className="text-lg font-bold text-white">{user?.rank || "D"}</span>
            </div>
            <span className="text-sm font-medium">Meu Ranking</span>
          </Link>
        <Button
          variant="gradient"
          size="lg"
          className="h-auto py-4 flex-col gap-2"
          asChild
        >
          <Link to="/dashboard/modulos">
            <BookOpen className="w-6 h-6" />
            <span>Estudar</span>
          </Link>
        </Button>
      </motion.section>
    </div>
  );
};

export default Dashboard;