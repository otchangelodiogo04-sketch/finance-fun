import { useEffect, useRef } from "react";
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

// --- COMPONENTE PARA ANÚNCIOS (ADSTERRA) ---
const AdComponent = ({ id, scriptSrc, config }: { id?: string, scriptSrc: string, config?: any }) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (adRef.current && !adRef.current.innerHTML) {
      // Se houver configuração de objeto (como o seu 1º anúncio)
      if (config) {
        const win = window as any;
        win.atOptions = config;
      }

      const script = document.createElement("script");
      script.src = scriptSrc;
      script.async = true;
      
      // Se for o anúncio com container específico (seu 3º exemplo)
      if (id) {
        const container = document.createElement("div");
        container.id = `container-${id}`;
        adRef.current.appendChild(container);
      }

      adRef.current.appendChild(script);
    }
  }, [id, scriptSrc, config]);

  return <div ref={adRef} className="flex justify-center my-4 overflow-hidden min-h-[100px]" />;
};

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

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      
      {/* 1º ANÚNCIO: Banner Lateral/Topo (Iframe 160x600 adaptado) */}
      <div className="hidden lg:block fixed left-4 top-24">
         <AdComponent 
            scriptSrc="https://www.highperformanceformat.com/4fec2a0ad6a72672d864205367950127/invoke.js"
            config={{
              'key' : '4fec2a0ad6a72672d864205367950127',
              'format' : 'iframe',
              'height' : 600,
              'width' : 160,
              'params' : {}
            }}
         />
      </div>

      {/* Welcome section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-card to-accent/10 border border-border p-6">
          <div className="relative z-10">
            <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">{getProfileWelcome()}</h1>
            <p className="text-muted-foreground mb-4">{getProfileTip()}</p>
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
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
        </div>
        
        <RankProgress points={user?.points || 0} rank={(user?.rank || "D") as RankType} variant="card" />
      </motion.div>

      {/* 2º ANÚNCIO: Script Direto entre seções */}
      <AdComponent scriptSrc="https://pl28732098.effectivegatecpm.com/54/12/76/541276d4b5fce0f41a042b01ea43858e.js" />

      {/* Continue learning */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-semibold flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" /> Continuar
          </h2>
          <Link to="/dashboard/modulos" className="text-sm text-primary hover:underline">Ver todos</Link>
        </div>

        <Link to="/dashboard/modulos/1/aula/5" className="block group">
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

      {/* 3º ANÚNCIO: Formato com ID de Container */}
      <AdComponent 
        id="d4dce3f93652c4b3a7c47751f5f525c8" 
        scriptSrc="https://pl28742564.effectivegatecpm.com/d4dce3f93652c4b3a7c47751f5f525c8/invoke.js" 
      />

      {/* Modules progress */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-semibold flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" /> Módulos
          </h2>
        </div>

        <div className="grid gap-3">
          {MODULES.map((module, index) => (
            <motion.div key={module.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + index * 0.05 }}>
              <Link
                to={module.locked ? "#" : `/dashboard/modulos/${module.id}`}
                className={cn(
                  "block bg-card border border-border rounded-xl p-4 transition-all duration-200",
                  module.locked ? "opacity-50 cursor-not-allowed" : "hover:border-primary/50 hover:shadow-glow-sm"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center font-display font-bold text-lg", module.locked ? "bg-muted text-muted-foreground" : "bg-primary/20 text-primary")}>
                    {module.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{module.title}</p>
                      {module.locked && <span className="text-xs bg-muted px-2 py-0.5 rounded">Bloqueado</span>}
                    </div>
                    <p className="text-sm text-muted-foreground">{module.completed}/{module.lessons} aulas</p>
                  </div>
                  <div className="text-right">
                    <p className={cn("text-sm font-semibold", module.progress === 100 ? "text-success" : "text-primary")}>{module.progress}%</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 4º ANÚNCIO: Rodapé */}
      <AdComponent scriptSrc="https://pl28732098.effectivegatecpm.com/54/12/76/541276d4b5fce0f41a042b01ea43858e.js" />

      {/* Quick actions */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="grid grid-cols-2 gap-3">
         <Link to="https://fun-ai-nine.vercel.app/" className="bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-all duration-200 hover:shadow-glow-sm flex flex-col items-center gap-2">
           <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br", RANK_CONFIG[(user?.rank || "D") as RankType].gradient)}>
             <span className="text-lg font-bold text-white">{user?.rank}</span>
           </div>
           <span className="text-sm font-medium">Agente Financeiro</span>
         </Link>
        <Button variant="gradient" size="lg" className="h-auto py-4 flex-col gap-2" asChild>
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