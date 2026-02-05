 import { motion } from "framer-motion";
 import { Trophy, Star, Zap, Crown, Flame, Sparkles } from "lucide-react";
 import { cn } from "@/lib/utils";
 import { Progress } from "@/components/ui/progress";
 
 // Rank configuration with thresholds and benefits
 export const RANK_CONFIG = {
   D: { min: 0, max: 499, label: "Iniciante", icon: Star, color: "rank-d", gradient: "from-gray-500 to-gray-600" },
   C: { min: 500, max: 1999, label: "Aprendiz", icon: Zap, color: "rank-c", gradient: "from-orange-400 to-orange-600" },
   B: { min: 2000, max: 4999, label: "Estudante", icon: Flame, color: "rank-b", gradient: "from-yellow-400 to-amber-500" },
   A: { min: 5000, max: 9999, label: "Especialista", icon: Trophy, color: "rank-a", gradient: "from-emerald-400 to-green-600" },
   S: { min: 10000, max: Infinity, label: "Mestre", icon: Crown, color: "rank-s", gradient: "from-purple-500 to-pink-500" },
 } as const;
 
 export type RankType = keyof typeof RANK_CONFIG;
 
 const RANK_ORDER: RankType[] = ["D", "C", "B", "A", "S"];
 
 interface RankProgressProps {
   points: number;
   rank: RankType;
   variant?: "compact" | "full" | "card";
   showNextRank?: boolean;
   animated?: boolean;
 }
 
 export const getRankFromPoints = (points: number): RankType => {
   if (points >= 10000) return "S";
   if (points >= 5000) return "A";
   if (points >= 2000) return "B";
   if (points >= 500) return "C";
   return "D";
 };
 
 export const getNextRank = (rank: RankType): RankType | null => {
   const index = RANK_ORDER.indexOf(rank);
   return index < RANK_ORDER.length - 1 ? RANK_ORDER[index + 1] : null;
 };
 
 export const getProgressToNextRank = (points: number, rank: RankType) => {
   const config = RANK_CONFIG[rank];
   const nextRank = getNextRank(rank);
   
   if (!nextRank) return { progress: 100, pointsNeeded: 0, pointsToNext: 0 };
   
   const nextConfig = RANK_CONFIG[nextRank];
   const rangeStart = config.min;
   const rangeEnd = nextConfig.min;
   const progress = ((points - rangeStart) / (rangeEnd - rangeStart)) * 100;
   const pointsToNext = rangeEnd - points;
   
   return { 
     progress: Math.min(Math.max(progress, 0), 100), 
     pointsNeeded: rangeEnd,
     pointsToNext: Math.max(pointsToNext, 0)
   };
 };
 
 const RankProgress = ({ 
   points, 
   rank, 
   variant = "full", 
   showNextRank = true,
   animated = true 
 }: RankProgressProps) => {
   const config = RANK_CONFIG[rank];
   const nextRank = getNextRank(rank);
   const nextConfig = nextRank ? RANK_CONFIG[nextRank] : null;
   const { progress, pointsToNext } = getProgressToNextRank(points, rank);
   const RankIcon = config.icon;
   const NextIcon = nextConfig?.icon || Sparkles;
 
   if (variant === "compact") {
     return (
       <div className="flex items-center gap-2">
         <div className={cn(
           "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm",
           `bg-${config.color}`,
           rank === "D" ? "text-white" : "text-primary-foreground"
         )}>
           {rank}
         </div>
         <div className="flex-1">
           <div className="flex items-center justify-between text-xs mb-1">
             <span className="font-medium">{points} pts</span>
             {nextRank && <span className="text-muted-foreground">→ {nextConfig?.min}</span>}
           </div>
           <div className="h-1.5 bg-muted rounded-full overflow-hidden">
             <motion.div
               className={cn("h-full rounded-full bg-gradient-to-r", config.gradient)}
               initial={animated ? { width: 0 } : { width: `${progress}%` }}
               animate={{ width: `${progress}%` }}
               transition={{ duration: 1, ease: "easeOut" }}
             />
           </div>
         </div>
       </div>
     );
   }
 
   if (variant === "card") {
     return (
       <motion.div
         initial={{ opacity: 0, scale: 0.95 }}
         animate={{ opacity: 1, scale: 1 }}
         className={cn(
           "relative overflow-hidden rounded-2xl p-6 border",
           "bg-gradient-to-br",
           config.gradient,
           "border-white/20"
         )}
       >
         {/* Background pattern */}
         <div className="absolute inset-0 opacity-10">
           <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl" />
           <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full blur-2xl" />
         </div>
 
         <div className="relative z-10">
           <div className="flex items-center justify-between mb-4">
             <div>
               <p className="text-white/80 text-sm font-medium">Seu Rank</p>
               <div className="flex items-center gap-2">
                 <span className="text-4xl font-display font-bold text-white">{rank}</span>
                 <span className="text-white/80 text-lg">{config.label}</span>
               </div>
             </div>
             <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
               <RankIcon className="w-8 h-8 text-white" />
             </div>
           </div>
 
           <div className="flex items-center justify-between text-white mb-2">
             <span className="font-bold text-2xl">{points.toLocaleString()}</span>
             <span className="text-white/60">pontos</span>
           </div>
 
           {nextRank && showNextRank && (
             <div className="mt-4 pt-4 border-t border-white/20">
               <div className="flex items-center justify-between text-sm mb-2">
                 <span className="text-white/80">Próximo: Rank {nextRank}</span>
                 <span className="text-white font-medium">{pointsToNext.toLocaleString()} pts restantes</span>
               </div>
               <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                 <motion.div
                   className="h-full bg-white rounded-full"
                   initial={animated ? { width: 0 } : { width: `${progress}%` }}
                   animate={{ width: `${progress}%` }}
                   transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                 />
               </div>
             </div>
           )}
           
           {rank === "S" && (
             <div className="mt-4 pt-4 border-t border-white/20 text-center">
               <div className="flex items-center justify-center gap-2 text-white">
                 <Sparkles className="w-5 h-5" />
                 <span className="font-medium">Rank Máximo Alcançado!</span>
                 <Sparkles className="w-5 h-5" />
               </div>
             </div>
           )}
         </div>
       </motion.div>
     );
   }
 
   // Full variant (default)
   return (
     <div className="space-y-4">
       {/* Current rank display */}
       <div className="flex items-center gap-4">
         <motion.div
           className={cn(
             "w-20 h-20 rounded-2xl flex items-center justify-center",
             "bg-gradient-to-br shadow-lg",
             config.gradient
           )}
           initial={animated ? { scale: 0 } : { scale: 1 }}
           animate={{ scale: 1 }}
           transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
         >
           <span className="text-3xl font-display font-bold text-white">{rank}</span>
         </motion.div>
         
         <div className="flex-1">
           <p className="text-lg font-semibold">{config.label}</p>
           <p className="text-3xl font-display font-bold text-primary">
             {points.toLocaleString()}
             <span className="text-base font-normal text-muted-foreground ml-1">pontos</span>
           </p>
         </div>
       </div>
 
       {/* Progress to next rank */}
       {nextRank && showNextRank && (
         <div className="bg-card rounded-xl p-4 border border-border">
           <div className="flex items-center justify-between mb-3">
             <div className="flex items-center gap-2">
               <RankIcon className={cn("w-5 h-5", `text-${config.color}`)} />
               <span className="font-medium">Rank {rank}</span>
             </div>
             <div className="flex items-center gap-2">
               <span className="font-medium">Rank {nextRank}</span>
               <NextIcon className={cn("w-5 h-5", `text-${nextConfig?.color}`)} />
             </div>
           </div>
           
           <div className="relative h-4 bg-muted rounded-full overflow-hidden">
             <motion.div
               className={cn("absolute inset-y-0 left-0 rounded-full bg-gradient-to-r", config.gradient)}
               initial={animated ? { width: 0 } : { width: `${progress}%` }}
               animate={{ width: `${progress}%` }}
               transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
             />
             <div className="absolute inset-0 flex items-center justify-center">
               <span className="text-xs font-bold text-white drop-shadow-md">
                 {Math.round(progress)}%
               </span>
             </div>
           </div>
           
           <p className="text-center text-sm text-muted-foreground mt-2">
             Faltam <span className="font-semibold text-foreground">{pointsToNext.toLocaleString()}</span> pontos para Rank {nextRank}
           </p>
         </div>
       )}
 
       {rank === "S" && (
         <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-500/30 text-center">
           <div className="flex items-center justify-center gap-2 mb-1">
             <Crown className="w-5 h-5 text-purple-400" />
             <span className="font-semibold text-purple-300">Mestre Financeiro</span>
             <Crown className="w-5 h-5 text-purple-400" />
           </div>
           <p className="text-sm text-muted-foreground">Você alcançou o rank máximo!</p>
         </div>
       )}
 
       {/* All ranks preview */}
       <div className="flex items-center justify-between gap-1">
         {RANK_ORDER.map((r, i) => {
           const rConfig = RANK_CONFIG[r];
           const isActive = RANK_ORDER.indexOf(rank) >= i;
           const isCurrent = rank === r;
           
           return (
             <motion.div
               key={r}
               className={cn(
                 "flex-1 h-2 rounded-full transition-all",
                 isActive ? `bg-gradient-to-r ${rConfig.gradient}` : "bg-muted",
                 isCurrent && "ring-2 ring-primary ring-offset-2 ring-offset-background"
               )}
               initial={animated ? { scaleX: 0 } : { scaleX: 1 }}
               animate={{ scaleX: 1 }}
               transition={{ duration: 0.3, delay: 0.1 * i }}
             />
           );
         })}
       </div>
       <div className="flex items-center justify-between text-xs text-muted-foreground">
         {RANK_ORDER.map((r) => (
           <span key={r} className={cn(rank === r && "text-primary font-semibold")}>
             {r}
           </span>
         ))}
       </div>
     </div>
   );
 };
 
 export default RankProgress;