import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';
import type { Word } from '../types';

const AdminWords = () => {
  const navigate = useNavigate();
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Word>>({});

  useEffect(() => {
    loadWords();
  }, []);

  const loadWords = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getWords();
      setWords(response);
    } catch (error) {
      console.error('Failed to load words:', error);
      alert('단어 로딩 실패');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchQuery) {
      loadWords();
      return;
    }
    const filtered = words.filter((w) =>
      w.koreanWord.includes(searchQuery) || w.mongolianWord.includes(searchQuery)
    );
    setWords(filtered);
  };

  const handleEdit = (word: Word) => {
    setSelectedWord(word);
    setEditForm(word);
    setShowEditModal(true);
  };

  const handleSave = async () => {
    if (!selectedWord) return;
    try {
      await adminAPI.updateWord(selectedWord._id, editForm);
      alert('단어 수정 완료');
      setShowEditModal(false);
      loadWords();
    } catch (error) {
      console.error('Update failed:', error);
      alert('수정 실패');
    }
  };

  const handleDelete = async (wordId: string) => {
    if (!confirm('정말 이 단어를 삭제하시겠습니까?')) return;
    try {
      await adminAPI.deleteWord(wordId);
      alert('단어 삭제 완료');
      loadWords();
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
        <h1 style={styles.title}>📚 단어 관리</h1>
      </div>

      <div style={styles.searchBar}>
        <input
          type="text"
          placeholder="한국어 또는 몽골어 검색..."
          style={styles.searchInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button style={styles.searchButton} onClick={handleSearch}>
          🔍 검색
        </button>
      </div>

      {loading ? (
        <div style={styles.loading}>로딩 중...</div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>순서</th>
                <th style={styles.th}>한국어</th>
                <th style={styles.th}>몽골어</th>
                <th style={styles.th}>발음</th>
                <th style={styles.th}>레벨</th>
                <th style={styles.th}>카테고리</th>
                <th style={styles.th}>작업</th>
              </tr>
            </thead>
            <tbody>
              {words.slice(0, 50).map((word, idx) => (
                <tr key={word._id} style={idx % 2 === 0 ? styles.trEven : styles.trOdd}>
                  <td style={styles.td}>{word.order}</td>
                  <td style={styles.td}>{word.koreanWord}</td>
                  <td style={styles.td}>{word.mongolianWord}</td>
                  <td style={styles.td}>{word.pronunciation}</td>
                  <td style={styles.td}>Lv{word.level.kiip}</td>
                  <td style={styles.td}>{word.mainCategory}</td>
                  <td style={styles.td}>
                    <button style={styles.actionButton} onClick={() => handleEdit(word)}>
                      수정
                    </button>
                    <button
                      style={{...styles.actionButton, background: 'rgba(239, 68, 68, 0.3)'}}
                      onClick={() => handleDelete(word._id)}
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showEditModal && selectedWord && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h2 style={styles.modalTitle}>단어 수정</h2>
            <div style={styles.formGroup}>
              <label style={styles.label}>한국어:</label>
              <input
                style={styles.input}
                value={editForm.koreanWord || ''}
                onChange={(e) => setEditForm({...editForm, koreanWord: e.target.value})}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>몽골어:</label>
              <input
                style={styles.input}
                value={editForm.mongolianWord || ''}
                onChange={(e) => setEditForm({...editForm, mongolianWord: e.target.value})}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>발음:</label>
              <input
                style={styles.input}
                value={editForm.pronunciation || ''}
                onChange={(e) => setEditForm({...editForm, pronunciation: e.target.value})}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>설명:</label>
              <textarea
                style={{...styles.input, minHeight: '100px'}}
                value={editForm.description || ''}
                onChange={(e) => setEditForm({...editForm, description: e.target.value})}
              />
            </div>
            <div style={styles.modalActions}>
              <button style={styles.modalButton} onClick={handleSave}>
                저장
              </button>
              <button
                style={{...styles.modalButton, background: 'rgba(107, 114, 128, 0.3)'}}
                onClick={() => setShowEditModal(false)}
              >
                취소
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
    padding: '20px',
  },
  modalContent: {
    background: 'rgba(20, 20, 20, 0.95)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '16px',
    padding: '32px',
    minWidth: '500px',
    maxWidth: '600px',
    maxHeight: '80vh',
    overflowY: 'auto',
  },
  modalTitle: {
    color: 'white',
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '24px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    color: 'white',
    fontSize: '14px',
    fontWeight: 'bold',
    display: 'block',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '8px',
    padding: '12px',
    color: 'white',
    fontSize: '16px',
  },
  modalActions: {
    display: 'flex',
    gap: '16px',
    marginTop: '24px',
  },
  modalButton: {
    flex: 1,
    background: 'rgba(16, 185, 129, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    color: 'white',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

export default AdminWords;
