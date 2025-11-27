import { useAuthStore } from "../store/useAuthStore";
import { useLearningStore } from "../store/useLearningStore";
import { useLanguageStore } from "../store/useLanguageStore";
import { useNavigate } from "react-router-dom";
import { translations } from "../utils/translations";
import "./Header.css";

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
    <div className="header-container">
      {/* 좌측: 국기 + 앱 이름 */}
      <div className="header-left">
        <div className="flag-container">
          <img
            src="/images/flags/korea.png"
            alt="한국"
            className="flag-image"
            onClick={() => setLanguage("ko")}
          />
          <img
            src="/images/flags/china.webp"
            alt="중국"
            className="flag-image"
            onClick={() => setLanguage("zh")}
          />
        </div>
        <h1 className="app-name">{t.appName}</h1>
      </div>

      {/* 중앙: 사용자 정보 + 진도 */}
      <div className="info-box">
        <div className="info-row">
          {user && (
            <>
              <span className="info-text">
                <strong>{user.username}</strong>
              </span>
              <span className="separator">|</span>
              <span className="info-text">CEFR {user.level.cefr}</span>
              <span className="separator">|</span>
              <span className="info-text">
                {t.progress} {completedWords}/{totalWords}
              </span>
            </>
          )}
        </div>
      </div>

      {/* 우측: 점수 + 순위 + 로그아웃 */}
      <div className="header-right">
        {user && (
          <>
            <span className="score-badge">
              🏆 {user.totalScore}
              {t.score}
            </span>
            {ranking && ranking.globalRank > 0 && (
              <>
                <span className="separator">|</span>
                <span className="rank-text">
                  {t.globalRank} {ranking.globalRank}
                  {t.rank}
                </span>
              </>
            )}
          </>
        )}
        <button onClick={handleLogout} className="logout-btn">
          {t.logout}
        </button>
      </div>
    </div>
  );
};

export default Header;
