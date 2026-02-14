import { Trash2, TrendingUp, Wifi } from "lucide-react";
import { motion } from "framer-motion";

interface ChatHeaderProps {
  onClear: () => void;
}

const ChatHeader = ({ onClear }: ChatHeaderProps) => {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card/80 px-4 py-3 backdrop-blur-xl sm:px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <TrendingUp className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="font-display text-lg font-bold leading-tight text-foreground">
            Finance AI
          </h1>
          <p className="text-xs text-muted-foreground">
            Seu agente inteligente de finanças
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <motion.div
          className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1"
          animate={{ opacity: [1, 0.7, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Wifi className="h-3 w-3 text-primary" />
          <span className="text-xs font-medium text-primary">Online</span>
        </motion.div>

        <button
          onClick={onClear}
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          title="Limpar conversa"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
};

export default ChatHeader;
