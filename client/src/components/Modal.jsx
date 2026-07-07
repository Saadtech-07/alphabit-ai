import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";

export default function Modal({ isOpen, onClose, title, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-md bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <h2 className="text-gray-900 font-semibold text-base">{title}</h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors"
              >
                <IoClose size={20} />
              </button>
            </div>
            <div className="p-5">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
