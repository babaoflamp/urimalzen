import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';

interface User {
  _id: string;
  username: string;
  email: string;
  level: { kiip: number; cefr: string };
  totalScore: number;
  region: string;
  country: string;
  isAdmin: boolean;
  createdAt: string;
}

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    loadUsers();
  }, [page]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getUsers(page, 20);
      setUsers(response.users);
      setTotalPages(response.pagination.pages);
    } catch (error) {
      console.error('Failed to load users:', error);
      alert('사용자 로딩 실패');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery) {
      loadUsers();
      return;
    }
    try {
      setLoading(true);
      // Search implementation would go here
      const response = await adminAPI.getUsers(1, 20);
      setUsers(response.users.filter((u: User) =>
        u.username.includes(searchQuery) || u.email.includes(searchQuery)
      ));
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('정말 이 사용자를 삭제하시겠습니까?')) return;

    try {
      // Delete API call would go here
      alert('사용자 삭제 완료');
      loadUsers();
    } catch (error) {
      console.error('Delete failed:', error);
      alert('삭제 실패');
    }
  };

  const handleToggleAdmin = async (userId: string, currentStatus: boolean) => {
    try {
      // Toggle admin API call would go here
      alert('권한 변경 완료');
      loadUsers();
    } catch (error) {
      console.error('Toggle admin failed:', error);
      alert('권한 변경 실패');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <button style={styles.backButton} onClick={() => navigate('/admin/dashboard')}>
            ← 뒤로
          </button>
          <h1 style={styles.title}>👥 사용자 관리</h1>
        </div>
      </div>

      {/* Search Bar */}
      <div style={styles.searchBar}>
        <input
          type="text"
          placeholder="사용자 이름 또는 이메일 검색..."
          style={styles.searchInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button style={styles.searchButton} onClick={handleSearch}>
          🔍 검색
        </button>
      </div>

      {/* Users Table */}
      {loading ? (
        <div style={styles.loading}>로딩 중...</div>
      ) : (
        <>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>사용자명</th>
                  <th style={styles.th}>이메일</th>
                  <th style={styles.th}>레벨</th>
                  <th style={styles.th}>국가</th>
                  <th style={styles.th}>지역</th>
                  <th style={styles.th}>점수</th>
                  <th style={styles.th}>관리자</th>
                  <th style={styles.th}>가입일</th>
                  <th style={styles.th}>작업</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <tr key={user._id} style={idx % 2 === 0 ? styles.trEven : styles.trOdd}>
                    <td style={styles.td}>{user.username}</td>
                    <td style={styles.td}>{user.email}</td>
                    <td style={styles.td}>Lv{user.level.kiip} ({user.level.cefr})</td>
                    <td style={styles.td}>{user.country}</td>
                    <td style={styles.td}>{user.region}</td>
                    <td style={styles.td}>{user.totalScore}</td>
                    <td style={styles.td}>{user.isAdmin ? '✅' : '❌'}</td>
                    <td style={styles.td}>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td style={styles.td}>
                      <button
                        style={styles.actionButton}
                        onClick={() => {
                          setSelectedUser(user);
                          setShowEditModal(true);
                        }}
                      >
                        수정
                      </button>
                      <button
                        style={{...styles.actionButton, background: 'rgba(239, 68, 68, 0.3)'}}
                        onClick={() => handleDelete(user._id)}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
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

      {/* Edit Modal - Simple implementation */}
      {showEditModal && selectedUser && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h2 style={styles.modalTitle}>사용자 정보 수정</h2>
            <p style={styles.modalText}>사용자: {selectedUser.username}</p>
            <p style={styles.modalText}>이메일: {selectedUser.email}</p>
            <div style={styles.modalActions}>
              <button style={styles.modalButton} onClick={() => setShowEditModal(false)}>
                닫기
              </button>
            </div>
          </div>
        </div>
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
  searchBar: {
    display: 'flex',
    gap: '16px',
    marginBottom: '24px',
  },
  searchInput: {
    flex: 1,
    background: 'rgba(255, 255, 255, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '12px',
    padding: '12px 20px',
    color: 'white',
    fontSize: '16px',
  },
  searchButton: {
    background: 'rgba(16, 185, 129, 0.3)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    color: 'white',
    padding: '12px 32px',
    borderRadius: '12px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: 'bold',
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
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    background: 'rgba(20, 20, 20, 0.95)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '16px',
    padding: '32px',
    minWidth: '400px',
  },
  modalTitle: {
    color: 'white',
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '16px',
  },
  modalText: {
    color: 'white',
    fontSize: '16px',
    marginBottom: '8px',
  },
  modalActions: {
    display: 'flex',
    gap: '16px',
    marginTop: '24px',
  },
  modalButton: {
    flex: 1,
    background: 'rgba(59, 130, 246, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    color: 'white',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

export default AdminUsers;
