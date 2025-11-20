import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { adminSTTAPI } from '../services/api';

const AdminSTT = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string>('');

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/admin/login');
      return;
    }
    testSTTConnection();
    loadEvaluations();
    loadStats();
  }, [user, navigate]);

  const testSTTConnection = async () => {
    try {
      const response = await adminSTTAPI.testConnection();
      setConnectionStatus(response.data.message);
    } catch (error: any) {
      setConnectionStatus(`연결 실패: ${error.message}`);
    }
  };

  const loadEvaluations = async () => {
    setLoading(true);
    try {
      const response = await adminSTTAPI.getAllEvaluations(1, 10);
      setEvaluations(response.data || []);
    } catch (error) {
      console.error('Failed to load evaluations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await adminSTTAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate('/admin/dashboard')} style={styles.backButton}>
          ← 대시보드로
        </button>
        <h1 style={styles.title}>STT 발음 평가 관리</h1>
      </div>

      <div style={styles.statusCard}>
        <div style={styles.statusLabel}>STT 서비스 연결 상태:</div>
        <div style={connectionStatus.includes('성공') ? styles.statusSuccess : styles.statusError}>
          {connectionStatus || '확인 중...'}
        </div>
      </div>

      {stats && (
        <div style={styles.statsCard}>
          <h2 style={styles.cardTitle}>전체 통계</h2>
          <div style={styles.statsGrid}>
            <div style={styles.statItem}>
              <div style={styles.statLabel}>총 평가 수</div>
              <div style={styles.statValue}>{stats.total || 0}</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statLabel}>평균 정확도</div>
              <div style={styles.statValue}>
                {stats.averages?.avgAccuracy
                  ? `${(stats.averages.avgAccuracy * 100).toFixed(1)}%`
                  : 'N/A'}
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>최근 평가 목록</h2>
        {loading ? (
          <div style={styles.loadingText}>로딩 중...</div>
        ) : evaluations.length === 0 ? (
          <div style={styles.emptyText}>평가 내역이 없습니다</div>
        ) : (
          <div style={styles.evaluationList}>
            {evaluations.map((evaluation) => (
              <div key={evaluation._id} style={styles.evaluationItem}>
                <div style={styles.evaluationInfo}>
                  <div>평가 ID: {evaluation._id}</div>
                  <div>정확도: {(evaluation.accuracyScore * 100).toFixed(1)}%</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    backgroundAttachment: 'fixed',
    padding: '20px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '30px',
  },
  backButton: {
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '12px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  title: {
    color: 'white',
    fontSize: '36px',
    fontWeight: 'bold',
    margin: 0,
    textShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
  },
  statusCard: {
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    padding: '20px',
    marginBottom: '20px',
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  statusLabel: {
    color: 'white',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  statusSuccess: {
    color: '#4ade80',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  statusError: {
    color: '#f87171',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  statsCard: {
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    padding: '30px',
    marginBottom: '20px',
  },
  cardTitle: {
    color: 'white',
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    margin: '0 0 20px 0',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
  },
  statItem: {
    background: 'rgba(255, 255, 255, 0.1)',
    padding: '20px',
    borderRadius: '12px',
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '14px',
    marginBottom: '8px',
  },
  statValue: {
    color: 'white',
    fontSize: '32px',
    fontWeight: 'bold',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    padding: '30px',
  },
  loadingText: {
    color: 'white',
    fontSize: '18px',
    textAlign: 'center',
    padding: '40px',
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '16px',
    textAlign: 'center',
    padding: '40px',
  },
  evaluationList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  evaluationItem: {
    background: 'rgba(255, 255, 255, 0.1)',
    padding: '20px',
    borderRadius: '12px',
  },
  evaluationInfo: {
    color: 'white',
    fontSize: '14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
};

export default AdminSTT;
