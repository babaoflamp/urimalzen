import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useTopikStore } from "../store/useTopikStore";
import { useLanguageStore } from "../store/useLanguageStore";
import Header from "../components/Header";
import MainNav from "../components/MainNav";
import "./TOPIKProgress.css";

const TOPIKProgress = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { progress, sessions, fetchProgress, fetchUserSessions, isLoading } = useTopikStore();
  const { language } = useLanguageStore();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    fetchProgress();
    fetchUserSessions("completed");
  }, [isAuthenticated, navigate, fetchProgress, fetchUserSessions]);

  if (isLoading) {
    return (
      <div className="topik-progress-container">
        <Header />
        <MainNav />
        <div className="topik-progress-loading">
          {language === "ko" ? "로딩 중..." : "Уншиж байна..."}
        </div>
      </div>
    );
  }

  return (
    <div className="topik-progress-container">
      <Header />
      <MainNav />

      <div className="topik-progress-content">
        <div className="topik-progress-hero">
          <h1 className="topik-progress-hero-title">
            {language === "ko" ? "학습 진도" : "Судалгааны явц"}
          </h1>
          <p className="topik-progress-hero-subtitle">
            {language === "ko"
              ? "나의 TOPIK 학습 기록을 확인하세요"
              : "TOPIK сургалтын явцыг харах"}
          </p>
        </div>

        {/* Overall Progress */}
        {progress && (
          <div className="topik-progress-overview">
            <h2 className="topik-progress-section-title">
              {language === "ko" ? "전체 진도" : "Нийт явц"}
            </h2>
            <div className="topik-progress-stats-grid">
              <div className="topik-progress-stat-card">
                <div className="topik-progress-stat-icon">📊</div>
                <div className="topik-progress-stat-label">
                  {language === "ko" ? "전체 평균" : "Нийт дундаж"}
                </div>
                <div className="topik-progress-stat-value">
                  {progress.averageScore.toFixed(1)}%
                </div>
              </div>

              <div className="topik-progress-stat-card">
                <div className="topik-progress-stat-icon">🎧</div>
                <div className="topik-progress-stat-label">
                  {language === "ko" ? "듣기 평균" : "Сонсох дундаж"}
                </div>
                <div className="topik-progress-stat-value">
                  {progress.listeningScore.toFixed(1)}%
                </div>
              </div>

              <div className="topik-progress-stat-card">
                <div className="topik-progress-stat-icon">📖</div>
                <div className="topik-progress-stat-label">
                  {language === "ko" ? "읽기 평균" : "Унших дундаж"}
                </div>
                <div className="topik-progress-stat-value">
                  {progress.readingScore.toFixed(1)}%
                </div>
              </div>

              <div className="topik-progress-stat-card">
                <div className="topik-progress-stat-icon">✍️</div>
                <div className="topik-progress-stat-label">
                  {language === "ko" ? "쓰기 평균" : "Бичих дундаж"}
                </div>
                <div className="topik-progress-stat-value">
                  {progress.writingScore.toFixed(1)}%
                </div>
              </div>

              <div className="topik-progress-stat-card">
                <div className="topik-progress-stat-icon">📝</div>
                <div className="topik-progress-stat-label">
                  {language === "ko" ? "완료한 테스트" : "Дууссан шалгалт"}
                </div>
                <div className="topik-progress-stat-value">
                  {progress.completedTests}
                </div>
              </div>

              <div className="topik-progress-stat-card">
                <div className="topik-progress-stat-icon">🎯</div>
                <div className="topik-progress-stat-label">
                  {language === "ko" ? "현재 레벨" : "Одоогийн түвшин"}
                </div>
                <div className="topik-progress-stat-value">
                  TOPIK {progress.topikLevel}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Test History */}
        <div className="topik-progress-history">
          <h2 className="topik-progress-section-title">
            {language === "ko" ? "테스트 기록" : "Шалгалтын түүх"}
          </h2>

          {sessions.length === 0 ? (
            <div className="topik-progress-empty">
              <p>
                {language === "ko"
                  ? "아직 완료한 테스트가 없습니다"
                  : "Дууссан шалгалт байхгүй"}
              </p>
              <button
                onClick={() => navigate("/topik/levels")}
                className="topik-progress-start-button"
              >
                {language === "ko" ? "테스트 시작하기" : "Шалгалт эхлүүлэх"}
              </button>
            </div>
          ) : (
            <div className="topik-progress-history-list">
              {sessions.map((session, index) => (
                <div key={session._id} className="topik-progress-history-card">
                  <div className="topik-progress-history-header">
                    <div className="topik-progress-history-number">#{index + 1}</div>
                    <div className="topik-progress-history-section">
                      {session.testSection === "listening"
                        ? "🎧 듣기"
                        : session.testSection === "reading"
                        ? "📖 읽기"
                        : "✍️ 쓰기"}
                    </div>
                    <div className="topik-progress-history-level">
                      TOPIK {session.topikLevel}
                    </div>
                  </div>

                  <div className="topik-progress-history-score">
                    <div className="topik-progress-history-score-label">
                      {language === "ko" ? "점수" : "Оноо"}
                    </div>
                    <div className="topik-progress-history-score-value">
                      {session.totalScore} / {session.maxScore}
                    </div>
                    <div className="topik-progress-history-percentage">
                      ({((session.totalScore / session.maxScore) * 100).toFixed(1)}%)
                    </div>
                  </div>

                  <div className="topik-progress-history-date">
                    {session.completedAt
                      ? new Date(session.completedAt).toLocaleString(
                          language === "ko" ? "ko-KR" : "mn-MN"
                        )
                      : ""}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="topik-progress-actions">
          <button
            onClick={() => navigate("/topik/home")}
            className="topik-progress-action-button secondary"
          >
            {language === "ko" ? "← TOPIK 홈으로" : "← TOPIK нүүр руу"}
          </button>
          <button
            onClick={() => navigate("/topik/levels")}
            className="topik-progress-action-button primary"
          >
            {language === "ko" ? "새 테스트 시작 →" : "Шинэ шалгалт эхлүүлэх →"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TOPIKProgress;
