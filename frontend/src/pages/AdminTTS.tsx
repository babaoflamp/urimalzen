import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminCommon.css";
import { useAuthStore } from "../store/useAuthStore";
import { adminTTSAPI, wordAPI } from "../services/api";
import type { Word } from "../types";

const AdminTTS = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [words, setWords] = useState<Word[]>([]);
  const [selectedWord, setSelectedWord] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>("");

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate("/admin/login");
      return;
    }
    loadWords();
    testTTSConnection();
  }, [user, navigate]);

  const loadWords = async () => {
    try {
      const response = await wordAPI.getAllWords();
      setWords(response.data);
    } catch (error) {
      console.error("Failed to load words:", error);
    }
  };

  const testTTSConnection = async () => {
    try {
      const response = await adminTTSAPI.testConnection();
      setConnectionStatus(response.data.message);
    } catch (error: any) {
      setConnectionStatus(`연결 실패: ${error.message}`);
    }
  };

  const handleGenerateWordAudio = async () => {
    if (!selectedWord) {
      alert("단어를 선택해주세요");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await adminTTSAPI.generateWordAudio(selectedWord);
      setResult(response);
      alert("단어 오디오 생성 완료!");
    } catch (error: any) {
      alert(`오류: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="admin-back-button"
        >
          ← 대시보드로
        </button>
        <h1 className="admin-page-title">TTS 오디오 생성</h1>
      </div>

      <div className="admin-status-card">
        <div className="admin-status-label">TTS 서비스 연결 상태:</div>
        <div
          className={
            connectionStatus.includes("성공")
              ? "admin-status-success"
              : "admin-status-error"
          }
        >
          {connectionStatus || "확인 중..."}
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card-title">단어 선택</h2>
        <select
          value={selectedWord}
          onChange={(e) => setSelectedWord(e.target.value)}
          className="admin-select"
        >
          <option value="">-- 단어를 선택하세요 --</option>
          {words.map((word) => (
            <option key={word._id} value={word._id}>
              {word.koreanWord} ({word.mongolianWord})
            </option>
          ))}
        </select>
      </div>

      <div className="admin-action-grid">
        <button
          onClick={handleGenerateWordAudio}
          disabled={loading || !selectedWord}
          className="admin-action-button"
        >
          {loading ? "생성 중..." : "단어 오디오 생성"}
        </button>
      </div>

      {result && (
        <div className="admin-result-card">
          <h2 className="admin-card-title">생성 결과</h2>
          <pre className="admin-result-pre">
            {JSON.stringify(result.data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default AdminTTS;
