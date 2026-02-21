import { useState, useEffect } from "react";
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

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const passwordChecks = [
  { label: "Mínimo 8 caracteres", test: (p: string) => p.length >= 8 },
  { label: "Uma letra maiúscula", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Uma letra minúscula", test: (p: string) => /[a-z]/.test(p) },
  { label: "Um número", test: (p: string) => /[0-9]/.test(p) },
  { label: "Um carácter especial", test: (p: string) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p) },
];

const sanitizeInput = (value: string): string => {
  return value.replace(/[<>]/g, '').trim();
};

const Register = () => {
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

  // Lógica para definir o perfil automaticamente com base na idade
  useEffect(() => {
    const ageNum = parseInt(age);
    if (!isNaN(ageNum)) {
      if (ageNum < 13) {
        setProfile("crianca");
      } else if (ageNum >= 13 && ageNum <= 18) {
        setProfile("jovem");
      } else {
        setProfile("pais");
      }
    } else {
      setProfile(null);
    }
  }, [age]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!emailRegex.test(email)) {
      newErrors.email = "Insira um email válido (ex: nome@gmail.com)";
    }

    if (username.trim().length < 3) {
      newErrors.username = "Nome de utilizador deve ter pelo menos 3 caracteres";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;
    if (!profile) return;

    setIsLoading(true);

    const result = await register({
      email,
      username,
      password,
      age: parseInt(age),
      profile,
    });

    if (result.success) {
      toast({ title: "Conta criada!", description: "Bem-vindo ao Fivora AI!" });
      navigate("/dashboard");
    } else {
      toast({ title: "Erro", description: result.error || "Não foi possível criar a conta.", variant: "destructive" });
    }

    setIsLoading(false);
  };

  // Ícone visual do perfil baseado na idade
  const ProfileBadge = () => {
    if (!profile) return null;
    const icons = {
      crianca: { icon: Baby, label: "Perfil Criança", color: "text-blue-500" },
      jovem: { icon: GraduationCap, label: "Perfil Jovem", color: "text-green-500" },
      pais: { icon: Users, label: "Perfil Pais/Adulto", color: "text-purple-500" },
    };
    const active = icons[profile as keyof typeof icons];
    return (
      <div className={cn("flex items-center gap-2 mt-2 p-2 rounded-lg bg-primary/5 border border-primary/10", active.color)}>
        <active.icon className="w-4 h-4" />
        <span className="text-xs font-semibold uppercase tracking-wider">{active.label} detectado</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <a href="#"><motion.img src={logo} alt="Finance" className="w-20 h-20 mb-4" /></a>
          <h1 className="text-3xl font-display font-bold text-gradient">Fivora AI</h1>
          <p className="text-muted-foreground mt-1">Crie sua conta personalizada</p>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          className="glass rounded-2xl p-6 md:p-8 space-y-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: "" })); }}
                className={cn("pl-10", errors.email && "border-destructive")}
                required
              />
            </div>
            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
          </div>

          {/* Username */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Nome de utilizador</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Ex: FinancePro"
                value={username}
                onChange={(e) => { setUsername(sanitizeInput(e.target.value)); setErrors((p) => ({ ...p, username: "" })); }}
                className={cn("pl-10", errors.username && "border-destructive")}
                required
              />
            </div>
          </div>

          {/* Age & Auto-Profile Detection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Idade</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="number"
                placeholder="Sua idade"
                value={age}
                onChange={(e) => { setAge(e.target.value); setErrors((p) => ({ ...p, age: "" })); }}
                className={cn("pl-10", errors.age && "border-destructive")}
                required
              />
            </div>
            {errors.age && <p className="text-xs text-destructive">{errors.age}</p>}
            <ProfileBadge />
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
                className={cn("pl-10", errors.password && "border-destructive")}
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
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
                onChange={(e) => { setConfirmPassword(e.target.value); setErrors((p) => ({ ...p, confirmPassword: "" })); }}
                className={cn("pl-10", errors.confirmPassword && "border-destructive")}
                required
              />
            </div>
          </div>

          <Button type="submit" variant="gradient" size="lg" className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Criar Conta"}
          </Button>
        </motion.form>

        <p className="text-center mt-6 text-muted-foreground">
          Já tem conta? <Link to="/login" className="text-primary font-medium hover:underline">Entrar</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;