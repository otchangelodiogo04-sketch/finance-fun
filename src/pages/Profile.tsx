import { useState } from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Camera, 
  Save, 
  Trophy, 
  BookOpen, 
  Star,
  MapPin,
  Heart,
  Sparkles,
  Loader2
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    address: user?.address || "",
    hobbies: user?.hobbies || "",
    interests: user?.interests || "",
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Formato inválido",
        description: "Apenas JPG, PNG ou WEBP são aceites.",
        variant: "destructive",
      });
      return;
    }

    // Convert to base64 for demo (in production, upload to storage)
    const reader = new FileReader();
    reader.onload = (event) => {
      updateUser({ avatar: event.target?.result as string });
      toast({ title: "Foto atualizada!" });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    updateUser(formData);
    setIsEditing(false);
    setIsSaving(false);
    toast({ title: "Perfil atualizado!" });
  };

  const getRankColor = (rank: string) => {
    switch (rank) {
      case "S": return "from-rank-s to-purple-400";
      case "A": return "from-rank-a to-emerald-300";
      case "B": return "from-rank-b to-yellow-300";
      case "C": return "from-rank-c to-orange-300";
      default: return "from-rank-d to-gray-400";
    }
  };

  const getProfileLabel = (profile: string) => {
    switch (profile) {
      case "crianca": return "👶 Criança";
      case "jovem": return "🧑 Jovem";
      case "pais": return "👨‍👩‍👧 Pais";
      default: return profile;
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-card to-card-elevated border border-border"
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative p-6">
          {/* Avatar section */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group">
              <div className={cn(
                "w-28 h-28 rounded-2xl bg-gradient-to-br p-1",
                getRankColor(user?.rank || "D")
              )}>
                <div className="w-full h-full rounded-xl bg-card flex items-center justify-center overflow-hidden">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-muted-foreground" />
                  )}
                </div>
              </div>
              <label className="absolute inset-0 flex items-center justify-center bg-background/80 opacity-0 group-hover:opacity-100 rounded-2xl cursor-pointer transition-opacity">
                <Camera className="w-8 h-8 text-primary" />
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-display font-bold">{user?.username}</h1>
              <p className="text-muted-foreground">{user?.email}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3">
                <span className="bg-primary/20 text-primary px-3 py-1 rounded-lg text-sm font-medium">
                  {getProfileLabel(user?.profile || "")}
                </span>
                <span className="text-sm text-muted-foreground">
                  {user?.age} anos
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-card/60 backdrop-blur rounded-xl p-4 text-center">
              <Trophy className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-xl font-bold">{user?.rank}</p>
              <p className="text-xs text-muted-foreground">Rank</p>
            </div>
            <div className="bg-card/60 backdrop-blur rounded-xl p-4 text-center">
              <Star className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-xl font-bold">{user?.points}</p>
              <p className="text-xs text-muted-foreground">Pontos</p>
            </div>
            <div className="bg-card/60 backdrop-blur rounded-xl p-4 text-center">
              <BookOpen className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-xl font-bold">{user?.lessonsCompleted}</p>
              <p className="text-xs text-muted-foreground">Aulas</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Edit profile form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-display font-semibold">Informações Pessoais</h2>
          {!isEditing && (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              Editar
            </Button>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <User className="w-4 h-4" />
              Nome Completo
            </label>
            {isEditing ? (
              <Input
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="O teu nome completo"
              />
            ) : (
              <p className="text-muted-foreground px-4 py-2">
                {formData.fullName || "Não definido"}
              </p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <MapPin className="w-4 h-4" />
              Morada
            </label>
            {isEditing ? (
              <Input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="A tua cidade ou país"
              />
            ) : (
              <p className="text-muted-foreground px-4 py-2">
                {formData.address || "Não definido"}
              </p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <Heart className="w-4 h-4" />
              Hobbies
            </label>
            {isEditing ? (
              <Input
                value={formData.hobbies}
                onChange={(e) => setFormData({ ...formData, hobbies: e.target.value })}
                placeholder="Os teus passatempos favoritos"
              />
            ) : (
              <p className="text-muted-foreground px-4 py-2">
                {formData.hobbies || "Não definido"}
              </p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <Sparkles className="w-4 h-4" />
              Interesses
            </label>
            {isEditing ? (
              <Input
                value={formData.interests}
                onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                placeholder="O que te interessa aprender"
              />
            ) : (
              <p className="text-muted-foreground px-4 py-2">
                {formData.interests || "Não definido"}
              </p>
            )}
          </div>

          {isEditing && (
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsEditing(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="gradient"
                className="flex-1"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    A guardar...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Guardar
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
