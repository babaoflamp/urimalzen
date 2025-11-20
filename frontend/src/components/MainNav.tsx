import { Link, useLocation } from 'react-router-dom';

const MainNav = () => {
  const location = useLocation();

  const navItems = [
    { path: '/learning', label: '학습하기', labelMn: 'Суралцах', icon: '📚' },
    { path: '/categories', label: '카테고리', labelMn: 'Ангилал', icon: '📂' },
    { path: '/levels', label: 'KIIP 레벨', labelMn: 'KIIP Түвшин', icon: '🎯' },
    { path: '/pronunciation', label: '발음', labelMn: 'Дуудлага', icon: '🗣️' },
    { path: '/units', label: '학습 경로', labelMn: 'Сургалт', icon: '🛤️' },
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
            <div style={styles.labelContainer}>
              <div style={styles.label}>{item.label}</div>
              <div style={styles.labelMn}>{item.labelMn}</div>
            </div>
          </Link>
        );
      })}
    </nav>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  nav: {
    display: 'flex',
    gap: '12px',
    padding: '16px 24px',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '20px',
    margin: '0 24px 16px 24px',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '14px',
    color: 'white',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  activeNavItem: {
    background: 'rgba(99, 102, 241, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    transform: 'scale(1.05)',
    boxShadow: '0 6px 20px rgba(99, 102, 241, 0.3)',
  },
  icon: {
    fontSize: '24px',
  },
  labelContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  label: {
    fontSize: '14px',
    fontWeight: 'bold',
  },
  labelMn: {
    fontSize: '11px',
    opacity: 0.8,
  },
};

export default MainNav;
