import { motion } from "framer-motion";
import { HiOutlineLightBulb } from "react-icons/hi2";

export default function SuggestionCards({ suggestions, onSelect, disabled }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
      {suggestions.map((text, index) => (
        <motion.button
          key={text}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + index * 0.08 }}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          disabled={disabled}
          onClick={() => onSelect(text)}
          className="
            group flex items-start gap-3 p-4 rounded-2xl text-left
            border border-gray-200 bg-white
            hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5
            transition-all duration-200 cursor-pointer
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600 shrink-0 group-hover:bg-blue-100 transition-colors">
            <HiOutlineLightBulb size={18} />
          </div>
          <span className="text-sm text-gray-700 leading-snug">
            {text}
          </span>
        </motion.button>
      ))}
    </div>
  );
}
