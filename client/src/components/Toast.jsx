import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoCheckmarkCircle, IoAlertCircle } from "react-icons/io5";

export default function Toast({ toast, onDismiss }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, x: 40, y: 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 40 }}
          transition={{ duration: 0.25 }}
          className="fixed top-5 right-5 z-[100] flex items-center gap-2.5 px-4 py-3 rounded-xl bg-white border border-gray-200 shadow-xl shadow-gray-200/50"
        >
          {toast.type === "error" ? (
            <IoAlertCircle className="text-red-500 shrink-0" size={20} />
          ) : (
            <IoCheckmarkCircle className="text-green-500 shrink-0" size={20} />
          )}
          <span className="text-sm font-medium text-gray-800">
            {toast.message}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
