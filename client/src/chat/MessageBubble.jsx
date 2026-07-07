import { useState } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  IoCopyOutline,
  IoCheckmark,
  IoRefresh,
  IoThumbsUp,
  IoThumbsUpOutline,
} from "react-icons/io5";
import { HiOutlineSparkles } from "react-icons/hi2";
import { MessageSkeleton } from "../components/Loader.jsx";

export default function MessageBubble({
  message,
  isTyping,
  isLast,
  onRegenerate,
  onToggleLike,
}) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";
  const isEmpty = !message.content && message.role === "assistant";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isEmpty && isTyping) {
    return null;
  }

  if (isEmpty) {
    return <MessageSkeleton />;
  }

  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex justify-end px-4 py-2"
      >
        <div className="max-w-[85%] sm:max-w-[75%] lg:max-w-[65%] gradient-user text-white px-4 py-3 rounded-2xl rounded-br-md shadow-lg shadow-blue-500/20">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex gap-3 px-4 py-2 group"
    >
      <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0 mt-0.5">
        <HiOutlineSparkles className="text-blue-600" size={16} />
      </div>

      <div className="flex-1 min-w-0 max-w-[85%] sm:max-w-[75%] lg:max-w-[65%]">
        <div className="bg-bubble-ai border border-gray-100 rounded-2xl rounded-tl-md px-4 py-3 text-gray-800">
          <div className="prose-chat">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        </div>

        <div className="flex items-center gap-1 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <ActionButton
            onClick={handleCopy}
            title="Copy"
            icon={copied ? <IoCheckmark size={15} /> : <IoCopyOutline size={15} />}
            active={copied}
          />
          {isLast && onRegenerate && (
            <ActionButton
              onClick={onRegenerate}
              title="Regenerate"
              icon={<IoRefresh size={15} />}
            />
          )}
          <ActionButton
            onClick={() => onToggleLike?.(message.id)}
            title="Like"
            icon={
              message.liked ? (
                <IoThumbsUp size={15} />
              ) : (
                <IoThumbsUpOutline size={15} />
              )
            }
            active={message.liked}
          />
        </div>
      </div>
    </motion.div>
  );
}

function ActionButton({ onClick, title, icon, active }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`
        p-1.5 rounded-lg transition-colors cursor-pointer
        ${
          active
            ? "text-blue-500 bg-blue-500/10"
            : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
        }
      `}
    >
      {icon}
    </button>
  );
}
