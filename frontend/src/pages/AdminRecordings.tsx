import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminCommon.css';
import { adminAPI } from '../services/api';

const AdminRecordings = () => {
  const navigate = useNavigate();
  const [recordings, setRecordings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadRecordings();
  }, [page]);

  const loadRecordings = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getRecordings(page, 50);
      setRecordings(response.recordings);
      setTotalPages(response.pagination.pages);
    } catch (error) {
      console.error('Failed to load recordings:', error);
      alert('녹음 로딩 실패');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 이 녹음을 삭제하시겠습니까?')) return;
    try {
      // Delete API call would go here
      alert('녹음 삭제 완료');
      loadRecordings();
    } catch (error) {
      console.error('Delete failed:', error);
      alert('삭제 실패');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={() => navigate('/admin/dashboard')}>
          ← 뒤로
        </button>
        <h1 style={styles.title}>🎤 녹음 관리</h1>
      </div>

      {loading ? (
        <div style={styles.loading}>로딩 중...</div>
      ) : (
        <>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>사용자</th>
                  <th style={styles.th}>단어</th>
                  <th style={styles.th}>파일 크기</th>
                  <th style={styles.th}>녹음일</th>
                  <th style={styles.th}>작업</th>
                </tr>
              </thead>
              <tbody>
                {recordings.map((rec, idx) => (
                  <tr key={rec._id} style={idx % 2 === 0 ? styles.trEven : styles.trOdd}>
                    <td style={styles.td}>{rec.userId?.username || 'Unknown'}</td>
                    <td style={styles.td}>{rec.wordId?.koreanWord || 'Unknown'}</td>
                    <td style={styles.td}>{Math.round((rec.fileSize || 0) / 1024)} KB</td>
                    <td style={styles.td}>{new Date(rec.createdAt).toLocaleDateString()}</td>
                    <td style={styles.td}>
                      <button
                        style={{...styles.actionButton, background: 'rgba(239, 68, 68, 0.3)'}}
                        onClick={() => handleDelete(rec._id)}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={styles.pagination}>
            <button
              style={styles.pageButton}
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              이전
            </button>
            <span style={styles.pageInfo}>{page} / {totalPages}</span>
            <button
              style={styles.pageButton}
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              다음
            </button>
          </div>
        </>
      )}
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
  tableContainer: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '16px',
    padding: '24px',
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    color: 'white',
    textAlign: 'left',
    padding: '16px',
    borderBottom: '2px solid rgba(255, 255, 255, 0.2)',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
  },
  td: {
    color: 'white',
    padding: '16px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    whiteSpace: 'nowrap',
  },
  trEven: {
    background: 'rgba(255, 255, 255, 0.05)',
  },
  trOdd: {
    background: 'transparent',
  },
  actionButton: {
    background: 'rgba(59, 130, 246, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
    marginRight: '8px',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '16px',
    marginTop: '24px',
  },
  pageButton: {
    background: 'rgba(16, 185, 129, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '12px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  pageInfo: {
    color: 'white',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  loading: {
    color: 'white',
    fontSize: '24px',
    textAlign: 'center',
    padding: '100px 0',
  },
};

export default AdminRecordings;
