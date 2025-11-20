import { Link, useLocation } from "react-router-dom";
import { useLanguageStore } from "../store/useLanguageStore";
import { translations } from "../utils/translations";

const MainNav = () => {
  const location = useLocation();
  const { language } = useLanguageStore();
  const t = translations[language];

  const navItems = [
    { path: "/learning", label: t.learning, icon: "📚" },
    { path: "/categories", label: t.categories, icon: "📂" },
    { path: "/levels", label: t.levels, icon: "🎯" },
    { path: "/pronunciation", label: t.pronunciation, icon: "🗣️" },
    { path: "/units", label: language === 'ko' ? "학습 경로" : "Сургалт", icon: "🛤️" },
  ];

  return (
    <nav style={styles.nav}>
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            style={{
              ...styles.navItem,
              ...(isActive ? styles.activeNavItem : {}),
            }}
          >
            <span style={styles.icon}>{item.icon}</span>
            <div style={styles.label}>{item.label}</div>
          </Link>
        );
      })}
    </nav>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  nav: {
    display: "flex",
    gap: "12px",
    padding: "16px 24px",
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "20px",
    maxWidth: "1600px",
    margin: "0 auto 16px auto",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.2)",
    flexWrap: "wrap",
    justifyContent: "center",
    position: "relative",
    zIndex: 100,
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 20px",
    background: "rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    borderRadius: "14px",
    color: "white",
    textDecoration: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)",
  },
  activeNavItem: {
    background: "rgba(99, 102, 241, 0.4)",
    border: "1px solid rgba(255, 255, 255, 0.5)",
    transform: "scale(1.05)",
    boxShadow: "0 6px 20px rgba(99, 102, 241, 0.3)",
  },
  icon: {
    fontSize: "24px",
  },
  label: {
    fontSize: "16px",
    fontWeight: "700",
  },
};

export default MainNav;
