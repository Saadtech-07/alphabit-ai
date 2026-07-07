import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  IoEllipsisHorizontal,
  IoSettingsOutline,
  IoLogOutOutline,
  IoLogInOutline,
} from "react-icons/io5";
import { useAuth } from "../hooks/useAuth.js";

export default function UserMenu() {
  const { user, isAuthenticated, logout, setShowAuthModal, setAuthMode } =
    useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const initial = user?.username?.charAt(0)?.toUpperCase() || "U";
  const displayName = isAuthenticated ? user?.username : "Guest";

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleLogin = () => {
    setOpen(false);
    setAuthMode("login");
    setShowAuthModal(true);
  };

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate("/");
  };

  return (
    <div className="relative" ref={menuRef}>
      <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-sidebar-hover transition-colors">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold shrink-0">
          {initial}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-900 font-medium truncate">
            {displayName}
          </p>
          <p className="text-[11px] text-gray-500 truncate">Free Plan</p>
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="p-1 rounded-lg hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-colors shrink-0"
          title="More options"
        >
          <IoEllipsisHorizontal size={18} />
        </button>
      </div>

      {open && (
        <div className="absolute bottom-full left-3 right-3 mb-1 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-50">
          <button
            onClick={() => {
              setOpen(false);
              navigate("/settings");
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <IoSettingsOutline size={16} />
            Settings
          </button>

          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <IoLogOutOutline size={16} />
              Logout
            </button>
          ) : (
            <button
              onClick={handleLogin}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <IoLogInOutline size={16} />
              Login
            </button>
          )}
        </div>
      )}
    </div>
  );
}
