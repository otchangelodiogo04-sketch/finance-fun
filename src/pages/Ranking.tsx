import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Crown, TrendingUp, Users, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface RankingPlayer {
  user_id: string;
  username: string;
  points: number;
  rank: string;
  lessons_completed: number;
  profile_type: string;
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

const getRankBorder = (rank: string) => {
  switch (rank) {
    case "S": return "border-rank-s";
    case "A": return "border-rank-a";
    case "B": return "border-rank-b";
    case "C": return "border-rank-c";
    default: return "border-rank-d";
  }
};

const Ranking = () => {
  const { user } = useAuth();
  const [players, setPlayers] = useState<RankingPlayer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRanking = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("user_id, username, points, rank, lessons_completed, profile_type")
        .order("points", { ascending: false });

      if (!error && data) {
        setPlayers(data);
      }
      setLoading(false);
    };
    fetchRanking();
  }, []);

  const userPosition = players.findIndex(r => r.user_id === user?.id) + 1;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 mb-4">
          <Trophy className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-display font-bold mb-2">Ranking Global</h1>
        <p className="text-muted-foreground">Compete com outros utilizadores!</p>
      </motion.div>

      {/* User position card */}
      {user && userPosition > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className={cn("bg-gradient-to-r from-primary/20 to-accent/10 border-2 rounded-2xl p-4", getRankBorder(user.rank))}
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-card flex items-center justify-center font-display font-bold text-xl">
              #{userPosition}
            </div>
            <div className="flex-1">
              <p className="font-semibold">{user.username} (Tu)</p>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><TrendingUp className="w-4 h-4" />{user.points} pts</span>
                <span className={cn("px-2 py-0.5 rounded font-semibold text-xs", getRankColor(user.rank))}>Rank {user.rank}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Top 3 podium */}
      {players.length >= 3 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex items-end justify-center gap-3 py-4">
          {/* 2nd place */}
          <div className="text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-card border-2 border-muted-foreground/30 flex items-center justify-center mb-2">
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="font-semibold text-sm truncate max-w-[80px]">{players[1]?.username}</p>
            <p className="text-xs text-muted-foreground">{players[1]?.points} pts</p>
            <div className="mt-2 w-16 h-16 mx-auto bg-muted rounded-t-lg flex items-center justify-center">
              <span className="font-display font-bold text-2xl text-muted-foreground">2</span>
            </div>
          </div>
          {/* 1st place */}
          <div className="text-center -mt-4">
            <Crown className="w-8 h-8 mx-auto text-warning mb-1 animate-bounce-subtle" />
            <div className="w-20 h-20 mx-auto rounded-full bg-card border-2 border-warning flex items-center justify-center mb-2 ring-4 ring-warning/20">
              <Users className="w-10 h-10 text-warning" />
            </div>
            <p className="font-semibold truncate max-w-[100px]">{players[0]?.username}</p>
            <p className="text-sm text-primary font-bold">{players[0]?.points} pts</p>
            <div className="mt-2 w-20 h-24 mx-auto bg-primary rounded-t-lg flex items-center justify-center">
              <span className="font-display font-bold text-3xl text-primary-foreground">1</span>
            </div>
          </div>
          {/* 3rd place */}
          <div className="text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-card border-2 border-warning/60 flex items-center justify-center mb-2">
              <Users className="w-8 h-8 text-warning/60" />
            </div>
            <p className="font-semibold text-sm truncate max-w-[80px]">{players[2]?.username}</p>
            <p className="text-xs text-muted-foreground">{players[2]?.points} pts</p>
            <div className="mt-2 w-16 h-12 mx-auto bg-warning/30 rounded-t-lg flex items-center justify-center">
              <span className="font-display font-bold text-2xl text-warning">3</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Empty state */}
      {players.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Ainda não há utilizadores no ranking.</p>
        </div>
      )}

      {/* Full ranking list */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-2">
        {players.slice(3).map((player, index) => (
          <motion.div
            key={player.user_id}
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + index * 0.03 }}
            className={cn(
              "flex items-center gap-4 p-4 rounded-xl bg-card border border-border transition-all",
              player.user_id === user?.id && "border-primary bg-primary/5"
            )}
          >
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center font-display font-bold">{index + 4}</div>
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <Users className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">
                {player.username}
                {player.user_id === user?.id && <span className="text-primary ml-2">(Tu)</span>}
              </p>
              <p className="text-sm text-muted-foreground">{player.lessons_completed} aulas</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">{player.points}</p>
              <span className={cn("px-2 py-0.5 rounded text-xs font-semibold", getRankColor(player.rank))}>{player.rank}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Ranking;
