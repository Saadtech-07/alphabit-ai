import { useEffect, useRef } from "react";
import WelcomeScreen from "./WelcomeScreen.jsx";
import MessageBubble from "./MessageBubble.jsx";
import TypingIndicator from "./TypingIndicator.jsx";
import ChatInput from "./ChatInput.jsx";

export default function ChatWindow({
  messages,
  isTyping,
  onSend,
  onRegenerate,
  onToggleLike,
}) {
  const bottomRef = useRef(null);
  const hasMessages = messages.some(
    (m) => m.content || (m.role === "assistant" && isTyping)
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const lastAssistantId = [...messages]
    .reverse()
    .find((m) => m.role === "assistant")?.id;

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {!hasMessages ? (
          <WelcomeScreen onSuggestionClick={onSend} disabled={isTyping} />
        ) : (
          <div className="max-w-3xl mx-auto py-4">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isTyping={isTyping}
                isLast={message.id === lastAssistantId}
                onRegenerate={onRegenerate}
                onToggleLike={onToggleLike}
              />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <ChatInput onSend={onSend} disabled={isTyping} />
    </div>
  );
}
