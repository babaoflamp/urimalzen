import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./AdminCommon.css";
import { useAuthStore } from "../store/useAuthStore";
import { adminAIAPI, wordAPI } from "../services/api";
import type { Word } from "../types";
import AdminLayout from "../components/AdminLayout";

const AdminAIContent = () => {
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
    testAIConnection();
  }, [user, navigate]);

  const loadWords = async () => {
    try {
      const response = await wordAPI.getAllWords();
      setWords(response.data);
    } catch (error) {
      console.error("Failed to load words:", error);
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
      toast.error("단어를 선택해주세요");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await adminAIAPI.generateDescription(selectedWord);
      setResult(response);
      toast.success("설명 생성 완료!");
    } catch (error: any) {
      toast.error(`오류: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateExamples = async () => {
    if (!selectedWord) {
      toast.error("단어를 선택해주세요");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await adminAIAPI.generateExamples(selectedWord, 3);
      setResult(response);
      toast.success("예문 생성 완료!");
    } catch (error: any) {
      toast.error(`오류: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePronunciationTips = async () => {
    if (!selectedWord) {
      toast.error("단어를 선택해주세요");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await adminAIAPI.generatePronunciationTips(selectedWord);
      setResult(response);
      toast.success("발음 팁 생성 완료!");
    } catch (error: any) {
      toast.error(`오류: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateFullContent = async () => {
    if (!selectedWord) {
      toast.error("단어를 선택해주세요");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await adminAIAPI.generateFullContent(selectedWord);
      setResult(response);
      toast.success("전체 컨텐츠 생성 완료!");
      await loadWords(); // Reload words to show updated content
    } catch (error: any) {
      toast.error(`오류: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-page-container">
        <div className="admin-page-header">
          <h1 className="admin-page-title">🤖 AI 컨텐츠 생성</h1>
        </div>

      {/* Connection Status */}
      <div className="admin-status-card">
        <div className="admin-status-label">Ollama 연결 상태:</div>
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

      {/* Word Selection */}
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

      {/* Action Buttons */}
      <div className="admin-action-grid">
        <button
          onClick={handleGenerateDescription}
          disabled={loading || !selectedWord}
          className="admin-action-button"
        >
          {loading ? "생성 중..." : "설명 생성"}
        </button>

        <button
          onClick={handleGenerateExamples}
          disabled={loading || !selectedWord}
          className="admin-action-button"
        >
          {loading ? "생성 중..." : "예문 생성"}
        </button>

        <button
          onClick={handleGeneratePronunciationTips}
          disabled={loading || !selectedWord}
          className="admin-action-button"
        >
          {loading ? "생성 중..." : "발음 팁 생성"}
        </button>

        <button
          onClick={handleGenerateFullContent}
          disabled={loading || !selectedWord}
          className="admin-action-button admin-primary-button"
        >
          {loading ? "생성 중..." : "전체 컨텐츠 생성"}
        </button>
      </div>

      {/* Result Display */}
      {result && (
        <div className="admin-result-card">
          <h2 className="admin-card-title">생성 결과</h2>
          <pre className="admin-result-pre">
            {JSON.stringify(result.data, null, 2)}
          </pre>
        </div>
      )}
      </div>
    </AdminLayout>
  );
};

export default AdminAIContent;
