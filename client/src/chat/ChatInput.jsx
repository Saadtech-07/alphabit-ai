import { useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  IoAttach,
  IoMicOutline,
  IoArrowUp,
} from "react-icons/io5";

export default function ChatInput({ onSend, disabled }) {
  const textareaRef = useRef(null);

  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, []);

  useEffect(() => {
    adjustHeight();
  }, [adjustHeight]);

  const handleSend = () => {
    const value = textareaRef.current?.value?.trim();
    if (!value || disabled) return;
    onSend(value);
    if (textareaRef.current) {
      textareaRef.current.value = "";
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="sticky bottom-0 px-4 pb-4 pt-2 bg-gradient-to-t from-white via-white to-transparent">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="
          max-w-3xl mx-auto flex items-end gap-2
          bg-white border border-gray-200
          rounded-[20px] shadow-lg shadow-gray-200/60
          px-3 py-2
          focus-within:border-blue-400/60 focus-within:shadow-blue-500/10
          transition-all duration-200
        "
      >
        <button
          type="button"
          title="Attach file"
          className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors shrink-0 cursor-pointer"
        >
          <IoAttach size={20} />
        </button>

        <textarea
          ref={textareaRef}
          rows={1}
          placeholder="Message Alphabit-AI..."
          disabled={disabled}
          onInput={adjustHeight}
          onKeyDown={handleKeyDown}
          className="
            flex-1 resize-none bg-transparent outline-none
            text-sm text-gray-900
            placeholder:text-gray-400
            py-2.5 max-h-[200px] scrollbar-thin
          "
        />

        <button
          type="button"
          title="Voice input"
          className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors shrink-0 cursor-pointer hidden sm:block"
        >
          <IoMicOutline size={20} />
        </button>

        <button
          type="button"
          onClick={handleSend}
          disabled={disabled}
          title="Send message"
          className="
            w-9 h-9 rounded-full gradient-user
            flex items-center justify-center shrink-0
            shadow-md shadow-blue-500/30
            hover:shadow-lg hover:shadow-blue-500/40
            disabled:opacity-40 disabled:cursor-not-allowed
            transition-all duration-200 cursor-pointer
          "
        >
          <IoArrowUp size={18} className="text-white" />
        </button>
      </motion.div>

      <p className="text-center text-[11px] text-gray-400 mt-2">
        Alphabit-AI can make mistakes. Consider checking important information.
      </p>
    </div>
  );
}
