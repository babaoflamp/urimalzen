import { Link, useLocation } from "react-router-dom";
import { useLanguageStore } from "../store/useLanguageStore";
import { translations } from "../utils/translations";
import "./MainNav.css";

const MainNav = () => {
  const location = useLocation();
  const { language } = useLanguageStore();
  const t = translations[language];

  const navItems = [
    { path: "/learning", label: t.learning, icon: "📚" },
    { path: "/categories", label: t.categories, icon: "📂" },
    { path: "/levels", label: t.levels, icon: "🎯" },
    { path: "/pronunciation", label: t.pronunciation, icon: "🗣️" },
    {
      path: "/units",
      label: language === "ko" ? "학습 경로" : "Сургалт",
      icon: "🛤️",
    },
  ];

  return (
    <nav className="main-nav">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${isActive ? "active" : ""}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <div className="nav-label">{item.label}</div>
          </Link>
        );
      })}
    </nav>
  );
};

export default MainNav;
