import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  IoMenu,
  IoAdd,
  IoSearch,
  IoPin,
  IoPinOutline,
  IoTrashOutline,
  IoClose,
} from "react-icons/io5";
import { HiOutlineSparkles } from "react-icons/hi2";
import { useChatContext } from "../context/ChatContext.jsx";
import { useChat } from "../hooks/useChat.js";
import { formatRelativeTime } from "../utils/helpers.js";
import Button from "../components/Button.jsx";
import UserMenu from "./UserMenu.jsx";

function ChatListItem({ chat, isActive, onSelect, onDelete, onTogglePin }) {
  return (
    <motion.div
      layout
      className={`
        group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer
        transition-colors duration-150
        ${
          isActive
            ? "bg-sidebar-hover text-gray-900"
            : "text-gray-600 hover:bg-sidebar-hover hover:text-gray-900"
        }
      `}
      onClick={() => onSelect(chat.id)}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm truncate">{chat.title}</p>
        {!chat.pinned && (
          <p className="text-[11px] text-gray-500 truncate">
            {formatRelativeTime(chat.updatedAt)}
          </p>
        )}
      </div>
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onTogglePin(chat.id);
          }}
          className="p-1 rounded-md hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-colors"
          title={chat.pinned ? "Unpin" : "Pin"}
        >
          {chat.pinned ? <IoPin size={14} /> : <IoPinOutline size={14} />}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(chat.id);
          }}
          className="p-1 rounded-md hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors"
          title="Delete"
        >
          <IoTrashOutline size={14} />
        </button>
      </div>
    </motion.div>
  );
}

export default function Sidebar({ collapsed, onToggleCollapse }) {
  const { pinnedChats, recentChats, currentChatId, searchQuery } =
    useChatContext();
  const { newChat, selectChat, deleteChat, togglePin, setSearchQuery, setSidebarOpen } =
    useChat();

  const visibilityClass = collapsed ? "hidden lg:flex" : "hidden md:flex";

  return (
    <motion.aside
      initial={false}
      animate={{ width: 280 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className={`
        ${visibilityClass} flex-col shrink-0
        w-[280px] h-full bg-sidebar border-r border-sidebar-border
      `}
    >
      <SidebarContent
        pinnedChats={pinnedChats}
        recentChats={recentChats}
        currentChatId={currentChatId}
        searchQuery={searchQuery}
        newChat={newChat}
        selectChat={selectChat}
        deleteChat={deleteChat}
        togglePin={togglePin}
        setSearchQuery={setSearchQuery}
        onCloseMobile={() => setSidebarOpen(false)}
        onToggleCollapse={onToggleCollapse}
        showCollapse
      />
    </motion.aside>
  );
}

export function SidebarContent({
  pinnedChats,
  recentChats,
  currentChatId,
  searchQuery,
  newChat,
  selectChat,
  deleteChat,
  togglePin,
  setSearchQuery,
  onCloseMobile,
  onToggleCollapse,
  showCollapse = false,
  isMobile = false,
}) {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
    if (isMobile) onCloseMobile?.();
  };

  return (
    <>
      <div className="flex items-center justify-between px-4 py-4 border-b border-sidebar-border">
        <button
          onClick={goHome}
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity cursor-pointer"
          title="Back to chat"
        >
          <div className="w-8 h-8 rounded-lg gradient-user flex items-center justify-center">
            <HiOutlineSparkles className="text-white" size={18} />
          </div>
          <span className="text-gray-900 font-semibold text-base tracking-tight">
            Alphabit-AI
          </span>
        </button>
        <div className="flex items-center gap-1">
          {showCollapse && (
            <button
              onClick={onToggleCollapse}
              className="p-1.5 rounded-lg hover:bg-sidebar-hover text-gray-500 hover:text-gray-800 transition-colors"
              title="Collapse sidebar"
            >
              <IoMenu size={18} />
            </button>
          )}
          {isMobile && (
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg hover:bg-sidebar-hover text-gray-500 hover:text-gray-800 transition-colors"
            >
              <IoClose size={20} />
            </button>
          )}
        </div>
      </div>

      <div className="px-3 pt-3">
        <Button
          variant="primary"
          className="w-full justify-start"
          onClick={newChat}
        >
          <IoAdd size={18} />
          New Chat
        </Button>
      </div>

      <div className="px-3 pt-3">
        <div className="relative">
          <IoSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            size={16}
          />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="
              w-full pl-9 pr-3 py-2 text-sm rounded-xl
              bg-sidebar-hover border border-sidebar-border
              text-gray-800 placeholder:text-gray-400
              outline-none focus:border-gray-500 transition-colors
            "
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin px-2 py-3 space-y-4">
        {pinnedChats.length > 0 && (
          <div>
            <p className="px-3 text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1">
              Pinned
            </p>
            {pinnedChats.map((chat) => (
              <ChatListItem
                key={chat.id}
                chat={chat}
                isActive={chat.id === currentChatId}
                onSelect={selectChat}
                onDelete={deleteChat}
                onTogglePin={togglePin}
              />
            ))}
          </div>
        )}

        {recentChats.length > 0 && (
          <div>
            <p className="px-3 text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1">
              Recent
            </p>
            {recentChats.map((chat) => (
              <ChatListItem
                key={chat.id}
                chat={chat}
                isActive={chat.id === currentChatId}
                onSelect={selectChat}
                onDelete={deleteChat}
                onTogglePin={togglePin}
              />
            ))}
          </div>
        )}

        {pinnedChats.length === 0 && recentChats.length === 0 && (
          <p className="text-center text-gray-500 text-sm py-8">
            No chats yet
          </p>
        )}
      </div>

      <div className="border-t border-sidebar-border p-3">
        <UserMenu />
      </div>
    </>
  );
}
