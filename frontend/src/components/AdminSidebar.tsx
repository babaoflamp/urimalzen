import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useLanguageStore } from "../store/useLanguageStore";
import { translations } from "../utils/translations";
import "./AdminSidebar.css";

interface AdminSidebarProps {
  onLinkClick?: () => void;
}

const AdminSidebar = ({ onLinkClick }: AdminSidebarProps) => {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { language } = useLanguageStore();
  const t = translations[language];

  const navItems = [
    { path: "/admin/dashboard", label: t.adminDashboard, icon: "📊" },
    { path: "/admin/users", label: t.userManagement, icon: "👥" },
    { path: "/admin/words", label: t.wordManagement, icon: "📚" },
    { path: "/admin/recordings", label: t.recordingManagement, icon: "🎤" },
    { path: "/admin/statistics", label: t.statistics, icon: "📈" },
    { path: "/admin/kiip", label: t.kiipContent, icon: "🎓" },
    { path: "/admin/ai-content", label: t.aiContentManagement, icon: "🤖" },
    { path: "/admin/tts", label: t.ttsSettings, icon: "🔊" },
    { path: "/admin/stt", label: t.sttSettings, icon: "🎙️" },
    { path: "/admin/comfyui", label: "이미지 생성 설정", icon: "🎨" },
    { path: "/admin/system", label: t.systemSettings, icon: "⚙️" },
  ];

  const handleLogout = () => {
    logout();
    window.location.href = "/admin/login";
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
        <h2 className="admin-sidebar-title">👨‍💼 Admin</h2>
        <p className="admin-sidebar-user">{user?.email}</p>
      </div>

      <nav className="admin-sidebar-nav">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-sidebar-link ${isActive ? "active" : ""}`}
              onClick={onLinkClick}
            >
              <span className="admin-sidebar-icon">{item.icon}</span>
              <span className="admin-sidebar-label">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="admin-sidebar-footer">
        <button onClick={handleLogout} className="admin-sidebar-logout">
          🚪 {t.logout}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
