import { motion } from "framer-motion";

export default function Loader({ size = "md", className = "" }) {
  const sizes = { sm: "w-4 h-4", md: "w-6 h-6", lg: "w-8 h-8" };

  return (
    <motion.div
      className={`${sizes[size]} border-2 border-gray-200 border-t-blue-500 rounded-full ${className}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
    />
  );
}

export function Skeleton({ className = "" }) {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded-lg ${className}`}
    />
  );
}

export function MessageSkeleton() {
  return (
    <div className="flex flex-col gap-3 px-4 py-2 max-w-3xl">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  );
}
