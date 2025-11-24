import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { comfyuiAPI } from "../services/api";
import type { ComfyUIQueueStatus } from "../types";
import "./AdminCommon.css";

const AdminComfyUI: React.FC = () => {
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [queueStatus, setQueueStatus] = useState<ComfyUIQueueStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 단어 일러스트 생성
  const [wordForm, setWordForm] = useState({
    koreanWord: "",
    englishDescription: "",
  });

  // 테마 이미지 생성
  const [themeForm, setThemeForm] = useState({
    theme: "",
    style: "illustration" as "realistic" | "illustration" | "minimal",
    width: 1024,
    height: 1024,
  });

  // 생성된 이미지
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api$/, "");

  // 연결 테스트
  const checkConnection = useCallback(async () => {
    try {
      const response = await comfyuiAPI.testConnection();
      setIsConnected(response.success);
    } catch (error) {
      console.error("ComfyUI connection test failed:", error);
      setIsConnected(false);
    }
  }, []);

  // 큐 상태 확인
  const fetchQueueStatus = useCallback(async () => {
    try {
      const response = await comfyuiAPI.getQueueStatus();
      if (response.success) {
        setQueueStatus(response.data);
      }
    } catch (error) {
      console.error("Queue status error:", error);
    }
  }, []);

  useEffect(() => {
    checkConnection();
    fetchQueueStatus();
  }, [checkConnection, fetchQueueStatus]);

  // 단어 일러스트 생성
  const handleGenerateWordIllustration = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setGeneratedImage(null);

    try {
      console.log("Sending word illustration request:", wordForm);
      const response = await comfyuiAPI.generateWordIllustration(wordForm);

      if (response.success) {
        setGeneratedImage(response.imagePath);
        toast.success("이미지가 성공적으로 생성되었습니다!");
        setWordForm({ koreanWord: "", englishDescription: "" });
        fetchQueueStatus();
      }
    } catch (error: any) {
      console.error("Word illustration error:", error);
      const message = error?.response?.data?.message || "이미지 생성에 실패했습니다.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // 테마 이미지 생성
  const handleGenerateThemeImage = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setGeneratedImage(null);

    try {
      console.log("Sending theme image request:", themeForm);
      const response = await comfyuiAPI.generateThemeImage(themeForm);

      if (response.success) {
        setGeneratedImage(response.imagePath);
        toast.success("테마 이미지가 성공적으로 생성되었습니다!");
        setThemeForm({
          theme: "",
          style: "illustration",
          width: 1024,
          height: 1024,
        });
        fetchQueueStatus();
      }
    } catch (error: any) {
      console.error("Theme image error:", error);
      const message = error?.response?.data?.message || "이미지 생성에 실패했습니다.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-page-container">
      <div className="admin-header">
        <div className="admin-header-top">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="admin-back-button"
            aria-label="대시보드로 돌아가기"
          >
            ← 뒤로가기
          </button>
          <div className="admin-header-connection">
            <span
              className={`admin-status-badge ${
                isConnected ? "status-connected" : "status-disconnected"
              }`}
            >
              {isConnected ? "✓ ComfyUI 연결됨" : "✗ 연결 안됨"}
            </span>
            <button
              onClick={checkConnection}
              className="admin-refresh-button"
              title="연결 테스트"
              aria-label="ComfyUI 연결 테스트"
            >
              🔄
            </button>
          </div>
        </div>
        <h1 className="admin-page-title">ComfyUI 이미지 생성</h1>
      </div>

      {/* 2열 그리드 레이아웃 */}
      <div className="comfyui-grid-container">
        {/* 왼쪽 열: 단어 일러스트 생성 */}
        <div className="comfyui-left-column">
          {/* 단어 일러스트 생성 */}
          <div className="admin-section">
            <h2 className="admin-section-title">단어 일러스트 생성</h2>
            <form
              onSubmit={handleGenerateWordIllustration}
              className="admin-form"
            >
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
                    setWordForm({
                      ...wordForm,
                      englishDescription: e.target.value,
                    })
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
                aria-label="단어 일러스트 생성"
              >
                {isLoading ? "생성 중..." : "일러스트 생성"}
              </button>
            </form>
          </div>

          {/* 생성 결과 */}
          {generatedImage && (
            <div className="admin-section">
              <h2 className="admin-section-title">생성 결과</h2>
              <div className="admin-image-preview">
                <img
                  src={`${BASE_URL}/uploads/${generatedImage}`}
                  alt="생성된 이미지"
                  className="admin-generated-image"
                />
                <p className="admin-image-path">경로: {generatedImage}</p>
              </div>
            </div>
          )}
        </div>

        {/* 오른쪽 열: 테마 이미지 생성 */}
        <div className="comfyui-right-column">
          {/* 테마 이미지 생성 */}
          <div className="admin-section">
            <h2 className="admin-section-title">테마 이미지 생성</h2>
            <form onSubmit={handleGenerateThemeImage} className="admin-form">
              <div className="admin-form-group">
                <label className="admin-form-label">테마*</label>
                <input
                  type="text"
                  value={themeForm.theme}
                  onChange={(e) =>
                    setThemeForm({ ...themeForm, theme: e.target.value })
                  }
                  className="admin-input"
                  placeholder="예: dandelion seeds floating in the wind"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="theme-style">
                  스타일
                </label>
                <select
                  id="theme-style"
                  value={themeForm.style}
                  onChange={(e) =>
                    setThemeForm({
                      ...themeForm,
                      style: e.target.value as
                        | "realistic"
                        | "illustration"
                        | "minimal",
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
                  <label className="admin-form-label" htmlFor="image-width">
                    너비
                  </label>
                  <input
                    id="image-width"
                    type="number"
                    value={themeForm.width}
                    onChange={(e) =>
                      setThemeForm({
                        ...themeForm,
                        width: parseInt(e.target.value),
                      })
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
                  <label className="admin-form-label" htmlFor="image-height">
                    높이
                  </label>
                  <input
                    id="image-height"
                    type="number"
                    value={themeForm.height}
                    onChange={(e) =>
                      setThemeForm({
                        ...themeForm,
                        height: parseInt(e.target.value),
                      })
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
                aria-label="테마 이미지 생성"
              >
                {isLoading ? "생성 중..." : "테마 이미지 생성"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* 큐 상태 */}
      {queueStatus && (
        <div className="admin-section">
          <h2 className="admin-section-title">큐 상태</h2>
          <div className="admin-grid">
            <div className="admin-card">
              <div className="admin-card-label">실행 중</div>
              <div className="admin-card-value">
                {queueStatus.queue_running}
              </div>
            </div>
            <div className="admin-card">
              <div className="admin-card-label">대기 중</div>
              <div className="admin-card-value">
                {queueStatus.queue_pending}
              </div>
            </div>
          </div>
          <button
            onClick={fetchQueueStatus}
            className="admin-primary-button"
            aria-label="큐 상태 새로고침"
          >
            새로고침
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminComfyUI;
