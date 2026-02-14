import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import type { ChatMessage as ChatMessageType } from "@/types/chat";

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <TrendingUp className="h-4 w-4 text-primary" />
        </div>
      )}

      {/* Bubble */}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed sm:max-w-[70%] ${
          isUser
            ? "rounded-br-md bg-chat-user text-chat-user-foreground"
            : "rounded-bl-md bg-chat-ai text-chat-ai-foreground"
        }`}
      >
        <MessageContent content={message.content} />
        <p
          className={`mt-1.5 text-[10px] ${
            isUser ? "text-chat-user-foreground/60" : "text-muted-foreground"
          }`}
        >
          {message.timestamp.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </motion.div>
  );
};

/** Renders content with basic markdown-like formatting */
function MessageContent({ content }: { content: string }) {
  const lines = content.split("\n");

  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        if (line.startsWith("- ") || line.startsWith("• ")) {
          return (
            <p key={i} className="pl-2">
              • {line.slice(2)}
            </p>
          );
        }

        if (/^\d+\.\s/.test(line)) {
          return (
            <p key={i} className="pl-2">
              {line}
            </p>
          );
        }

        // Bold text between **
        const formatted = line.replace(
          /\*\*(.*?)\*\*/g,
          '<strong class="font-semibold">$1</strong>'
        );

        return (
          <p
            key={i}
            dangerouslySetInnerHTML={{ __html: formatted }}
          />
        );
      })}
    </div>
  );
}

export default ChatMessage;
