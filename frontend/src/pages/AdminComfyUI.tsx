import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminCommon.css';

interface QueueStatus {
  queue_running: number;
  queue_pending: number;
}

const AdminComfyUI: React.FC = () => {
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connectionMessage, setConnectionMessage] = useState<string>('');
  const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 단어 일러스트 생성
  const [wordForm, setWordForm] = useState({
    koreanWord: '',
    englishDescription: '',
  });

  // 테마 이미지 생성
  const [themeForm, setThemeForm] = useState({
    theme: '',
    style: 'illustration' as 'realistic' | 'illustration' | 'minimal',
    width: 1024,
    height: 1024,
  });

  // 생성된 이미지
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generationMessage, setGenerationMessage] = useState<string>('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // 연결 테스트
  const checkConnection = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/comfyui/test`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setIsConnected(response.data.success);
      setConnectionMessage(response.data.message);
    } catch (error) {
      setIsConnected(false);
      setConnectionMessage(
        error instanceof Error ? error.message : '연결 실패'
      );
    }
  };

  // 큐 상태 확인
  const fetchQueueStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/comfyui/queue-status`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setQueueStatus(response.data.data);
      }
    } catch (error) {
      console.error('Queue status error:', error);
    }
  };

  useEffect(() => {
    checkConnection();
    fetchQueueStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 단어 일러스트 생성
  const handleGenerateWordIllustration = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setGenerationMessage('');
    setGeneratedImage(null);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/api/comfyui/word-illustration`,
        wordForm,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setGeneratedImage(response.data.imagePath);
        setGenerationMessage('이미지가 성공적으로 생성되었습니다!');
        setWordForm({ koreanWord: '', englishDescription: '' });
        fetchQueueStatus();
      }
    } catch (error) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : '이미지 생성에 실패했습니다.';
      setGenerationMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  // 테마 이미지 생성
  const handleGenerateThemeImage = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setGenerationMessage('');
    setGeneratedImage(null);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/api/comfyui/theme-image`,
        themeForm,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setGeneratedImage(response.data.imagePath);
        setGenerationMessage('테마 이미지가 성공적으로 생성되었습니다!');
        setThemeForm({
          theme: '',
          style: 'illustration',
          width: 1024,
          height: 1024,
        });
        fetchQueueStatus();
      }
    } catch (error) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : '이미지 생성에 실패했습니다.';
      setGenerationMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-page-container">
      <div className="admin-header">
        <button onClick={() => navigate('/admin')} className="admin-back-button">
          ← 뒤로가기
        </button>
        <h1 className="admin-page-title">ComfyUI 이미지 생성</h1>
      </div>

      {/* 연결 상태 */}
      <div className="admin-section">
        <h2 className="admin-section-title">연결 상태</h2>
        <div className="admin-info-box">
          <div className="admin-status-row">
            <span className="admin-status-label">ComfyUI 연결:</span>
            <span
              className={`admin-status-value ${
                isConnected ? 'status-connected' : 'status-disconnected'
              }`}
            >
              {isConnected ? '✓ 연결됨' : '✗ 연결 안됨'}
            </span>
          </div>
          <div className="admin-status-row">
            <span className="admin-status-label">메시지:</span>
            <span className="admin-status-value">{connectionMessage}</span>
          </div>
          <button onClick={checkConnection} className="admin-primary-button">
            연결 테스트
          </button>
        </div>
      </div>

      {/* 큐 상태 */}
      {queueStatus && (
        <div className="admin-section">
          <h2 className="admin-section-title">큐 상태</h2>
          <div className="admin-grid">
            <div className="admin-card">
              <div className="admin-card-label">실행 중</div>
              <div className="admin-card-value">{queueStatus.queue_running}</div>
            </div>
            <div className="admin-card">
              <div className="admin-card-label">대기 중</div>
              <div className="admin-card-value">{queueStatus.queue_pending}</div>
            </div>
          </div>
          <button onClick={fetchQueueStatus} className="admin-primary-button">
            새로고침
          </button>
        </div>
      )}

      {/* 단어 일러스트 생성 */}
      <div className="admin-section">
        <h2 className="admin-section-title">단어 일러스트 생성</h2>
        <form onSubmit={handleGenerateWordIllustration} className="admin-form">
          <div className="admin-form-group">
            <label className="admin-form-label">한국어 단어*</label>
            <input
              type="text"
              value={wordForm.koreanWord}
              onChange={(e) =>
                setWordForm({ ...wordForm, koreanWord: e.target.value })
              }
              className="admin-input"
              placeholder="예: 사과"
              required
              disabled={isLoading}
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">영어 설명 (선택)</label>
            <input
              type="text"
              value={wordForm.englishDescription}
              onChange={(e) =>
                setWordForm({ ...wordForm, englishDescription: e.target.value })
              }
              className="admin-input"
              placeholder="예: red apple on white background"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="admin-primary-button"
            disabled={isLoading || !isConnected}
          >
            {isLoading ? '생성 중...' : '일러스트 생성'}
          </button>
        </form>
      </div>

      {/* 테마 이미지 생성 */}
      <div className="admin-section">
        <h2 className="admin-section-title">테마 이미지 생성</h2>
        <form onSubmit={handleGenerateThemeImage} className="admin-form">
          <div className="admin-form-group">
            <label className="admin-form-label">테마*</label>
            <input
              type="text"
              value={themeForm.theme}
              onChange={(e) => setThemeForm({ ...themeForm, theme: e.target.value })}
              className="admin-input"
              placeholder="예: dandelion seeds floating in the wind"
              required
              disabled={isLoading}
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label" htmlFor="theme-style">스타일</label>
            <select
              id="theme-style"
              value={themeForm.style}
              onChange={(e) =>
                setThemeForm({
                  ...themeForm,
                  style: e.target.value as 'realistic' | 'illustration' | 'minimal',
                })
              }
              className="admin-input"
              disabled={isLoading}
              aria-label="이미지 스타일"
            >
              <option value="illustration">일러스트</option>
              <option value="realistic">사실적</option>
              <option value="minimal">미니멀</option>
            </select>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="image-width">너비</label>
              <input
                id="image-width"
                type="number"
                value={themeForm.width}
                onChange={(e) =>
                  setThemeForm({ ...themeForm, width: parseInt(e.target.value) })
                }
                className="admin-input"
                min={512}
                max={2048}
                step={64}
                disabled={isLoading}
                aria-label="이미지 너비"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="image-height">높이</label>
              <input
                id="image-height"
                type="number"
                value={themeForm.height}
                onChange={(e) =>
                  setThemeForm({ ...themeForm, height: parseInt(e.target.value) })
                }
                className="admin-input"
                min={512}
                max={2048}
                step={64}
                disabled={isLoading}
                aria-label="이미지 높이"
              />
            </div>
          </div>

          <button
            type="submit"
            className="admin-primary-button"
            disabled={isLoading || !isConnected}
          >
            {isLoading ? '생성 중...' : '테마 이미지 생성'}
          </button>
        </form>
      </div>

      {/* 생성 결과 */}
      {(generationMessage || generatedImage) && (
        <div className="admin-section">
          <h2 className="admin-section-title">생성 결과</h2>
          {generationMessage && (
            <div className="admin-info-box">
              <p>{generationMessage}</p>
            </div>
          )}
          {generatedImage && (
            <div className="admin-image-preview">
              <img
                src={`${API_URL}/uploads/${generatedImage}`}
                alt="Generated"
                className="admin-generated-image"
              />
              <p className="admin-image-path">경로: {generatedImage}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminComfyUI;
