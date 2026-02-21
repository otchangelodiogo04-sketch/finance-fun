import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { 
  Home, 
  BookOpen, 
  Trophy, 
  User, 
  Menu, 
  X, 
  LogOut, 
  Wallet,
  Package,
  Shield,
  ChevronRight
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";
 import { RANK_CONFIG, RankType, getProgressToNextRank } from "@/components/RankProgress";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { isAdmin } = useAdminCheck();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { to: "/dashboard", icon: Home, label: "Início", exact: true },
    { to: "/dashboard/modulos", icon: BookOpen, label: "Módulos" },
    { to: "/dashboard/ranking", icon: Trophy, label: "Ranking" },
    { to: "/dashboard/perfil", icon: User, label: "Perfil" },
    { to: "https://fun-ai-nine.vercel.app/", icon: User, Trophy: "Agente IA" },
  ];

  // Add profile-specific items
  if (user?.profile === "jovem" || user?.profile === "pais") {
    navItems.splice(3, 0, { to: "/dashboard/fluxo-caixa", icon: Wallet, label: "Fluxo de Caixa" });
  }
  if (user?.profile === "pais") {
    navItems.splice(4, 0, { to: "/dashboard/stock", icon: Package, label: "Stock" });
  }
  if (isAdmin) {
    navItems.push({ to: "/dashboard/admin", icon: Shield, label: "Admin" });
  }

   const userRank = (user?.rank || "D") as RankType;
   const rankConfig = RANK_CONFIG[userRank];
   const { progress } = getProgressToNextRank(user?.points || 0, userRank);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 p-4 border-b border-sidebar-border">
          <img src={logo} alt="Finance" className="w-10 h-10" />
          <span className="font-display font-bold text-xl text-gradient">Finance</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden p-2 hover:bg-sidebar-accent rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User info */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
             <div className={cn(
               "w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br",
               rankConfig.gradient
             )}>
              {user?.avatar ? (
                <img src={user.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
              ) : (
                 <span className="text-sm font-bold text-white">{user?.rank}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{user?.username}</p>
               <div className="text-sm">
                 <span className="text-muted-foreground">{user?.points?.toLocaleString()} pts</span>
               </div>
               {/* Mini progress bar */}
               <div className="mt-1 h-1 bg-sidebar-accent rounded-full overflow-hidden">
                 <div 
                   className={cn("h-full rounded-full bg-gradient-to-r", rankConfig.gradient)}
                   style={{ width: `${progress}%` }}
                 />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-glow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                )
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
              <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-sidebar-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-30 flex items-center gap-4 p-4 bg-background/80 backdrop-blur-lg border-b border-border">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-card rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
          <img src={logo} alt="Finance" className="w-8 h-8" />
          <span className="font-display font-bold text-gradient">Finance</span>
          <div className="ml-auto flex items-center gap-2 text-sm">
             <div className={cn(
               "w-7 h-7 rounded-lg flex items-center justify-center bg-gradient-to-br text-xs font-bold text-white",
               rankConfig.gradient
             )}>
               {user?.rank}
             </div>
             <span className="text-muted-foreground">{user?.points?.toLocaleString()}</span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
