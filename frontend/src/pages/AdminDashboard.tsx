import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { adminAPI } from "../services/api";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalWords: 0,
    totalRecordings: 0,
    activeUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: 관리자 권한 체크
    // if (!user?.isAdmin) {
    //   navigate('/admin/login');
    //   return;
    // }

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
          <h1 style={styles.title}>👨‍💼 관리자 대시보드</h1>
          <p style={styles.subtitle}>우리말젠 Admin</p>
        </div>
        <button onClick={handleLogout} style={styles.logoutButton}>
          로그아웃
        </button>
      </div>

      {/* 통계 카드 */}
      <div style={styles.statsGrid}>
        {loading ? (
          <div style={styles.loading}>통계 데이터 로딩 중...</div>
        ) : (
          <>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>👥</div>
              <div style={styles.statNumber}>{stats.totalUsers}</div>
              <div style={styles.statLabel}>전체 사용자</div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statIcon}>📚</div>
              <div style={styles.statNumber}>{stats.totalWords}</div>
              <div style={styles.statLabel}>단어 수</div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statIcon}>🎤</div>
              <div style={styles.statNumber}>{stats.totalRecordings}</div>
              <div style={styles.statLabel}>총 녹음</div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statIcon}>✅</div>
              <div style={styles.statNumber}>{stats.activeUsers}</div>
              <div style={styles.statLabel}>활성 사용자</div>
            </div>
          </>
        )}
      </div>

      {/* 메뉴 섹션 */}
      <div style={styles.menuGrid}>
        <div
          style={styles.menuCard}
          onClick={() => alert("사용자 관리 기능 준비 중")}
        >
          <div style={styles.menuIcon}>👥</div>
          <div style={styles.menuTitle}>사용자 관리</div>
          <div style={styles.menuDescription}>회원 정보 조회 및 관리</div>
        </div>

        <div
          style={styles.menuCard}
          onClick={() => alert("단어 관리 기능 준비 중")}
        >
          <div style={styles.menuIcon}>📚</div>
          <div style={styles.menuTitle}>단어 관리</div>
          <div style={styles.menuDescription}>단어 추가, 수정, 삭제</div>
        </div>

        <div
          style={styles.menuCard}
          onClick={() => alert("녹음 관리 기능 준비 중")}
        >
          <div style={styles.menuIcon}>🎤</div>
          <div style={styles.menuTitle}>녹음 관리</div>
          <div style={styles.menuDescription}>사용자 녹음 파일 관리</div>
        </div>

        <div style={styles.menuCard} onClick={() => alert("통계 기능 준비 중")}>
          <div style={styles.menuIcon}>📊</div>
          <div style={styles.menuTitle}>통계 분석</div>
          <div style={styles.menuDescription}>학습 현황 및 통계</div>
        </div>

        <div
          style={styles.menuCard}
          onClick={() => alert("KIIP 콘텐츠 관리 기능 준비 중")}
        >
          <div style={styles.menuIcon}>🎓</div>
          <div style={styles.menuTitle}>KIIP 콘텐츠</div>
          <div style={styles.menuDescription}>단계별 학습 콘텐츠 관리</div>
        </div>

        <div
          style={styles.menuCard}
          onClick={() => alert("시스템 설정 기능 준비 중")}
        >
          <div style={styles.menuIcon}>⚙️</div>
          <div style={styles.menuTitle}>시스템 설정</div>
          <div style={styles.menuDescription}>환경 설정 및 관리</div>
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
    padding: "32px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "32px",
    background: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    padding: "24px 32px",
    borderRadius: "24px",
    boxShadow: "0 8px 32px rgba(31, 38, 135, 0.2)",
  },
  title: {
    color: "white",
    fontSize: "32px",
    fontWeight: "bold",
    margin: "0 0 8px 0",
    textShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
  },
  subtitle: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: "16px",
    margin: 0,
  },
  logoutButton: {
    padding: "12px 24px",
    background: "rgba(239, 68, 68, 0.5)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    borderRadius: "12px",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
    transition: "all 0.3s ease",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "24px",
    marginBottom: "32px",
  },
  statCard: {
    background: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    padding: "32px",
    borderRadius: "24px",
    textAlign: "center",
    boxShadow: "0 8px 32px rgba(31, 38, 135, 0.2)",
  },
  statIcon: {
    fontSize: "48px",
    marginBottom: "16px",
  },
  statNumber: {
    fontSize: "36px",
    fontWeight: "bold",
    color: "white",
    marginBottom: "8px",
    textShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
  },
  statLabel: {
    fontSize: "16px",
    color: "rgba(255, 255, 255, 0.9)",
  },
  loading: {
    gridColumn: "1 / -1",
    textAlign: "center",
    color: "white",
    fontSize: "18px",
    padding: "40px",
  },
  menuGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px",
  },
  menuCard: {
    background: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    padding: "32px",
    borderRadius: "24px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 8px 32px rgba(31, 38, 135, 0.2)",
  },
  menuIcon: {
    fontSize: "48px",
    marginBottom: "16px",
  },
  menuTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "white",
    marginBottom: "8px",
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
  },
  menuDescription: {
    fontSize: "14px",
    color: "rgba(255, 255, 255, 0.8)",
  },
};

export default AdminDashboard;
