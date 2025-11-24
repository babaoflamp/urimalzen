import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";
import { useLanguageStore } from "../store/useLanguageStore";
import { translations } from "../utils/translations";
import { adminAPI } from "../services/api";
import Spinner from "../components/Spinner";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { language } = useLanguageStore();
  const t = translations[language];

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalWords: 0,
    totalRecordings: 0,
    activeUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadStats = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const data = await adminAPI.getStats();
      setStats(data);
      if (isRefresh) {
        toast.success("통계가 업데이트되었습니다");
      }
    } catch (error) {
      console.error("Failed to load stats:", error);
      toast.error("통계를 불러오는데 실패했습니다");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    // 관리자 권한 체크
    if (!user?.isAdmin) {
      navigate("/admin/login");
      return;
    }

    loadStats();
  }, [user, navigate, loadStats]);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const handleRefresh = () => {
    loadStats(true);
  };

  return (
    <div className="admin-dashboard-container">
      {/* 헤더 */}
      <div className="admin-header">
        <div className="admin-header-content">
          <h1>👨‍💼 {t.adminDashboard}</h1>
          <p>{t.appName}</p>
        </div>
        <div className="admin-header-actions">
          <button
            onClick={handleRefresh}
            className="admin-refresh-btn"
            disabled={refreshing}
            aria-label="통계 새로고침"
          >
            {refreshing ? "🔄 새로고침 중..." : "🔄 새로고침"}
          </button>
          <button onClick={handleLogout} className="admin-logout-btn" aria-label="로그아웃">
            {t.logout}
          </button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="admin-section-title">📊 통계 현황</div>
      {loading ? (
        <Spinner size="large" message="통계를 불러오는 중..." />
      ) : (
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-icon">👥</div>
            <div className="admin-stat-number">{stats.totalUsers}</div>
            <div className="admin-stat-label">{t.totalUsers}</div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">📚</div>
            <div className="admin-stat-number">{stats.totalWords}</div>
            <div className="admin-stat-label">{t.totalWords}</div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">🎤</div>
            <div className="admin-stat-number">{stats.totalRecordings}</div>
            <div className="admin-stat-label">{t.totalRecordings}</div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">✅</div>
            <div className="admin-stat-number">{stats.activeUsers}</div>
            <div className="admin-stat-label">{t.activeUsers}</div>
          </div>
        </div>
      )}

      {/* 메뉴 섹션 */}
      <div className="admin-section-title">⚙️ 관리 메뉴</div>
      <div className="admin-menu-grid">
        <div
          className="admin-menu-card"
          onClick={() => navigate("/admin/users")}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => e.key === "Enter" && navigate("/admin/users")}
        >
          <div className="admin-menu-icon">👥</div>
          <div className="admin-menu-title">{t.userManagement}</div>
          <div className="admin-menu-description">회원 정보 조회 및 관리</div>
        </div>

        <div
          className="admin-menu-card"
          onClick={() => navigate("/admin/words")}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => e.key === "Enter" && navigate("/admin/words")}
        >
          <div className="admin-menu-icon">📚</div>
          <div className="admin-menu-title">{t.wordManagement}</div>
          <div className="admin-menu-description">단어 추가, 수정, 삭제</div>
        </div>

        <div
          className="admin-menu-card"
          onClick={() => navigate("/admin/recordings")}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => e.key === "Enter" && navigate("/admin/recordings")}
        >
          <div className="admin-menu-icon">🎤</div>
          <div className="admin-menu-title">{t.recordingManagement}</div>
          <div className="admin-menu-description">사용자 녹음 파일 관리</div>
        </div>

        <div
          className="admin-menu-card"
          onClick={() => navigate("/admin/statistics")}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => e.key === "Enter" && navigate("/admin/statistics")}
        >
          <div className="admin-menu-icon">📊</div>
          <div className="admin-menu-title">{t.statistics}</div>
          <div className="admin-menu-description">학습 현황 및 통계</div>
        </div>

        <div
          className="admin-menu-card"
          onClick={() => navigate("/admin/kiip")}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => e.key === "Enter" && navigate("/admin/kiip")}
        >
          <div className="admin-menu-icon">🎓</div>
          <div className="admin-menu-title">{t.kiipContent}</div>
          <div className="admin-menu-description">단계별 학습 콘텐츠 관리</div>
        </div>

        {/* AI/TTS/STT 메뉴 */}
        <div
          className="admin-menu-card"
          onClick={() => navigate("/admin/ai-content")}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => e.key === "Enter" && navigate("/admin/ai-content")}
        >
          <div className="admin-menu-icon">🤖</div>
          <div className="admin-menu-title">{t.aiContentManagement}</div>
          <div className="admin-menu-description">AI 기반 콘텐츠 자동 생성</div>
        </div>

        <div
          className="admin-menu-card"
          onClick={() => navigate("/admin/comfyui")}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => e.key === "Enter" && navigate("/admin/comfyui")}
        >
          <div className="admin-menu-icon">🎨</div>
          <div className="admin-menu-title">이미지 생성 (ComfyUI)</div>
          <div className="admin-menu-description">AI 기반 이미지 자동 생성</div>
        </div>

        <div
          className="admin-menu-card"
          onClick={() => navigate("/admin/tts")}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => e.key === "Enter" && navigate("/admin/tts")}
        >
          <div className="admin-menu-icon">🔊</div>
          <div className="admin-menu-title">{t.ttsSettings}</div>
          <div className="admin-menu-description">음성 합성 설정 및 오디오 생성</div>
        </div>

        <div
          className="admin-menu-card"
          onClick={() => navigate("/admin/stt")}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => e.key === "Enter" && navigate("/admin/stt")}
        >
          <div className="admin-menu-icon">🎙️</div>
          <div className="admin-menu-title">{t.sttSettings}</div>
          <div className="admin-menu-description">음성 인식 및 발음 평가 설정</div>
        </div>

        <div
          className="admin-menu-card"
          onClick={() => navigate("/admin/system")}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => e.key === "Enter" && navigate("/admin/system")}
        >
          <div className="admin-menu-icon">⚙️</div>
          <div className="admin-menu-title">{t.systemSettings}</div>
          <div className="admin-menu-description">환경 설정 및 API 관리</div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
