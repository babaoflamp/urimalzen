import { useAuthStore } from '../store/useAuthStore';

const SelfStudy = () => {
  const { user } = useAuthStore();

  const menuItems = [
    { id: 1, label: 'CEFR Level', color: '#4CAF50' },
    { id: 2, label: 'KIIP Level', color: '#4CAF50' },
    { id: 3, label: '예문', color: '#4CAF50' },
    { id: 4, label: '유의어', color: '#4CAF50' },
    { id: 5, label: '영상 자료', color: '#4CAF50' },
    { id: 6, label: '외부 콘텐츠', color: '#4CAF50' },
  ];

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>자율학습</h2>

      <div style={styles.grid}>
        {menuItems.map((item) => (
          <button key={item.id} style={{ ...styles.menuButton, background: item.color }}>
            {item.label}
            {item.id === 1 && user && (
              <span style={styles.badge}>{user.level.cefr}</span>
            )}
            {item.id === 2 && user && (
              <span style={styles.badge}>{user.level.kiip}급</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '24px',
    padding: '24px',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
  },
  title: {
    color: 'white',
    textAlign: 'center',
    fontSize: '22px',
    marginBottom: '24px',
    fontWeight: 'bold',
    textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  menuButton: {
    background: 'rgba(16, 185, 129, 0.3)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    color: 'white',
    borderRadius: '16px',
    padding: '18px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
  },
  badge: {
    position: 'absolute',
    top: '5px',
    right: '5px',
    background: 'rgba(255,255,255,0.3)',
    padding: '2px 8px',
    borderRadius: '10px',
    fontSize: '12px',
  },
};

export default SelfStudy;
