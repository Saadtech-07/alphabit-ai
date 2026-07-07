import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ChatProvider } from "./context/ChatContext.jsx";
import AppLayout from "./layout/AppLayout.jsx";
import Home from "./pages/Home.jsx";
import Settings from "./pages/Settings.jsx";
import NotFound from "./pages/NotFound.jsx";
import AuthModal from "./auth/AuthModal.jsx";
import Toast from "./components/Toast.jsx";
import Loader from "./components/Loader.jsx";
import { useAuth } from "./hooks/useAuth.js";

function AppContent() {
  const { isLoading, toast, dismissToast } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <AuthModal />
      <Toast toast={toast} onDismiss={dismissToast} />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ChatProvider>
          <AppContent />
        </ChatProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
