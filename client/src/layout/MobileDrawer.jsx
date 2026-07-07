import { motion, AnimatePresence } from "framer-motion";
import { useChatContext } from "../context/ChatContext.jsx";
import { useChat } from "../hooks/useChat.js";
import { SidebarContent } from "./Sidebar.jsx";

export default function MobileDrawer() {
  const {
    sidebarOpen,
    pinnedChats,
    recentChats,
    currentChatId,
    searchQuery,
  } = useChatContext();
  const {
    newChat,
    selectChat,
    deleteChat,
    togglePin,
    setSearchQuery,
    setSidebarOpen,
  } = useChat();

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="fixed left-0 top-0 bottom-0 w-[280px] z-50 bg-sidebar border-r border-sidebar-border flex flex-col md:hidden"
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
              isMobile
            />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
