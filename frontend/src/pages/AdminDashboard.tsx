import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useLanguageStore } from "../store/useLanguageStore";
import { translations } from "../utils/translations";
import { adminAPI } from "../services/api";

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

  useEffect(() => {
    // 관리자 권한 체크
    if (!user?.isAdmin) {
      navigate('/admin/login');
      return;
    }

    loadStats();
  }, [user, navigate]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getStats();
      setStats(data);
    } catch (error) {
      console.error("Failed to load stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div style={styles.container}>
      {/* 헤더 */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>👨‍💼 {t.adminDashboard}</h1>
          <p style={styles.subtitle}>우리말젠 Admin</p>
        </div>
        <button onClick={handleLogout} style={styles.logoutButton}>
          {t.logout}
        </button>
      </div>

      {/* 통계 카드 */}
      <div style={styles.sectionTitle}>📊 통계 현황</div>
      <div style={styles.statsGrid}>
        {loading ? (
          <div style={styles.loading}>{t.loading}</div>
        ) : (
          <>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>👥</div>
              <div style={styles.statNumber}>{stats.totalUsers}</div>
              <div style={styles.statLabel}>{t.totalUsers}</div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statIcon}>📚</div>
              <div style={styles.statNumber}>{stats.totalWords}</div>
              <div style={styles.statLabel}>{t.totalWords}</div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statIcon}>🎤</div>
              <div style={styles.statNumber}>{stats.totalRecordings}</div>
              <div style={styles.statLabel}>{t.totalRecordings}</div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statIcon}>✅</div>
              <div style={styles.statNumber}>{stats.activeUsers}</div>
              <div style={styles.statLabel}>{t.activeUsers}</div>
            </div>
          </>
        )}
      </div>

      {/* 메뉴 섹션 */}
      <div style={styles.sectionTitle}>⚙️ 관리 메뉴</div>
      <div style={styles.menuGrid}>
        <div
          style={styles.menuCard}
          onClick={() => navigate('/admin/users')}
        >
          <div style={styles.menuIcon}>👥</div>
          <div style={styles.menuTitle}>{t.userManagement}</div>
          <div style={styles.menuDescription}>회원 정보 조회 및 관리</div>
        </div>

        <div
          style={styles.menuCard}
          onClick={() => navigate('/admin/words')}
        >
          <div style={styles.menuIcon}>📚</div>
          <div style={styles.menuTitle}>{t.wordManagement}</div>
          <div style={styles.menuDescription}>단어 추가, 수정, 삭제</div>
        </div>

        <div
          style={styles.menuCard}
          onClick={() => navigate('/admin/recordings')}
        >
          <div style={styles.menuIcon}>🎤</div>
          <div style={styles.menuTitle}>{t.recordingManagement}</div>
          <div style={styles.menuDescription}>사용자 녹음 파일 관리</div>
        </div>

        <div
          style={styles.menuCard}
          onClick={() => navigate('/admin/statistics')}
        >
          <div style={styles.menuIcon}>📊</div>
          <div style={styles.menuTitle}>{t.statistics}</div>
          <div style={styles.menuDescription}>학습 현황 및 통계</div>
        </div>

        <div
          style={styles.menuCard}
          onClick={() => navigate('/admin/kiip')}
        >
          <div style={styles.menuIcon}>🎓</div>
          <div style={styles.menuTitle}>{t.kiipContent}</div>
          <div style={styles.menuDescription}>단계별 학습 콘텐츠 관리</div>
        </div>

        {/* AI/TTS/STT 메뉴 */}
        <div
          style={styles.menuCard}
          onClick={() => navigate('/admin/ai-content')}
        >
          <div style={styles.menuIcon}>🤖</div>
          <div style={styles.menuTitle}>{t.aiContentManagement}</div>
          <div style={styles.menuDescription}>AI 기반 콘텐츠 자동 생성</div>
        </div>

        <div
          style={styles.menuCard}
          onClick={() => navigate('/admin/tts')}
        >
          <div style={styles.menuIcon}>🔊</div>
          <div style={styles.menuTitle}>{t.ttsSettings}</div>
          <div style={styles.menuDescription}>음성 합성 설정 및 오디오 생성</div>
        </div>

        <div
          style={styles.menuCard}
          onClick={() => navigate('/admin/stt')}
        >
          <div style={styles.menuIcon}>🎙️</div>
          <div style={styles.menuTitle}>{t.sttSettings}</div>
          <div style={styles.menuDescription}>음성 인식 및 발음 평가 설정</div>
        </div>

        <div
          style={styles.menuCard}
          onClick={() => navigate('/admin/system')}
        >
          <div style={styles.menuIcon}>⚙️</div>
          <div style={styles.menuTitle}>{t.systemSettings}</div>
          <div style={styles.menuDescription}>환경 설정 및 API 관리</div>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)",
    backgroundAttachment: "fixed",
    padding: "24px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    background: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    padding: "16px 24px",
    borderRadius: "16px",
    boxShadow: "0 8px 32px rgba(31, 38, 135, 0.2)",
  },
  title: {
    color: "white",
    fontSize: "24px",
    fontWeight: "bold",
    margin: "0 0 4px 0",
    textShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
  },
  subtitle: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: "14px",
    margin: 0,
  },
  logoutButton: {
    padding: "8px 16px",
    background: "rgba(239, 68, 68, 0.5)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
    transition: "all 0.3s ease",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },
  statCard: {
    background: "rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    padding: "20px",
    borderRadius: "16px",
    textAlign: "center",
    boxShadow: "0 8px 32px rgba(31, 38, 135, 0.3)",
    minHeight: "140px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  statIcon: {
    fontSize: "32px",
    marginBottom: "8px",
  },
  statNumber: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "white",
    marginBottom: "4px",
    textShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
  },
  statLabel: {
    fontSize: "14px",
    color: "rgba(255, 255, 255, 0.9)",
  },
  loading: {
    gridColumn: "1 / -1",
    textAlign: "center",
    color: "white",
    fontSize: "18px",
    padding: "40px",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "white",
    marginBottom: "12px",
    marginTop: "12px",
    textShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
  },
  menuGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "16px",
  },
  menuCard: {
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    padding: "20px",
    borderRadius: "16px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 8px 32px rgba(31, 38, 135, 0.15)",
    minHeight: "140px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  menuIcon: {
    fontSize: "32px",
    marginBottom: "8px",
  },
  menuTitle: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "white",
    marginBottom: "4px",
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
  },
  menuDescription: {
    fontSize: "12px",
    color: "rgba(255, 255, 255, 0.8)",
  },
};

export default AdminDashboard;
