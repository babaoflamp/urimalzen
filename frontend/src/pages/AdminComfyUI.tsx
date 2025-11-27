import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { comfyuiAPI } from "../services/api";
import type { ComfyUIQueueStatus } from "../types";
import AdminLayout from "../components/AdminLayout";
import "./AdminCommon.css";

const AdminComfyUI: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [queueStatus, setQueueStatus] = useState<ComfyUIQueueStatus | null>(
    null
  );
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

  const BASE_URL = (
    import.meta.env.VITE_API_URL || "http://localhost:5000/api"
  ).replace(/\/api$/, "");

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
      const message =
        error?.response?.data?.message || "이미지 생성에 실패했습니다.";
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
      const message =
        error?.response?.data?.message || "이미지 생성에 실패했습니다.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-page-container">
        <div className="admin-page-header">
          <h1 className="admin-page-title">🖼️ 이미지 생성 설정</h1>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span
              className={`admin-status-badge ${
                isConnected ? "status-connected" : "status-disconnected"
              }`}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                background: isConnected
                  ? "rgba(16, 185, 129, 0.3)"
                  : "rgba(239, 68, 68, 0.3)",
                color: "white",
              }}
            >
              {isConnected ? "✓ ComfyUI 연결됨" : "✗ 연결 안됨"}
            </span>
            <button
              onClick={checkConnection}
              className="admin-refresh-button"
              title="연결 테스트"
              aria-label="ComfyUI 연결 테스트"
            >
              🔄 테스트
            </button>
          </div>
        </div>
        <div style={{ marginBottom: 24, color: "#555", fontSize: 16 }}>
          이미지 생성에 사용할 단어/테마 및 스타일을 설정할 수 있습니다.
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
                <div className="admin-form-inline-group">
                  <label className="admin-form-inline-label">
                    한국어 단어* / 영어 설명 (선택)
                  </label>
                  <input
                    type="text"
                    value={wordForm.koreanWord}
                    onChange={(e) =>
                      setWordForm({ ...wordForm, koreanWord: e.target.value })
                    }
                    className="admin-form-inline-input admin-form-input-strong"
                    placeholder="예: 사과"
                    required
                    disabled={isLoading}
                  />
                  <input
                    type="text"
                    value={wordForm.englishDescription}
                    onChange={(e) =>
                      setWordForm({
                        ...wordForm,
                        englishDescription: e.target.value,
                      })
                    }
                    className="admin-form-inline-input"
                    placeholder="예: red apple on white background"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    className="admin-form-inline-button admin-primary-button"
                    disabled={isLoading || !isConnected}
                    aria-label="단어 일러스트 생성"
                  >
                    {isLoading ? "생성 중..." : "일러스트 생성"}
                  </button>
                </div>
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
                <div className="admin-form-inline-group">
                  <label className="admin-form-inline-label">테마*</label>
                  <input
                    type="text"
                    value={themeForm.theme}
                    onChange={(e) =>
                      setThemeForm({ ...themeForm, theme: e.target.value })
                    }
                    className="admin-form-inline-input"
                    placeholder="예: dandelion seeds floating in the wind"
                    required
                    disabled={isLoading}
                  />
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
                    className="admin-form-inline-input"
                    disabled={isLoading}
                    aria-label="이미지 스타일"
                    style={{ minWidth: 120 }}
                  >
                    <option value="illustration">일러스트</option>
                    <option value="realistic">사실적</option>
                    <option value="minimal">미니멀</option>
                  </select>
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
                    className="admin-form-inline-input"
                    min={512}
                    max={2048}
                    step={64}
                    disabled={isLoading}
                    aria-label="이미지 너비"
                    placeholder="너비"
                    style={{ maxWidth: 100 }}
                  />
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
                    className="admin-form-inline-input"
                    min={512}
                    max={2048}
                    step={64}
                    disabled={isLoading}
                    aria-label="이미지 높이"
                    placeholder="높이"
                    style={{ maxWidth: 100 }}
                  />
                  <button
                    type="submit"
                    className="admin-form-inline-button admin-primary-button"
                    disabled={isLoading || !isConnected}
                    aria-label="테마 이미지 생성"
                  >
                    {isLoading ? "생성 중..." : "테마 이미지 생성"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* 큐 상태 */}
        {queueStatus && (
          <div className="admin-section">
            <h2 className="admin-section-title">큐 상태</h2>
            <div
              className="admin-form-inline-group"
              style={{ marginBottom: 0 }}
            >
              <div className="admin-card admin-form-inline-card">
                <span className="admin-card-label admin-form-inline-label">
                  실행 중
                </span>
                <span className="admin-card-value">
                  {queueStatus.queue_running}
                </span>
              </div>
              <div className="admin-card admin-form-inline-card">
                <span className="admin-card-label admin-form-inline-label">
                  대기 중
                </span>
                <span className="admin-card-value">
                  {queueStatus.queue_pending}
                </span>
              </div>
              <button
                onClick={fetchQueueStatus}
                className="admin-form-inline-button admin-primary-button"
                aria-label="큐 상태 새로고침"
                style={{ minWidth: 120 }}
              >
                새로고침
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminComfyUI;
