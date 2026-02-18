import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  BookOpen, Trophy, Target, Users, ChevronRight, Sparkles, TrendingUp, Shield, Star, HelpCircle, UserCheck, BarChart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

// Screenshots
import dashboardImg from "@/assets/screens/dashboard.png";
import rankingImg from "@/assets/screens/ranking.png";
import agentImg from "@/assets/screens/agent.png";
import quizImg from "@/assets/screens/quiz.png";

// Features
const FEATURES = [
  { icon: BookOpen, title: "Aulas Interativas", description: "Aprenda finanças com conteúdo prático e exemplos do dia-a-dia" },
  { icon: Trophy, title: "Gamificação", description: "Ganhe pontos, suba de rank e compete no ranking global" },
  { icon: Target, title: "Progressão", description: "Avance pelos módulos e desbloqueie novos conteúdos" },
  { icon: Users, title: "Para Todos", description: "Conteúdo adaptado para crianças, jovens e famílias" },
];

// Perfis
const PROFILES = [
  { emoji: "👶", title: "Criança", description: "Aprenda a poupar e gastar com consciência de forma divertida", color: "from-blue-500/20 to-cyan-500/20" },
  { emoji: "🧑", title: "Jovem", description: "Domine orçamentos, poupança e dê os primeiros passos em investimentos", color: "from-primary/20 to-accent/20" },
  { emoji: "👨‍👩‍👧", title: "Pais", description: "Planeamento financeiro familiar completo com gestão de stock", color: "from-purple-500/20 to-pink-500/20" },
];

// Benefícios AI
const AI_BENEFITS = [
  { icon: Target, title: "Gestão Inteligente de Gastos", description: "Analise despesas automaticamente e receba recomendações personalizadas para poupar mais" },
  { icon: TrendingUp, title: "Investimentos Simplificados", description: "Sugestões de investimento adaptadas ao seu perfil financeiro de forma segura" },
  { icon: Shield, title: "Segurança e Privacidade", description: "Criptografia total e proteção dos seus dados financeiros" },
];

// Depoimentos
const TESTIMONIALS = [
  { name: "Ana Silva", role: "Mãe e Empreendedora", feedback: "Com a Fivora AI, consegui ensinar meus filhos a poupar e ainda gerenciar meu próprio orçamento de forma prática." },
  { name: "Miguel Santos", role: "Estudante Universitário", feedback: "O Agente Financeiro AI me ajudou a controlar meus gastos e iniciar investimentos com confiança." },
  { name: "Sofia Costa", role: "Professora", feedback: "Os módulos gamificados tornam a aprendizagem de finanças divertida e eficaz para meus alunos." },
];

