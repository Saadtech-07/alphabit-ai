import { motion } from "framer-motion";
import { HiOutlineSparkles } from "react-icons/hi2";
import SuggestionCards from "./SuggestionCards";
import { SUGGESTIONS } from "../utils/helpers.js";

export default function WelcomeScreen({ onSuggestionClick, disabled }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center flex-1 px-4 py-8"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        className="w-16 h-16 rounded-2xl gradient-user flex items-center justify-center shadow-xl shadow-blue-500/20 mb-6"
      >
        <HiOutlineSparkles className="text-white" size={32} />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2 text-center"
      >
        How can I help you today?
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-gray-500 text-sm sm:text-base text-center max-w-md mb-8"
      >
        Ask anything, generate ideas, solve problems, and explore knowledge.
      </motion.p>

      <SuggestionCards
        suggestions={SUGGESTIONS}
        onSelect={onSuggestionClick}
        disabled={disabled}
      />
    </motion.div>
  );
}
