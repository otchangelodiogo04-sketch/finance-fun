 import { motion } from "framer-motion";
 import { 
   BookOpen, 
   Target, 
   Zap, 
   ChevronRight,
   TrendingUp
 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
 import RankProgress, { RANK_CONFIG, RankType } from "@/components/RankProgress";

// Mock data for modules
const MODULES = [
  { id: 1, title: "Fundamentos", progress: 75, lessons: 6, completed: 4 },
  { id: 2, title: "Orçamento", progress: 30, lessons: 6, completed: 2 },
  { id: 3, title: "Poupança", progress: 0, lessons: 6, completed: 0, locked: true },
  { id: 4, title: "Investimentos", progress: 0, lessons: 6, completed: 0, locked: true },
];

const Dashboard = () => {
  const { user } = useAuth();

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

  const getRankColor = (rank: string) => {
    switch (rank) {
      case "S": return "bg-rank-s text-white";
      case "A": return "bg-rank-a text-primary-foreground";
      case "B": return "bg-rank-b text-primary-foreground";
      case "C": return "bg-rank-c text-primary-foreground";
      default: return "bg-rank-d text-white";
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
       {/* Welcome section */}
       <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         className="space-y-4"
       >
         <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-card to-accent/10 border border-border p-6">
           <div className="relative z-10">
             <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">
               {getProfileWelcome()}
             </h1>
             <p className="text-muted-foreground mb-4">{getProfileTip()}</p>
             
             {/* Lessons completed stat */}
             <div className="flex items-center gap-3 bg-card/60 backdrop-blur rounded-xl p-3 w-fit">
               <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                 <BookOpen className="w-5 h-5 text-accent" />
               </div>
               <div>
                 <p className="text-xl font-bold">{user?.lessonsCompleted}</p>
                 <p className="text-xs text-muted-foreground">Aulas Concluídas</p>
               </div>
             </div>
           </div>
 
           {/* Decorative elements */}
           <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
           <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl" />
         </div>
         
         {/* Rank Progress Card */}
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
                    ? "opacity-50 cursor-not-allowed" 
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
                        <span className="text-xs bg-muted px-2 py-0.5 rounded">Bloqueado</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {module.completed}/{module.lessons} aulas
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={cn(
                      "text-sm font-semibold",
                      module.progress === 100 ? "text-success" : "text-primary"
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
        className="grid grid-cols-2 gap-3"
      >
         <Link 
           to="/dashboard/ranking"
           className="bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-all duration-200 hover:shadow-glow-sm flex flex-col items-center gap-2"
         >
           <div className={cn(
             "w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br",
             RANK_CONFIG[(user?.rank || "D") as RankType].gradient
           )}>
             <span className="text-lg font-bold text-white">{user?.rank}</span>
           </div>
           <span className="text-sm font-medium">Agente Financeiro</span>
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
