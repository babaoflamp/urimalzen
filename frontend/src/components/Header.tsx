import { useAuthStore } from "../store/useAuthStore";
import { useLearningStore } from "../store/useLearningStore";
import { useLanguageStore } from "../store/useLanguageStore";
import { useNavigate } from "react-router-dom";
import { translations } from "../utils/translations";

const Header = () => {
  const { user, logout } = useAuthStore();
  const { userProgress, ranking } = useLearningStore();
  const { language, setLanguage } = useLanguageStore();
  const navigate = useNavigate();
  const t = translations[language];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // 완료한 단어 수 계산
  const completedWords = userProgress.filter((p) => p.completed).length;
  const totalWords = 9;

  return (
    <div style={styles.header}>
      {/* 좌측: 국기 + 앱 이름 */}
      <div style={styles.leftSection}>
        <div style={styles.flags}>
          <img 
            src="/images/flags/korea.png" 
            alt="한국" 
            style={styles.flagImage}
            onClick={() => setLanguage('ko')}
          />
          <img 
            src="/images/flags/mongol.png" 
            alt="몽골" 
            style={styles.flagImage}
            onClick={() => setLanguage('mn')}
          />
        </div>
        <h1 style={styles.appName}>{t.appName}</h1>
      </div>

      {/* 중앙: 사용자 정보 + 진도 */}
      <div style={styles.centerSection}>
        <div style={styles.infoRow}>
          {user && (
            <>
              <span style={styles.infoText}>
                <strong>{user.username}</strong>
              </span>
              <span style={styles.separator}>|</span>
              <span style={styles.infoText}>CEFR {user.level.cefr}</span>
              <span style={styles.separator}>|</span>
              <span style={styles.infoText}>
                {t.progress} {completedWords}/{totalWords}
              </span>
            </>
          )}
        </div>
      </div>

      {/* 우측: 점수 + 순위 + 로그아웃 */}
      <div style={styles.rightSection}>
        {user && (
          <>
            <span style={styles.scoreText}>🏆 {user.totalScore}{t.score}</span>
            {ranking && ranking.globalRank > 0 && (
              <>
                <span style={styles.separator}>|</span>
                <span style={styles.rankText}>{t.globalRank} {ranking.globalRank}{t.rank}</span>
              </>
            )}
          </>
        )}
        <button onClick={handleLogout} style={styles.logoutButton}>
          {t.logout}
        </button>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  header: {
    background: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    padding: "16px 24px",
    display: "grid",
    gridTemplateColumns: "1fr 2fr 1fr",
    gap: "20px",
    alignItems: "center",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.2)",
    borderRadius: "20px",
    maxWidth: "1600px",
    margin: "0 auto 16px auto",
    position: "relative",
    zIndex: 100,
  },
  leftSection: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  flags: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  flagImage: {
    width: "67px",
    height: "37px",
    borderRadius: "3px",
    objectFit: "contain",
    backgroundColor: "white",
    display: "block",
    cursor: "pointer",
    transition: "all 0.3s ease",
    opacity: 0.9,
  },
  appName: {
    color: "white",
    margin: 0,
    fontSize: "22px",
    fontWeight: "bold",
    textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
    whiteSpace: "nowrap",
  },
  centerSection: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    alignItems: "center",
  },
  infoRow: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  infoText: {
    color: "white",
    fontSize: "15px",
  },
  separator: {
    color: "rgba(255,255,255,0.6)",
    fontSize: "14px",
  },
  rightSection: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  scoreText: {
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
  },
  rankText: {
    color: "white",
    fontSize: "14px",
  },
  logoutButton: {
    background: "rgba(255, 255, 255, 0.3)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    color: "white",
    border: "1px solid rgba(255, 255, 255, 0.4)",
    padding: "10px 20px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
  },
};

export default Header;
