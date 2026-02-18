import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  BookOpen, Trophy, Target, Users, ChevronRight, Sparkles, TrendingUp, Shield 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const FEATURES = [
  { icon: BookOpen, title: "Aulas Interativas", description: "Aprenda finanças com conteúdo prático e exemplos do dia-a-dia" },
  { icon: Trophy, title: "Gamificação", description: "Ganhe pontos, suba de rank e compete no ranking global" },
  { icon: Target, title: "Progressão", description: "Avance pelos módulos e desbloqueie novos conteúdos" },
  { icon: Users, title: "Para Todos", description: "Conteúdo adaptado para crianças, jovens e famílias" },
];

const PROFILES = [
  { emoji: "👶", title: "Criança", description: "Aprenda a poupar e gastar com consciência de forma divertida", color: "from-blue-500/20 to-cyan-500/20" },
  { emoji: "🧑", title: "Jovem", description: "Domine orçamentos, poupança e dê os primeiros passos em investimentos", color: "from-primary/20 to-accent/20" },
  { emoji: "👨‍👩‍👧", title: "Pais", description: "Planeamento financeiro familiar completo com gestão de stock", color: "from-purple-500/20 to-pink-500/20" },
];

const AI_BENEFITS = [
  { icon: Target, title: "Gestão Inteligente de Gastos", description: "Analise despesas automaticamente e receba recomendações personalizadas para poupar mais" },
  { icon: TrendingUp, title: "Investimentos Simplificados", description: "Sugestões de investimento adaptadas ao seu perfil financeiro de forma segura" },
  { icon: Shield, title: "Segurança e Privacidade", description: "Criptografia total e proteção dos seus dados financeiros" },
];

const TESTIMONIALS = [
  { name: "Ana Silva", role: "Mãe e Empreendedora", feedback: "Com a Fivora AI, consegui ensinar meus filhos a poupar e ainda gerenciar meu próprio orçamento de forma prática." },
  { name: "Miguel Santos", role: "Estudante Universitário", feedback: "O Agente Financeiro AI me ajudou a controlar meus gastos e iniciar investimentos com confiança." },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-hidden">

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px]" />
          <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[80px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <motion.img src={logo} alt="Fivora AI" className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-6" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1, duration: 0.5 }} />

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Educação Financeira Gamificada</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6">
              Aprenda <span className="text-gradient">Finanças</span> de forma divertida
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Aulas interativas, quizzes desafiantes e gamificação para transformar a forma como gere o seu dinheiro
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="gradient" size="xl" asChild>
                <Link to="/register">Começar Grátis <ChevronRight className="w-5 h-5 ml-2" /></Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link to="/login">Já tenho conta</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Porque escolher a <span className="text-gradient">Fivora AI</span>?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Uma plataforma completa para aprender a gerir dinheiro de forma inteligente</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature, index) => (
              <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 hover:shadow-glow-sm transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Financial Agent Section */}
      <section className="py-20 px-4 bg-background/50">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <Sparkles className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Agente Financeiro <span className="text-gradient">AI</span></h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Seu consultor financeiro digital, disponível 24/7, que analisa seus gastos, sugere investimentos e ajuda a controlar seu orçamento de forma inteligente.
            </p>
            <Button variant="gradient" size="lg" asChild>
              <Link to="/ai-agent">Experimente o Agente AI <ChevronRight className="w-5 h-5 ml-2" /></Link>
            </Button>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {AI_BENEFITS.map((benefit, index) => (
              <motion.div key={benefit.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 hover:shadow-glow-sm transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Profiles Section */}
      <section className="py-20 px-4 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Conteúdo para <span className="text-gradient">cada perfil</span></h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Escolha o seu perfil e aprenda com conteúdo adaptado às suas necessidades</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {PROFILES.map((profile, index) => (
              <motion.div key={profile.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className={`relative overflow-hidden bg-gradient-to-br ${profile.color} border border-border rounded-2xl p-8 text-center`}>
                <div className="text-5xl mb-4">{profile.emoji}</div>
                <h3 className="font-display font-bold text-xl mb-2">{profile.title}</h3>
                <p className="text-muted-foreground text-sm">{profile.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-4xl font-display font-bold mb-12">O que dizem sobre a Fivora AI</motion.h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {TESTIMONIALS.map((t, index) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="bg-card border border-border rounded-2xl p-8">
                <p className="text-muted-foreground mb-4">"{t.feedback}"</p>
                <p className="font-bold">{t.name}</p>
                <p className="text-sm text-muted-foreground">{t.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-primary/20 via-card to-accent/10 border border-border rounded-3xl p-8 md:p-12">
            <TrendingUp className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Pronto para transformar suas finanças?</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">Junte-se a milhares de pessoas que já estão a aprender a gerir dinheiro de forma inteligente.</p>
            <Button variant="gradient" size="xl" asChild>
              <Link to="/register">Criar Conta Grátis <ChevronRight className="w-5 h-5 ml-2" /></Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Fivora AI" className="w-8 h-8" />
            <span className="font-display font-bold text-gradient">Fivora AI</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/login" className="hover:text-primary transition-colors">Login</Link>
            <Link to="/register" className="hover:text-primary transition-colors">Registar</Link>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4" />
            <span>Dados seguros e privados</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Index;
