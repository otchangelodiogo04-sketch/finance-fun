import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Users, TrendingUp, BookOpen, Loader2, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ProfileRow {
  user_id: string;
  username: string;
  email: string;
  points: number;
  rank: string;
  lessons_completed: number;
  profile_type: string;
  created_at: string;
}

const getRankColor = (rank: string) => {
  switch (rank) {
    case "S": return "bg-rank-s text-white";
    case "A": return "bg-rank-a text-primary-foreground";
    case "B": return "bg-rank-b text-primary-foreground";
    case "C": return "bg-rank-c text-primary-foreground";
    default: return "bg-rank-d text-white";
  }
};

const AdminDashboard = () => {
  const [users, setUsers] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("user_id, username, email, points, rank, lessons_completed, profile_type, created_at")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setUsers(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const totalUsers = users.length;
  const totalPoints = users.reduce((acc, u) => acc + u.points, 0);
  const totalLessons = users.reduce((acc, u) => acc + u.lessons_completed, 0);

  const stats = [
    { label: "Total Utilizadores", value: totalUsers, icon: Users, color: "text-primary" },
    { label: "Pontos Totais", value: totalPoints.toLocaleString(), icon: TrendingUp, color: "text-success" },
    { label: "Aulas Completadas", value: totalLessons, icon: BookOpen, color: "text-info" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-destructive/20 flex items-center justify-center">
          <Shield className="w-6 h-6 text-destructive" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold">Painel Admin</h1>
          <p className="text-muted-foreground text-sm">Gestão de utilizadores e estatísticas</p>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={cn("w-5 h-5", stat.color)} />
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </div>
            <p className="text-2xl font-display font-bold">{stat.value}</p>
          </div>
        ))}
      </motion.div>

      {/* Users table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Utilizadores ({totalUsers})
        </h2>

        <div className="space-y-2">
          {users.map((u, index) => (
            <motion.div
              key={u.user_id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.03 }}
              className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl"
            >
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <Users className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{u.username}</p>
                <p className="text-sm text-muted-foreground truncate">{u.email}</p>
              </div>
              <div className="hidden sm:block text-sm text-muted-foreground">
                {u.profile_type}
              </div>
              <div className="text-right">
                <p className="font-semibold">{u.points} pts</p>
                <span className={cn("px-2 py-0.5 rounded text-xs font-semibold", getRankColor(u.rank))}>
                  {u.rank}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {users.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>Nenhum utilizador registado.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
