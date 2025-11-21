import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { unitAPI } from '../services/api';

const AdminKIIP = () => {
  const navigate = useNavigate();
  const [units, setUnits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUnits();
  }, []);

  const loadUnits = async () => {
    try {
      setLoading(true);
      const response = await unitAPI.getAllUnits();
      setUnits(response.data);
    } catch (error) {
      console.error('Failed to load units:', error);
      alert('유닛 로딩 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={() => navigate('/admin/dashboard')}>
          ← 뒤로
        </button>
        <h1 style={styles.title}>🎓 KIIP 컨텐츠 관리</h1>
      </div>

      <div style={styles.infoBox}>
        <h3 style={styles.infoTitle}>KIIP 커리큘럼</h3>
        <p style={styles.infoText}>
          Korea Immigration & Integration Program (KIIP) 단계별 학습 컨텐츠를 관리합니다.
        </p>
        <p style={styles.infoText}>
          총 {units.length}개의 유닛이 등록되어 있습니다.
        </p>
      </div>

      {loading ? (
        <div style={styles.loading}>로딩 중...</div>
      ) : (
        <div style={styles.unitsGrid}>
          {units.map((unit) => (
            <div key={unit._id} style={styles.unitCard}>
              <div style={styles.unitHeader}>
                <h3 style={styles.unitTitle}>{unit.title}</h3>
                <span style={styles.unitLevel}>Level {unit.kiipLevel}</span>
              </div>
              <p style={styles.unitSubtitle}>{unit.titleMn}</p>
              <div style={styles.unitStats}>
                <span style={styles.statItem}>📚 {unit.lessons?.length || 0} 레슨</span>
                <span style={styles.statItem}>✅ 챌린지 포함</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={styles.actionSection}>
        <button style={styles.primaryButton}>+ 새 유닛 추가</button>
        <button style={styles.secondaryButton}>카테고리 관리</button>
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
  infoBox: {
    background: 'rgba(59, 130, 246, 0.2)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '32px',
  },
  infoTitle: {
    color: 'white',
    fontSize: '20px',
    fontWeight: 'bold',
    marginTop: 0,
    marginBottom: '12px',
  },
  infoText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '16px',
    margin: '8px 0',
  },
  unitsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
    marginBottom: '32px',
  },
  unitCard: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '16px',
    padding: '24px',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
  unitHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    marginBottom: '12px',
  },
  unitTitle: {
    color: 'white',
    fontSize: '18px',
    fontWeight: 'bold',
    margin: 0,
    flex: 1,
  },
  unitLevel: {
    background: 'rgba(16, 185, 129, 0.3)',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  unitSubtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '14px',
    marginBottom: '16px',
  },
  unitStats: {
    display: 'flex',
    gap: '16px',
  },
  statItem: {
    color: 'white',
    fontSize: '14px',
  },
  actionSection: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
  },
  primaryButton: {
    background: 'rgba(16, 185, 129, 0.3)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    color: 'white',
    padding: '16px 32px',
    borderRadius: '12px',
    fontSize: '18px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  secondaryButton: {
    background: 'rgba(59, 130, 246, 0.3)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    color: 'white',
    padding: '16px 32px',
    borderRadius: '12px',
    fontSize: '18px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  loading: {
    color: 'white',
    fontSize: '24px',
    textAlign: 'center',
    padding: '100px 0',
  },
};

export default AdminKIIP;
