import { useState } from "react";
import PasswordInput from "./PasswordInput.jsx";

export default function LoginModal({ onSwitchToSignup, onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await onSuccess(email.trim(), password);
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="login-email"
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          Email
        </label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          disabled={loading}
          className="w-full px-4 py-3 text-sm rounded-xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all disabled:opacity-50"
        />
      </div>

      <div>
        <label
          htmlFor="login-password"
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          Password
        </label>
        <PasswordInput
          id="login-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          disabled={loading}
        />
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 text-sm font-medium text-white gradient-user rounded-xl shadow-md shadow-blue-500/25 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      <p className="text-center text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="text-blue-600 font-medium hover:underline"
        >
          Create Account
        </button>
      </p>
    </form>
  );
}
