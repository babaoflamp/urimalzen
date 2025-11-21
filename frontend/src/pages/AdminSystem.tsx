import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminCommon.css';

const AdminSystem = () => {
  const navigate = useNavigate();
  const [systemHealth] = useState({
    database: 'Connected',
    api: 'Running',
    storage: '45% Used',
    uptime: '7 days',
  });

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={() => navigate('/admin/dashboard')}>
          ← 뒤로
        </button>
        <h1 style={styles.title}>⚙️ 시스템 설정</h1>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>시스템 상태</h2>
        <div style={styles.healthGrid}>
          <div style={styles.healthCard}>
            <div style={styles.healthIcon}>💾</div>
            <div style={styles.healthLabel}>데이터베이스</div>
            <div style={styles.healthValue}>{systemHealth.database}</div>
          </div>
          <div style={styles.healthCard}>
            <div style={styles.healthIcon}>🚀</div>
            <div style={styles.healthLabel}>API 서버</div>
            <div style={styles.healthValue}>{systemHealth.api}</div>
          </div>
          <div style={styles.healthCard}>
            <div style={styles.healthIcon}>📦</div>
            <div style={styles.healthLabel}>저장공간</div>
            <div style={styles.healthValue}>{systemHealth.storage}</div>
          </div>
          <div style={styles.healthCard}>
            <div style={styles.healthIcon}>⏱️</div>
            <div style={styles.healthLabel}>가동시간</div>
            <div style={styles.healthValue}>{systemHealth.uptime}</div>
          </div>
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>환경 설정</h2>
        <div style={styles.configBox}>
          <div style={styles.configItem}>
            <span style={styles.configLabel}>API URL:</span>
            <span style={styles.configValue}>{import.meta.env.VITE_API_URL}</span>
          </div>
          <div style={styles.configItem}>
            <span style={styles.configLabel}>환경:</span>
            <span style={styles.configValue}>{import.meta.env.MODE}</span>
          </div>
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>관리 작업</h2>
        <div style={styles.actionsGrid}>
          <button style={styles.actionButton}>📊 백업 생성</button>
          <button style={styles.actionButton}>🔄 데이터 동기화</button>
          <button style={styles.actionButton}>🗑️ 캐시 삭제</button>
          <button style={styles.actionButton}>📝 로그 보기</button>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    padding: '40px 20px',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '32px',
  },
  backButton: {
    background: 'rgba(59, 130, 246, 0.3)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '12px',
    fontSize: '16px',
    cursor: 'pointer',
    marginBottom: '16px',
  },
  title: {
    color: 'white',
    fontSize: '36px',
    fontWeight: 'bold',
    margin: 0,
  },
  section: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '16px',
    padding: '32px',
    marginBottom: '24px',
  },
  sectionTitle: {
    color: 'white',
    fontSize: '24px',
    fontWeight: 'bold',
    marginTop: 0,
    marginBottom: '24px',
  },
  healthGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
  },
  healthCard: {
    background: 'rgba(16, 185, 129, 0.2)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    padding: '24px',
    textAlign: 'center',
  },
  healthIcon: {
    fontSize: '40px',
    marginBottom: '12px',
  },
  healthLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '14px',
    marginBottom: '8px',
  },
  healthValue: {
    color: 'white',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  configBox: {
    background: 'rgba(129, 199, 132, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    padding: '20px',
  },
  configItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  configLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '16px',
  },
  configValue: {
    color: 'white',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
  },
  actionButton: {
    background: 'rgba(59, 130, 246, 0.3)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    color: 'white',
    padding: '20px',
    borderRadius: '12px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
  },
};

export default AdminSystem;