// FAQ
const FAQS = [
  { question: "Como funciona o Agente Financeiro AI?", answer: "Ele analisa automaticamente suas transações, sugere investimentos e ajuda a manter o orçamento equilibrado." },
  { question: "A Fivora AI é segura?", answer: "Sim! Todos os dados são criptografados e nunca compartilhados sem autorização." },
  { question: "Posso usar no celular?", answer: "Sim, a plataforma é totalmente responsiva e pode ser acessada de qualquer dispositivo." },
  { question: "Quais formas de pagamento estão disponíveis?", answer: "Aceitamos cartões, débito direto e soluções digitais compatíveis com o país do usuário." },
  { question: "É possível acompanhar minha evolução?", answer: "Sim! O Dashboard mostra progresso, rankings e conquistas de forma clara e visual." },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-32 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1000px] h-[800px] bg-primary/10 rounded-full blur-[200px]" />
          <div className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-accent/10 rounded-full blur-[160px]" />
          <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center space-y-8">
          <motion.img src={logo} alt="Fivora AI" className="w-28 h-28 md:w-36 md:h-36 mx-auto" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }} />
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mx-auto">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">Educação Financeira Gamificada</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-4xl md:text-6xl lg:text-7xl font-bold font-display">
            Aprenda <span className="text-gradient">Finanças</span> de forma divertida
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Aulas interativas, quizzes desafiantes, gamificação e o Agente Financeiro AI para transformar sua relação com dinheiro.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="gradient" size="xl" asChild>
              <Link to="/register">Começar Grátis <ChevronRight className="w-5 h-5 ml-2" /></Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <Link to="/login">Já tenho conta</Link>
            </Button>
          </motion.div>

          {/* Hero Screenshots */}
          <div className="relative mt-20 flex justify-center items-center gap-6">
            <motion.img src={dashboardImg} alt="Dashboard" className="rounded-3xl shadow-2xl w-80 md:w-96 z-20" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} />
            <motion.img src={rankingImg} alt="Ranking" className="rounded-3xl shadow-2xl w-72 md:w-80 absolute -right-16 top-12 z-10" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} />
            <motion.img src={quizImg} alt="Quiz" className="rounded-3xl shadow-2xl w-64 md:w-72 absolute -left-16 bottom-0 z-0" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-28 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-12">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-4xl font-bold font-display">
            Recursos da <span className="text-gradient">Fivora AI</span>
          </motion.h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Tudo o que você precisa para aprender, competir e controlar suas finanças de forma divertida.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i*0.1 }} className="bg-card border border-border rounded-3xl p-6 hover:border-primary/50 hover:shadow-glow transition-all duration-300">
                <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* User Profiles */}
      <section className="py-28 px-6 bg-background/50">
        <div className="max-w-7xl mx-auto text-center space-y-12">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-4xl font-bold font-display">
            Conteúdo para <span className="text-gradient">cada perfil</span>
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {PROFILES.map((p, i) => (
              <motion.div key={p.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i*0.1 }} className={`relative overflow-hidden bg-gradient-to-br ${p.color} border border-border rounded-3xl p-8 text-center`}>
                <div className="text-5xl mb-4">{p.emoji}</div>
                <h3 className="font-bold text-xl mb-2">{p.title}</h3>
                <p className="text-muted-foreground text-sm">{p.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Agent */}
      <section className="py-28 px-6 bg-card/50">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-6">
            <Star className="w-16 h-16 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold font-display">Agente Financeiro <span className="text-gradient">AI</span></h2>
            <p className="text-muted-foreground">
              Seu consultor digital 24/7. Analisa gastos, sugere investimentos, cria alertas e ajuda a controlar orçamento de forma inteligente.
            </p>
            <div className="grid md:grid-cols-1 gap-6 mt-6">
              {AI_BENEFITS.map((b, i) => (
                <motion.div key={b.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i*0.1 }} className="bg-background/70 border border-border rounded-2xl p-6 flex items-start gap-4 hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <b.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{b.title}</h3>
                    <p className="text-muted-foreground text-sm">{b.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <Button variant="gradient" size="lg" asChild className="mt-8">
              <Link to="https://fun-ai-nine.vercel.app/">Experimente o Agente AI <ChevronRight className="w-5 h-5 ml-2" /></Link>
            </Button>
          </motion.div>
          <motion.img src={agentImg} alt="Agente AI" className="rounded-3xl shadow-2xl w-full" initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-28 px-6 bg-background/50">
        <div className="max-w-6xl mx-auto text-center space-y-12">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-4xl font-bold font-display">
            O que nossos usuários dizem
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i*0.1 }} className="bg-card border border-border rounded-3xl p-6">
                <p className="text-muted-foreground italic mb-4">"{t.feedback}"</p>
                <h4 className="font-bold">{t.name}</h4>
                <span className="text-sm text-muted-foreground">{t.role}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-28 px-6 bg-background/30">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-4xl font-bold font-display">Perguntas Frequentes</motion.h2>
          <div className="space-y-6 text-left">
            {FAQS.map((faq, i) => (
              <motion.div key={faq.question} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i*0.1 }} className="bg-card border border-border rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-2">
                  <HelpCircle className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">{faq.question}</h3>
                </div>
                <p className="text-muted-foreground">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-28 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-primary/20 via-card to-accent/10 border border-border rounded-3xl p-10 md:p-16">
            <TrendingUp className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">Pronto para transformar suas finanças?</h2>
            <p className="text-muted-foreground mb-8">Junte-se a milhares de pessoas que já estão a aprender a gerir dinheiro de forma inteligente.</p>
            <Button variant="gradient" size="xl" asChild>
              <Link to="/register">Criar Conta Grátis <ChevronRight className="w-5 h-5 ml-2" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border bg-background/70">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Fivora AI" className="w-10 h-10" />
            <span className="font-display font-bold text-gradient">Fivora AI</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/login" className="hover:text-primary transition-colors">Login</Link>
            <Link to="/register" className="hover:text-primary transition-colors">Registar</Link>
            <Link to="/privacy" className="hover:text-primary transition-colors">Privacidade</Link>
            <Link to="/terms" className="hover:text-primary transition-colors">Termos</Link>
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
