import { useNavigate } from "react-router-dom";
import { IoMenu } from "react-icons/io5";
import { HiOutlineSparkles } from "react-icons/hi2";

export default function Header({
  onMenuClick,
  showMenuButton = false,
  showCollapseButton = false,
  onCollapseClick,
}) {
  const navigate = useNavigate();

  const goHome = () => navigate("/");

  return (
    <header className="flex items-center px-4 py-3 border-b border-gray-200 bg-white/80 backdrop-blur-md shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        {showMenuButton && (
          <button
            onClick={onMenuClick}
            className="p-2 -ml-1 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors md:hidden cursor-pointer"
          >
            <IoMenu size={20} />
          </button>
        )}

        {showCollapseButton && (
          <button
            onClick={onCollapseClick}
            className="p-2 -ml-1 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors hidden md:block lg:hidden cursor-pointer"
            title="Open sidebar"
          >
            <IoMenu size={20} />
          </button>
        )}

        <button
          onClick={goHome}
          className="flex items-center gap-2.5 min-w-0 hover:opacity-80 transition-opacity cursor-pointer"
          title="Back to chat"
        >
          <div className="w-7 h-7 rounded-lg gradient-user flex items-center justify-center shrink-0">
            <HiOutlineSparkles className="text-white" size={14} />
          </div>
          <h1 className="text-sm font-semibold text-gray-900 truncate">
            Alphabit-AI
          </h1>
        </button>
      </div>
    </header>
  );
}
