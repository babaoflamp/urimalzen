import { ReactNode, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import "./AdminLayout.css";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="admin-layout">
      <div className={`admin-sidebar-wrapper ${sidebarOpen ? "open" : ""}`}>
        <AdminSidebar onLinkClick={closeSidebar} />
      </div>

      {/* 모바일 사이드바 토글 버튼 */}
      <button className="admin-sidebar-toggle" onClick={toggleSidebar}>
        {sidebarOpen ? "✕" : "☰"}
      </button>

      {/* 모바일 오버레이 */}
      {sidebarOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={toggleSidebar}
        />
      )}

      <main className="admin-main-content">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
