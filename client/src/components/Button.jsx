import { forwardRef } from "react";

const variants = {
  primary:
    "bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 shadow-sm hover:shadow",
  ghost: "hover:bg-sidebar-hover text-gray-600 hover:text-gray-900",
  danger: "hover:bg-red-50 text-red-500 hover:text-red-600",
  accent:
    "gradient-user text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40",
  icon: "p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-sm",
};

const Button = forwardRef(function Button(
  {
    children,
    variant = "primary",
    size = "md",
    className = "",
    disabled = false,
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2 font-medium rounded-xl
        transition-all duration-200 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
});

export default Button;
