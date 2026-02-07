import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Users, TrendingUp, BookOpen, Loader2, BarChart3, Clock, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

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
  const activeUsers = users.filter(u => u.points > 0).length;
  const avgPoints = totalUsers > 0 ? Math.round(totalPoints / totalUsers) : 0;

  // Rank distribution
  const rankDistribution = users.reduce((acc, u) => {
    acc[u.rank] = (acc[u.rank] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Profile type distribution
  const profileDistribution = users.reduce((acc, u) => {
    acc[u.profile_type] = (acc[u.profile_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Recent users (last 7 days)
  const recentUsers = users.filter(u => {
    const created = new Date(u.created_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return created >= weekAgo;
  });

  const stats = [
    { label: "Total Utilizadores", value: totalUsers, icon: Users, color: "text-primary" },
    { label: "Utilizadores Ativos", value: activeUsers, icon: TrendingUp, color: "text-success" },
    { label: "Pontos Totais", value: totalPoints.toLocaleString(), icon: Award, color: "text-warning" },
    { label: "Aulas Completadas", value: totalLessons, icon: BookOpen, color: "text-info" },
    { label: "Média de Pontos", value: avgPoints, icon: BarChart3, color: "text-accent" },
    { label: "Novos (7 dias)", value: recentUsers.length, icon: Clock, color: "text-primary" },
  ];

  const rankOrder = ["S", "A", "B", "C", "D"];
  const rankColors: Record<string, string> = {
    S: "bg-rank-s", A: "bg-rank-a", B: "bg-rank-b", C: "bg-rank-c", D: "bg-rank-d"
  };

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
          <p className="text-muted-foreground text-sm">Gestão e estatísticas da aplicação</p>
        </div>
      </motion.div>

      {/* Stats grid */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={cn("w-4 h-4", stat.color)} />
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
            <p className="text-xl font-display font-bold">{stat.value}</p>
          </div>
        ))}
      </motion.div>

      {/* Distributions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Rank distribution */}
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <Award className="w-4 h-4 text-primary" /> Distribuição por Rank
          </h3>
          <div className="space-y-2">
            {rankOrder.map(rank => {
              const count = rankDistribution[rank] || 0;
              const pct = totalUsers > 0 ? (count / totalUsers) * 100 : 0;
              return (
                <div key={rank} className="flex items-center gap-2">
                  <span className={cn("w-7 h-7 rounded text-xs font-bold flex items-center justify-center text-white", rankColors[rank])}>{rank}</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full", rankColors[rank])} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-muted-foreground w-8 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Profile type distribution */}
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" /> Tipo de Perfil
          </h3>
          <div className="space-y-3">
            {Object.entries(profileDistribution).map(([type, count]) => {
              const pct = totalUsers > 0 ? (count / totalUsers) * 100 : 0;
              return (
                <div key={type} className="flex items-center gap-3">
                  <span className="text-sm capitalize w-16">{type}</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-muted-foreground">{count} ({Math.round(pct)}%)</span>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Users table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Todos os Utilizadores ({totalUsers})
        </h2>

        <div className="space-y-2">
          {users.map((u, index) => (
            <motion.div
              key={u.user_id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.03 }}
              className="flex items-center gap-3 p-3 bg-card border border-border rounded-xl"
            >
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{u.username}</p>
                <p className="text-xs text-muted-foreground truncate">{u.email}</p>
              </div>
              <div className="hidden sm:block text-xs text-muted-foreground capitalize">
                {u.profile_type}
              </div>
              <div className="hidden sm:block text-xs text-muted-foreground">
                {u.lessons_completed} aulas
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">{u.points} pts</p>
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
