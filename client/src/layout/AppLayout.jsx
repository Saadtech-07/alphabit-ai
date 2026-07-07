import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import MobileDrawer from "./MobileDrawer.jsx";
import Header from "./Header.jsx";
import { useChat } from "../hooks/useChat.js";

export default function AppLayout() {
  const { setSidebarOpen, setSidebarCollapsed } = useChat();
  const [collapsed, setCollapsed] = useState(false);

  const handleToggleCollapse = () => {
    setCollapsed((prev) => !prev);
    setSidebarCollapsed(!collapsed);
  };

  const handleOpenSidebar = () => {
    if (window.innerWidth < 768) {
      setSidebarOpen(true);
    } else if (window.innerWidth < 1024) {
      setCollapsed(false);
      setSidebarCollapsed(false);
    } else {
      setSidebarOpen(true);
    }
  };

  return (
    <div className="flex h-screen w-full bg-white text-gray-900">
      <Sidebar collapsed={collapsed} onToggleCollapse={handleToggleCollapse} />
      <MobileDrawer />

      <main className="flex flex-col flex-1 min-w-0">
        <Header
          onMenuClick={handleOpenSidebar}
          showMenuButton
          showCollapseButton={collapsed}
          onCollapseClick={handleOpenSidebar}
        />
        <Outlet />
      </main>
    </div>
  );
}
