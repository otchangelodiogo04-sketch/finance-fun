import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Calendar, Loader2, Baby, GraduationCap, Users, AlertCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth, UserProfile } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { lovable } from "@/integrations/lovable/index";
import logo from "@/assets/logo.png";
import { cn } from "@/lib/utils";

const PROFILES: { id: UserProfile; label: string; icon: typeof Baby; description: string }[] = [
  { id: "crianca", label: "Criança", icon: Baby, description: "Conteúdo simples e lúdico" },
  { id: "jovem", label: "Jovem", icon: GraduationCap, description: "Finanças pessoais + investimentos" },
  { id: "pais", label: "Pais", icon: Users, description: "Gestão familiar + stock" },
];

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const passwordChecks = [
  { label: "Mínimo 8 caracteres", test: (p: string) => p.length >= 8 },
  { label: "Uma letra maiúscula", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Uma letra minúscula", test: (p: string) => /[a-z]/.test(p) },
  { label: "Um número", test: (p: string) => /[0-9]/.test(p) },
  { label: "Um carácter especial", test: (p: string) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p) },
];

// Sanitize input to prevent XSS
const sanitizeInput = (value: string): string => {
  return value.replace(/[<>]/g, '').trim();
};

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
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!emailRegex.test(email)) {
      newErrors.email = "Insira um email válido (ex: nome@gmail.com)";
    }

    if (username.trim().length < 3) {
      newErrors.username = "Nome de utilizador deve ter pelo menos 3 caracteres";
    } else if (username.length > 20) {
      newErrors.username = "Nome de utilizador deve ter no máximo 20 caracteres";
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      newErrors.username = "Apenas letras, números e underscore";
    }

    const allPasswordChecksPass = passwordChecks.every((c) => c.test(password));
    if (!allPasswordChecksPass) {
      newErrors.password = "A senha não cumpre os requisitos";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem";
    }

    const ageNum = parseInt(age);
    if (!age || isNaN(ageNum) || ageNum < 5 || ageNum > 100) {
      newErrors.age = "Idade deve ser entre 5 e 100 anos";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGoogleSignIn = async () => {
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      if (!validateStep1()) return;
      setStep(2);
      return;
    }

    if (!profile) {
      toast({ title: "Erro", description: "Selecione um perfil.", variant: "destructive" });
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
        toast({ title: "Conta criada!", description: result.error });
        navigate("/login");
      } else {
        toast({ title: "Conta criada!", description: "Bem-vindo ao Finance!" });
        navigate("/dashboard");
      }
    } else {
      toast({ title: "Erro", description: result.error || "Não foi possível criar a conta.", variant: "destructive" });
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
          <motion.img src={logo} alt="Finance" className="w-20 h-20 mb-4" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} />
          <h1 className="text-3xl font-display font-bold text-gradient">Finance</h1>
          <p className="text-muted-foreground mt-1">Criar nova conta</p>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2].map((s) => (
            <div key={s} className={cn("w-3 h-3 rounded-full transition-all duration-300", step >= s ? "bg-primary" : "bg-card")} />
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
                    onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: "" })); }}
                    className={cn("pl-10", errors.email && "border-destructive")}
                    required
                  />
                </div>
                {errors.email && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.email}</p>}
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
                    onChange={(e) => { setUsername(sanitizeInput(e.target.value)); setErrors((p) => ({ ...p, username: "" })); }}
                    className={cn("pl-10", errors.username && "border-destructive")}
                    required
                    maxLength={20}
                  />
                </div>
                {errors.username && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.username}</p>}
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
                    onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: "" })); }}
                    className={cn("pl-10 pr-10", errors.password && "border-destructive")}
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {/* Password strength indicators */}
                {password.length > 0 && (
                  <div className="grid grid-cols-2 gap-1 mt-1">
                    {passwordChecks.map((check) => (
                      <div key={check.label} className={cn("text-xs flex items-center gap-1", check.test(password) ? "text-green-500" : "text-muted-foreground")}>
                        {check.test(password) ? <Check className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        {check.label}
                      </div>
                    ))}
                  </div>
                )}
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
                    onChange={(e) => { setConfirmPassword(e.target.value); setErrors((p) => ({ ...p, confirmPassword: "" })); }}
                    className={cn("pl-10", errors.confirmPassword && "border-destructive")}
                    required
                  />
                </div>
                {errors.confirmPassword && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.confirmPassword}</p>}
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
                    onChange={(e) => { setAge(e.target.value); setErrors((p) => ({ ...p, age: "" })); }}
                    className={cn("pl-10", errors.age && "border-destructive")}
                    required
                    min={5}
                    max={100}
                  />
                </div>
                {errors.age && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.age}</p>}
              </div>

              <Button type="submit" variant="gradient" size="lg" className="w-full">
                Continuar
              </Button>

              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                <div className="relative flex justify-center text-xs"><span className="bg-card px-2 text-muted-foreground">ou</span></div>
              </div>

              {/* Google Sign In */}
              <Button type="button" variant="outline" size="lg" className="w-full gap-2" onClick={handleGoogleSignIn}>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continuar com Google
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
                        profile === p.id ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/50"
                      )}
                    >
                      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", profile === p.id ? "bg-primary text-primary-foreground" : "bg-muted")}>
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
                <Button type="button" variant="outline" size="lg" className="flex-1" onClick={() => setStep(1)}>
                  Voltar
                </Button>
                <Button type="submit" variant="gradient" size="lg" className="flex-1" disabled={isLoading || !profile}>
                  {isLoading ? (<><Loader2 className="w-5 h-5 animate-spin" />A criar...</>) : "Criar Conta"}
                </Button>
              </div>
            </>
          )}
        </motion.form>

        {/* Login link */}
        <p className="text-center mt-6 text-muted-foreground">
          Já tem conta?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">Entrar</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
