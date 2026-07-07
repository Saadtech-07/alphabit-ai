import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { HiOutlineSparkles } from "react-icons/hi2";
import { useAuth } from "../hooks/useAuth.js";
import SignupModal from "../auth/SignupModal.jsx";
import LoginModal from "../auth/LoginModal.jsx";

export default function AuthModal() {
  const {
    showAuthModal,
    setShowAuthModal,
    authMode,
    setAuthMode,
    login,
    register,
    isAuthenticated,
  } = useAuth();

  if (!showAuthModal || isAuthenticated) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
        >
          <button
            onClick={() => setShowAuthModal(false)}
            className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors z-10"
          >
            <IoClose size={20} />
          </button>

          <div className="px-8 pt-8 pb-6">
            <div className="flex flex-col items-center mb-6">
              <div className="w-12 h-12 rounded-xl gradient-user flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4">
                <HiOutlineSparkles className="text-white" size={24} />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                {authMode === "signup" ? "Create your account" : "Login"}
              </h2>
            </div>

            {authMode === "signup" ? (
              <SignupModal
                onSwitchToLogin={() => setAuthMode("login")}
                onSuccess={register}
              />
            ) : (
              <LoginModal
                onSwitchToSignup={() => setAuthMode("signup")}
                onSuccess={login}
              />
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
