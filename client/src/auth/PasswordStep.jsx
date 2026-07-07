import { useState } from "react";
import PasswordInput from "./PasswordInput.jsx";

export default function PasswordStep({
  onSubmit,
  onBack,
  loading,
  error,
}) {
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.length < 6) return;
    onSubmit(password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="signup-password"
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          Password
        </label>
        <PasswordInput
          id="signup-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Create a password"
          disabled={loading}
        />
        <p className="text-xs text-gray-400 mt-1.5">
          Must be at least 6 characters
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">
          {error}
        </p>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="flex-1 py-3 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={loading || password.length < 6}
          className="flex-1 py-3 text-sm font-medium text-white gradient-user rounded-xl shadow-md shadow-blue-500/25 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>
      </div>
    </form>
  );
}
