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
    {
      path: "/sentence-learning",
      label:
        language === "ko"
          ? "문장학습"
          : language === "mn"
          ? "Өгүүлбэрийн сургалт"
          : "句子学习",
      icon: "✏️",
    },
    { path: "/categories", label: t.categories, icon: "📂" },
    { path: "/levels", label: t.levels, icon: "🎯" },
    // { path: "/pronunciation", label: t.pronunciation, icon: "🗣️" }, // 발음분석 메뉴 삭제
    {
      path: "/pronunciation/test",
      label:
        language === "ko"
          ? "발음 평가"
          : language === "mn"
          ? "Дуудлагын үнэлгээ"
          : "发音评估",
      icon: "🎙️",
    },
    {
      path: "/units",
      label:
        language === "ko"
          ? "학습 경로"
          : language === "mn"
          ? "Сургалт"
          : "学习路径",
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
