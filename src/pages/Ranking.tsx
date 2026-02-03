import { motion } from "framer-motion";
import { Trophy, Medal, Crown, TrendingUp, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

// Mock ranking data
const RANKING_DATA = [
  { id: "1", username: "FinanceMaster", points: 12500, rank: "S", lessonsCompleted: 24, profile: "pais" },
  { id: "2", username: "MoneyPro", points: 9800, rank: "A", lessonsCompleted: 22, profile: "jovem" },
  { id: "3", username: "SaverKing", points: 7200, rank: "A", lessonsCompleted: 20, profile: "jovem" },
  { id: "4", username: "BudgetBoss", points: 5500, rank: "A", lessonsCompleted: 18, profile: "pais" },
  { id: "5", username: "InvestorJr", points: 4200, rank: "B", lessonsCompleted: 16, profile: "jovem" },
  { id: "6", username: "SmartSaver", points: 3100, rank: "B", lessonsCompleted: 14, profile: "crianca" },
  { id: "7", username: "CashChamp", points: 2400, rank: "B", lessonsCompleted: 12, profile: "jovem" },
  { id: "8", username: "MoneyWise", points: 1800, rank: "C", lessonsCompleted: 10, profile: "pais" },
  { id: "9", username: "PennyPro", points: 1200, rank: "C", lessonsCompleted: 8, profile: "crianca" },
  { id: "10", username: "NewLearner", points: 400, rank: "D", lessonsCompleted: 4, profile: "jovem" },
];

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

const getPositionIcon = (position: number) => {
  switch (position) {
    case 1: return <Crown className="w-6 h-6 text-yellow-400" />;
    case 2: return <Medal className="w-6 h-6 text-gray-300" />;
    case 3: return <Medal className="w-6 h-6 text-amber-600" />;
    default: return null;
  }
};

const Ranking = () => {
  const { user } = useAuth();

  // Add current user to ranking if not already there
  const allRanking = [...RANKING_DATA];
  const userInRanking = allRanking.find(r => r.id === user?.id);
  if (!userInRanking && user) {
    allRanking.push({
      id: user.id,
      username: user.username,
      points: user.points,
      rank: user.rank,
      lessonsCompleted: user.lessonsCompleted,
      profile: user.profile,
    });
  }

  // Sort by points
  const sortedRanking = allRanking.sort((a, b) => b.points - a.points);
  const userPosition = sortedRanking.findIndex(r => r.id === user?.id) + 1;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 mb-4">
          <Trophy className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-display font-bold mb-2">Ranking Global</h1>
        <p className="text-muted-foreground">Compete com outros utilizadores!</p>
      </motion.div>

      {/* User position card */}
      {user && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={cn(
            "bg-gradient-to-r from-primary/20 to-accent/10 border-2 rounded-2xl p-4",
            getRankBorder(user.rank)
          )}
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-card flex items-center justify-center font-display font-bold text-xl">
              #{userPosition}
            </div>
            <div className="flex-1">
              <p className="font-semibold">{user.username} (Tu)</p>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  {user.points} pts
                </span>
                <span className={cn("px-2 py-0.5 rounded font-semibold text-xs", getRankColor(user.rank))}>
                  Rank {user.rank}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Top 3 podium */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-end justify-center gap-3 py-4"
      >
        {/* 2nd place */}
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-card border-2 border-gray-300 flex items-center justify-center mb-2">
            <Users className="w-8 h-8 text-gray-300" />
          </div>
          <p className="font-semibold text-sm truncate max-w-[80px]">{sortedRanking[1]?.username}</p>
          <p className="text-xs text-muted-foreground">{sortedRanking[1]?.points} pts</p>
          <div className="mt-2 w-16 h-16 mx-auto bg-gray-600 rounded-t-lg flex items-center justify-center">
            <span className="font-display font-bold text-2xl text-gray-300">2</span>
          </div>
        </div>

        {/* 1st place */}
        <div className="text-center -mt-4">
          <Crown className="w-8 h-8 mx-auto text-yellow-400 mb-1 animate-bounce-subtle" />
          <div className="w-20 h-20 mx-auto rounded-full bg-card border-2 border-yellow-400 flex items-center justify-center mb-2 ring-4 ring-yellow-400/20">
            <Users className="w-10 h-10 text-yellow-400" />
          </div>
          <p className="font-semibold truncate max-w-[100px]">{sortedRanking[0]?.username}</p>
          <p className="text-sm text-primary font-bold">{sortedRanking[0]?.points} pts</p>
          <div className="mt-2 w-20 h-24 mx-auto bg-primary rounded-t-lg flex items-center justify-center">
            <span className="font-display font-bold text-3xl text-primary-foreground">1</span>
          </div>
        </div>

        {/* 3rd place */}
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-card border-2 border-amber-600 flex items-center justify-center mb-2">
            <Users className="w-8 h-8 text-amber-600" />
          </div>
          <p className="font-semibold text-sm truncate max-w-[80px]">{sortedRanking[2]?.username}</p>
          <p className="text-xs text-muted-foreground">{sortedRanking[2]?.points} pts</p>
          <div className="mt-2 w-16 h-12 mx-auto bg-amber-700 rounded-t-lg flex items-center justify-center">
            <span className="font-display font-bold text-2xl text-amber-200">3</span>
          </div>
        </div>
      </motion.div>

      {/* Full ranking list */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-2"
      >
        {sortedRanking.slice(3).map((player, index) => (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.03 }}
            className={cn(
              "flex items-center gap-4 p-4 rounded-xl bg-card border border-border transition-all",
              player.id === user?.id && "border-primary bg-primary/5"
            )}
          >
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center font-display font-bold">
              {index + 4}
            </div>
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <Users className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">
                {player.username}
                {player.id === user?.id && <span className="text-primary ml-2">(Tu)</span>}
              </p>
              <p className="text-sm text-muted-foreground">{player.lessonsCompleted} aulas</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">{player.points}</p>
              <span className={cn("px-2 py-0.5 rounded text-xs font-semibold", getRankColor(player.rank))}>
                {player.rank}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Ranking;
