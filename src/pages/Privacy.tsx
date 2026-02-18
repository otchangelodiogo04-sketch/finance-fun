import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">

      {/* Header */}
      <header className="py-8 px-6 border-b border-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/">
            <div className="flex items-center gap-2">
              <img src={logo} alt="Fivora AI" className="w-10 h-10" />
              <span className="font-display font-bold text-gradient">Fivora AI</span>
            </div>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-24 px-6 text-center">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold font-display mb-4">
          Política de Privacidade
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-muted-foreground max-w-2xl mx-auto">
          Protegemos os seus dados e respeitamos a sua privacidade. Esta página explica como coletamos, usamos e armazenamos informações pessoais.
        </motion.p>
      </section>

      {/* Content */}
      <section className="py-16 px-6 max-w-5xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="text-2xl font-bold mb-2">Informações que coletamos</h2>
          <p className="text-muted-foreground">Coletamos informações que você fornece diretamente, como nome, email e dados de pagamento, além de dados de uso da plataforma para melhorar sua experiência.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-2xl font-bold mb-2">Como usamos seus dados</h2>
          <p className="text-muted-foreground">Usamos os dados para fornecer o serviço, personalizar sua experiência, enviar notificações e garantir segurança e prevenção de fraudes.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="text-2xl font-bold mb-2">Segurança e proteção</h2>
          <p className="text-muted-foreground">Todos os dados são criptografados e armazenados com segurança. Nunca compartilhamos informações sem consentimento explícito.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h2 className="text-2xl font-bold mb-2">Seus direitos</h2>
          <p className="text-muted-foreground">Você pode acessar, corrigir ou excluir suas informações a qualquer momento. Entre em contato com nosso suporte para exercer seus direitos.</p>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 text-center">
        <Button variant="gradient" size="xl" asChild>
          <Link to="/">Voltar para a Home <ChevronRight className="w-5 h-5 ml-2" /></Link>
        </Button>
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

export default Privacy;
