import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useTopikStore } from "../store/useTopikStore";
import { useLanguageStore } from "../store/useLanguageStore";
import Header from "../components/Header";
import MainNav from "../components/MainNav";
import "./TOPIKHome.css";

const TOPIKHome = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const { fetchProgress, progress, sessions, fetchUserSessions } =
    useTopikStore();
  const { language } = useLanguageStore();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Load progress and recent sessions
    fetchProgress();
    fetchUserSessions();
  }, [isAuthenticated, navigate, fetchProgress, fetchUserSessions]);

  const handleLevelSelect = (level: 1 | 2 | 3 | 4 | 5 | 6) => {
    navigate("/topik/levels", { state: { selectedLevel: level } });
  };

  const handleStartTest = (
    section: "listening" | "reading" | "writing"
  ) => {
    navigate("/topik/test", { state: { testSection: section } });
  };

  const completedSessions = sessions.filter((s) => s.status === "completed");
  const recentSessions = completedSessions.slice(0, 3);

  return (
    <div className="topik-home-container">
      <Header />
      <MainNav />

      <div className="topik-home-content">
        {/* Hero Section */}
        <div className="topik-hero">
          <h1 className="topik-hero-title">
            {language === "ko"
              ? "TOPIK 한국어능력시험"
              : "TOPIK Солонгос хэлний чадварын шалгалт"}
          </h1>
          <p className="topik-hero-subtitle">
            {language === "ko"
              ? "체계적인 학습으로 TOPIK 시험에 완벽하게 대비하세요"
              : "Системтэй сургалтаар TOPIK шалгалтанд төгс бэлдээрэй"}
          </p>
          {user && user.level.topik && (
            <div className="topik-current-level">
              <span className="topik-level-badge">
                {language === "ko" ? "현재 레벨" : "Одоогийн түвшин"}:{" "}
                TOPIK {user.level.topik}급
              </span>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="topik-quick-actions">
          <h2 className="topik-section-title">
            {language === "ko" ? "빠른 시작" : "Хурдан эхлэл"}
          </h2>
          <div className="topik-action-grid">
            <div
              className="topik-action-card listening"
              onClick={() => handleStartTest("listening")}
            >
              <div className="topik-action-icon">🎧</div>
              <div className="topik-action-title">
                {language === "ko" ? "듣기" : "Сонсох"}
              </div>
              <div className="topik-action-desc">
                {language === "ko"
                  ? "듣기 영역 연습하기"
                  : "Сонсох чадвар дасгал"}
              </div>
            </div>

            <div
              className="topik-action-card reading"
              onClick={() => handleStartTest("reading")}
            >
              <div className="topik-action-icon">📖</div>
              <div className="topik-action-title">
                {language === "ko" ? "읽기" : "Унших"}
              </div>
              <div className="topik-action-desc">
                {language === "ko"
                  ? "읽기 영역 연습하기"
                  : "Унших чадвар дасгал"}
              </div>
            </div>

            <div
              className="topik-action-card writing"
              onClick={() => handleStartTest("writing")}
            >
              <div className="topik-action-icon">✍️</div>
              <div className="topik-action-title">
                {language === "ko" ? "쓰기" : "Бичих"}
              </div>
              <div className="topik-action-desc">
                {language === "ko"
                  ? "쓰기 영역 연습하기"
                  : "Бичих чадвар дасгал"}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        {progress && (
          <div className="topik-progress-section">
            <h2 className="topik-section-title">
              {language === "ko" ? "학습 진도" : "Судалгааны явц"}
            </h2>
            <div className="topik-progress-grid">
              <div className="topik-progress-card">
                <div className="topik-progress-label">
                  {language === "ko" ? "듣기 평균" : "Сонсох дундаж"}
                </div>
                <div className="topik-progress-value">
                  {progress.listeningScore.toFixed(1)}%
                </div>
              </div>
              <div className="topik-progress-card">
                <div className="topik-progress-label">
                  {language === "ko" ? "읽기 평균" : "Унших дундаж"}
                </div>
                <div className="topik-progress-value">
                  {progress.readingScore.toFixed(1)}%
                </div>
              </div>
              <div className="topik-progress-card">
                <div className="topik-progress-label">
                  {language === "ko" ? "쓰기 평균" : "Бичих дундаж"}
                </div>
                <div className="topik-progress-value">
                  {progress.writingScore.toFixed(1)}%
                </div>
              </div>
              <div className="topik-progress-card">
                <div className="topik-progress-label">
                  {language === "ko" ? "완료한 테스트" : "Дууссан шалгалт"}
                </div>
                <div className="topik-progress-value">
                  {progress.completedTests} / {progress.totalTests}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Level Selection */}
        <div className="topik-levels-section">
          <h2 className="topik-section-title">
            {language === "ko" ? "레벨별 학습" : "Түвшингээр суралцах"}
          </h2>
          <div className="topik-levels-grid">
            {[1, 2, 3, 4, 5, 6].map((level) => (
              <div
                key={level}
                className="topik-level-card"
                onClick={() =>
                  handleLevelSelect(level as 1 | 2 | 3 | 4 | 5 | 6)
                }
              >
                <div className="topik-level-number">TOPIK {level}</div>
                <div className="topik-level-label">
                  {level <= 2
                    ? language === "ko"
                      ? "초급"
                      : "Анхан шат"
                    : level <= 4
                    ? language === "ko"
                      ? "중급"
                      : "Дунд шат"
                    : language === "ko"
                    ? "고급"
                    : "Ахисан шат"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Tests */}
        {recentSessions.length > 0 && (
          <div className="topik-recent-section">
            <h2 className="topik-section-title">
              {language === "ko" ? "최근 테스트" : "Сүүлийн шалгалт"}
            </h2>
            <div className="topik-recent-list">
              {recentSessions.map((session) => (
                <div key={session._id} className="topik-recent-card">
                  <div className="topik-recent-header">
                    <div className="topik-recent-section-badge">
                      {session.testSection === "listening"
                        ? "🎧 듣기"
                        : session.testSection === "reading"
                        ? "📖 읽기"
                        : "✍️ 쓰기"}
                    </div>
                    <div className="topik-recent-level">
                      TOPIK {session.topikLevel}
                    </div>
                  </div>
                  <div className="topik-recent-score">
                    {session.totalScore} / {session.maxScore} (
                    {((session.totalScore / session.maxScore) * 100).toFixed(
                      1
                    )}
                    %)
                  </div>
                  <div className="topik-recent-date">
                    {session.completedAt
                      ? new Date(session.completedAt).toLocaleDateString(
                          language === "ko" ? "ko-KR" : "mn-MN"
                        )
                      : ""}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* About TOPIK */}
        <div className="topik-info-section">
          <h2 className="topik-section-title">
            {language === "ko"
              ? "TOPIK 시험이란?"
              : "TOPIK шалгалт гэж юу вэ?"}
          </h2>
          <div className="topik-info-card">
            <p className="topik-info-paragraph">
              {language === "ko" ? (
                <>
                  <strong>TOPIK (Test of Proficiency in Korean)</strong>은
                  한국어를 모국어로 하지 않는 사람들을 대상으로 한국어 사용
                  능력을 측정하고 평가하는 시험입니다.
                </>
              ) : (
                <>
                  <strong>TOPIK (Солонгос хэлний ур чадварын шалгалт)</strong>{" "}
                  нь Солонгос хэлийг эх хэл болгон ашигладаггүй хүмүүст зориулсан
                  хэлний чадварыг хэмжих шалгалт юм.
                </>
              )}
            </p>

            <h3 className="topik-info-subtitle">
              {language === "ko" ? "시험 구성" : "Шалгалтын бүтэц"}
            </h3>
            <div className="topik-composition-grid">
              <div className="topik-composition-card">
                <div className="topik-composition-title">
                  {language === "ko" ? "TOPIK I" : "TOPIK I"}
                </div>
                <div className="topik-composition-desc">
                  {language === "ko"
                    ? "1-2급 (초급) - 듣기, 읽기"
                    : "1-2 шат (анхан) - Сонсох, Унших"}
                </div>
              </div>
              <div className="topik-composition-card">
                <div className="topik-composition-title">
                  {language === "ko" ? "TOPIK II" : "TOPIK II"}
                </div>
                <div className="topik-composition-desc">
                  {language === "ko"
                    ? "3-6급 (중·고급) - 듣기, 읽기, 쓰기"
                    : "3-6 шат (дунд, ахисан) - Сонсох, Унших, Бичих"}
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate("/topik/progress")}
              className="topik-view-progress-button"
            >
              {language === "ko"
                ? "상세 진도 보기 →"
                : "Нарийвчилсан явц харах →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TOPIKHome;
