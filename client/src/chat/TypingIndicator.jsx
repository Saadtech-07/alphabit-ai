import { motion } from "framer-motion";
import { HiOutlineSparkles } from "react-icons/hi2";

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 px-4 py-3"
    >
      <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
        <HiOutlineSparkles className="text-blue-600" size={16} />
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span>Alphabit-AI is thinking</span>
        <span className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-gray-400"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </span>
      </div>
    </motion.div>
  );
}
