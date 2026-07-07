import ChatWindow from "../chat/ChatWindow.jsx";
import { useChat } from "../hooks/useChat.js";

export default function Home() {
  const {
    messages,
    isTyping,
    sendMessage,
    regenerateLastResponse,
    toggleLike,
  } = useChat();

  return (
    <ChatWindow
      messages={messages}
      isTyping={isTyping}
      onSend={sendMessage}
      onRegenerate={regenerateLastResponse}
      onToggleLike={toggleLike}
    />
  );
}
