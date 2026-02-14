import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

const TypingIndicator = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="flex items-start gap-2.5"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
        <TrendingUp className="h-4 w-4 text-primary" />
      </div>

      <div className="rounded-2xl rounded-bl-md bg-chat-ai px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground">Finance AI está digitando</span>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="inline-block h-1.5 w-1.5 rounded-full bg-primary animate-bounce-dot"
                style={{ animationDelay: `${i * 0.16}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TypingIndicator;
