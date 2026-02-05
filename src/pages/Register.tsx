import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Calendar, Loader2, Baby, GraduationCap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth, UserProfile } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";
import { cn } from "@/lib/utils";

const PROFILES: { id: UserProfile; label: string; icon: typeof Baby; description: string }[] = [
  { id: "crianca", label: "Criança", icon: Baby, description: "Conteúdo simples e lúdico" },
  { id: "jovem", label: "Jovem", icon: GraduationCap, description: "Finanças pessoais + investimentos" },
  { id: "pais", label: "Pais", icon: Users, description: "Gestão familiar + stock" },
];

const Register = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [age, setAge] = useState("");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      if (password !== confirmPassword) {
        toast({
          title: "Erro",
          description: "As senhas não coincidem.",
          variant: "destructive",
        });
        return;
      }
      setStep(2);
      return;
    }

    if (!profile) {
      toast({
        title: "Erro",
        description: "Selecione um perfil.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const result = await register({
      email,
      username,
      password,
      age: parseInt(age),
      profile,
    });

    if (result.success) {
      if (result.error) {
        // Email confirmation required
        toast({
          title: "Conta criada!",
          description: result.error,
        });
        navigate("/login");
      } else {
        toast({
          title: "Conta criada!",
          description: "Bem-vindo ao Finance!",
        });
        navigate("/dashboard");
      }
    } else {
      toast({
        title: "Erro",
        description: result.error || "Não foi possível criar a conta.",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <motion.img
            src={logo}
            alt="Finance"
            className="w-20 h-20 mb-4"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          />
          <h1 className="text-3xl font-display font-bold text-gradient">Finance</h1>
          <p className="text-muted-foreground mt-1">Criar nova conta</p>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                step >= s ? "bg-primary" : "bg-card"
              )}
            />
          ))}
        </div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="glass rounded-2xl p-6 md:p-8 space-y-5"
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          {step === 1 ? (
            <>
              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="seu@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Username */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome de utilizador</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="FinancePro"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Confirmar senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Age */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Idade</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="number"
                    placeholder="25"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="pl-10"
                    required
                    min={5}
                    max={100}
                  />
                </div>
              </div>

              <Button type="submit" variant="gradient" size="lg" className="w-full">
                Continuar
              </Button>
            </>
          ) : (
            <>
              {/* Profile selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Escolha o seu perfil</label>
                <div className="space-y-3">
                  {PROFILES.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setProfile(p.id)}
                      className={cn(
                        "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200",
                        profile === p.id
                          ? "border-primary bg-primary/10"
                          : "border-border bg-card hover:border-primary/50"
                      )}
                    >
                      <div
                        className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center",
                          profile === p.id ? "bg-primary text-primary-foreground" : "bg-muted"
                        )}
                      >
                        <p.icon className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold">{p.label}</p>
                        <p className="text-sm text-muted-foreground">{p.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  onClick={() => setStep(1)}
                >
                  Voltar
                </Button>
                <Button
                  type="submit"
                  variant="gradient"
                  size="lg"
                  className="flex-1"
                  disabled={isLoading || !profile}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      A criar...
                    </>
                  ) : (
                    "Criar Conta"
                  )}
                </Button>
              </div>
            </>
          )}
        </motion.form>

        {/* Login link */}
        <p className="text-center mt-6 text-muted-foreground">
          Já tem conta?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Entrar
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
