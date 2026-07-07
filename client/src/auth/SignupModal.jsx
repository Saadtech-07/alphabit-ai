import { useState } from "react";
import PasswordStep from "./PasswordStep.jsx";

export default function SignupModal({ onSwitchToLogin, onSuccess }) {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleContinue = (e) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !email.trim()) return;
    setStep(2);
  };

  const handleSignup = async (password) => {
    setLoading(true);
    setError("");
    try {
      await onSuccess(username.trim(), email.trim(), password);
    } catch (err) {
      setError(
        err.response?.data?.message || "Signup failed. Please try again."
      );
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  if (step === 2) {
    return (
      <PasswordStep
        onSubmit={handleSignup}
        onBack={() => {
          setStep(1);
          setError("");
        }}
        loading={loading}
        error={error}
      />
    );
  }

  return (
    <form onSubmit={handleContinue} className="space-y-4">
      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          Username
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          required
          minLength={2}
          className="w-full px-4 py-3 text-sm rounded-xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="w-full px-4 py-3 text-sm rounded-xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
        />
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="w-full py-3 text-sm font-medium text-white gradient-user rounded-xl shadow-md shadow-blue-500/25 hover:shadow-lg transition-all"
      >
        Continue
      </button>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-blue-600 font-medium hover:underline"
        >
          Login
        </button>
      </p>
    </form>
  );
}
