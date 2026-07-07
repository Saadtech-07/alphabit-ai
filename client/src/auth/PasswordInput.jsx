import { useState } from "react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

export default function PasswordInput({
  value,
  onChange,
  placeholder = "Password",
  id = "password",
  disabled = false,
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required
        minLength={6}
        className="
          w-full px-4 py-3 pr-11 text-sm rounded-xl
          bg-white border border-gray-200
          text-gray-900 placeholder:text-gray-400
          outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100
          transition-all disabled:opacity-50
        "
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
        tabIndex={-1}
      >
        {visible ? <IoEyeOffOutline size={18} /> : <IoEyeOutline size={18} />}
      </button>
    </div>
  );
}
