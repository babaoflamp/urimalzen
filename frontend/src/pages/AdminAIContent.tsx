import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminCommon.css';
import { useAuthStore } from '../store/useAuthStore';
import { adminAIAPI, wordAPI } from '../services/api';
import type { Word } from '../types';

const AdminAIContent = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [words, setWords] = useState<Word[]>([]);
  const [selectedWord, setSelectedWord] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>('');

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/admin/login');
      return;
    }
    loadWords();
    testAIConnection();
  }, [user, navigate]);

  const loadWords = async () => {
    try {
      const response = await wordAPI.getAllWords();
      setWords(response.data);
    } catch (error) {
      console.error('Failed to load words:', error);
    }
  };

  const testAIConnection = async () => {
    try {
      const response = await adminAIAPI.testConnection();
      setConnectionStatus(response.data.message);
    } catch (error: any) {
      setConnectionStatus(`연결 실패: ${error.message}`);
    }
  };

  const handleGenerateDescription = async () => {
    if (!selectedWord) {
      alert('단어를 선택해주세요');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await adminAIAPI.generateDescription(selectedWord);
      setResult(response);
      alert('설명 생성 완료!');
    } catch (error: any) {
      alert(`오류: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateExamples = async () => {
    if (!selectedWord) {
      alert('단어를 선택해주세요');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await adminAIAPI.generateExamples(selectedWord, 3);
      setResult(response);
      alert('예문 생성 완료!');
    } catch (error: any) {
      alert(`오류: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePronunciationTips = async () => {
    if (!selectedWord) {
      alert('단어를 선택해주세요');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await adminAIAPI.generatePronunciationTips(selectedWord);
      setResult(response);
      alert('발음 팁 생성 완료!');
    } catch (error: any) {
      alert(`오류: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateFullContent = async () => {
    if (!selectedWord) {
      alert('단어를 선택해주세요');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await adminAIAPI.generateFullContent(selectedWord);
      setResult(response);
      alert('전체 컨텐츠 생성 완료!');
      await loadWords(); // Reload words to show updated content
    } catch (error: any) {
      alert(`오류: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate('/admin/dashboard')} style={styles.backButton}>
          ← 대시보드로
        </button>
        <h1 style={styles.title}>AI 컨텐츠 생성</h1>
      </div>

      {/* Connection Status */}
      <div style={styles.statusCard}>
        <div style={styles.statusLabel}>Ollama 연결 상태:</div>
        <div style={connectionStatus.includes('성공') ? styles.statusSuccess : styles.statusError}>
          {connectionStatus || '확인 중...'}
        </div>
      </div>

      {/* Word Selection */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>단어 선택</h2>
        <select
          value={selectedWord}
          onChange={(e) => setSelectedWord(e.target.value)}
          style={styles.select}
        >
          <option value="">-- 단어를 선택하세요 --</option>
          {words.map((word) => (
            <option key={word._id} value={word._id}>
              {word.koreanWord} ({word.mongolianWord})
            </option>
          ))}
        </select>
      </div>

      {/* Action Buttons */}
      <div style={styles.actionGrid}>
        <button
          onClick={handleGenerateDescription}
          disabled={loading || !selectedWord}
          style={{
            ...styles.actionButton,
            ...(loading || !selectedWord ? styles.buttonDisabled : {}),
          }}
        >
          {loading ? '생성 중...' : '설명 생성'}
        </button>

        <button
          onClick={handleGenerateExamples}
          disabled={loading || !selectedWord}
          style={{
            ...styles.actionButton,
            ...(loading || !selectedWord ? styles.buttonDisabled : {}),
          }}
        >
          {loading ? '생성 중...' : '예문 생성'}
        </button>

        <button
          onClick={handleGeneratePronunciationTips}
          disabled={loading || !selectedWord}
          style={{
            ...styles.actionButton,
            ...(loading || !selectedWord ? styles.buttonDisabled : {}),
          }}
        >
          {loading ? '생성 중...' : '발음 팁 생성'}
        </button>

        <button
          onClick={handleGenerateFullContent}
          disabled={loading || !selectedWord}
          style={{
            ...styles.actionButton,
            ...styles.actionButtonPrimary,
            ...(loading || !selectedWord ? styles.buttonDisabled : {}),
          }}
        >
          {loading ? '생성 중...' : '전체 컨텐츠 생성'}
        </button>
      </div>

      {/* Result Display */}
      {result && (
        <div style={styles.resultCard}>
          <h2 style={styles.cardTitle}>생성 결과</h2>
          <pre style={styles.resultPre}>{JSON.stringify(result.data, null, 2)}</pre>
        </div>
      )}
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
    transition: 'all 0.3s ease',
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
  card: {
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
  select: {
    width: '100%',
    padding: '15px',
    fontSize: '16px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    background: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    outline: 'none',
  },
  actionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  actionButton: {
    background: 'rgba(99, 102, 241, 0.5)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    color: 'white',
    padding: '20px',
    borderRadius: '16px',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
  },
  actionButtonPrimary: {
    background: 'rgba(34, 197, 94, 0.5)',
  },
  buttonDisabled: {
    background: 'rgba(156, 163, 175, 0.3)',
    cursor: 'not-allowed',
    opacity: 0.5,
  },
  resultCard: {
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    padding: '30px',
  },
  resultPre: {
    background: 'rgba(0, 0, 0, 0.3)',
    color: 'white',
    padding: '20px',
    borderRadius: '12px',
    overflow: 'auto',
    maxHeight: '400px',
    fontSize: '14px',
    lineHeight: '1.6',
  },
};

export default AdminAIContent;
