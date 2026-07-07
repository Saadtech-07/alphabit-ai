import { useNavigate } from "react-router-dom";
import { HiOutlineSparkles } from "react-icons/hi2";
import { useAuth } from "../hooks/useAuth.js";

export default function Settings() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <button
          onClick={() => navigate("/")}
          className="text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
        >
          ← Back to chat
        </button>

        <h1 className="text-2xl font-semibold text-gray-900 mb-8">Settings</h1>

        <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-medium text-gray-900 mb-6">
            Profile Information
          </h2>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1.5">
                Username
              </label>
              <div className="px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 text-sm">
                {user?.username || "—"}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1.5">
                Email
              </label>
              <div className="px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 text-sm">
                {user?.email || "—"}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1.5">
                Password
              </label>
              <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 border border-gray-200">
                <span className="text-gray-900 text-sm tracking-widest">
                  ********
                </span>
                <button
                  type="button"
                  className="text-sm text-blue-600 font-medium hover:underline opacity-50 cursor-not-allowed"
                  disabled
                  title="Coming soon"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="flex items-center gap-2 mt-8 text-gray-400 text-xs">
          <HiOutlineSparkles size={14} />
          <span>Alphabit-AI v1.0</span>
        </div>
      </div>
    </div>
  );
}
