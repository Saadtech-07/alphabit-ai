import { Link } from "react-router-dom";
import { HiOutlineSparkles } from "react-icons/hi2";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-4 py-16">
      <HiOutlineSparkles className="text-blue-500 mb-4" size={48} />
      <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
      <p className="text-gray-500 mb-6">Page not found</p>
      <Link
        to="/"
        className="px-5 py-2.5 text-sm font-medium text-white gradient-user rounded-xl shadow-md"
      >
        Back to chat
      </Link>
    </div>
  );
}
