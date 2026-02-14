import { useRef, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useChat } from "@/hooks/useChat";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatMessage from "@/components/chat/ChatMessage";
import ChatInput from "@/components/chat/ChatInput";
import TypingIndicator from "@/components/chat/TypingIndicator";

const Index = () => {
  const { messages, isLoading, sendMessage, clearChat } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex h-[100dvh] flex-col bg-background">
      <ChatHeader onClear={clearChat} />

      {/* Messages area */}
      <main className="flex-1 overflow-y-auto scrollbar-thin px-3 py-4 sm:px-6">
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}

          <AnimatePresence>
            {isLoading && <TypingIndicator />}
          </AnimatePresence>

          <div ref={bottomRef} />
        </div>
      </main>

      <ChatInput onSend={sendMessage} disabled={isLoading} />
    </div>
  );
};

export default Index;
