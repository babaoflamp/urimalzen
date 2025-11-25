import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTopikStore } from "../store/useTopikStore";
import { useLanguageStore } from "../store/useLanguageStore";
import Header from "../components/Header";
import MainNav from "../components/MainNav";
import "./TOPIKTest.css";

const TOPIKTest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    currentSession,
    currentQuestion,
    currentQuestionIndex,
    questions,
    startSession,
    submitAnswer,
    completeSession,
    nextQuestion,
    previousQuestion,
    isLoading,
  } = useTopikStore();
  const { language } = useLanguageStore();

  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());

  const locationState = location.state as {
    topikLevel?: 1 | 2 | 3 | 4 | 5 | 6;
    testSection?: "listening" | "reading" | "writing";
  } | null;

  useEffect(() => {
    if (locationState?.topikLevel && locationState?.testSection && !currentSession) {
      startSession(locationState.testSection, locationState.topikLevel);
      setStartTime(Date.now());
    }
  }, [locationState, currentSession, startSession]);

  const handleAnswerSelect = (answer: string | number) => {
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = async () => {
    if (!currentQuestion || selectedAnswer === null) {
      alert(language === "ko" ? "답을 선택해주세요" : "Хариултаа сонгоно уу");
      return;
    }

    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    await submitAnswer(currentQuestion._id, selectedAnswer, timeSpent);
    setSelectedAnswer(null);
    setStartTime(Date.now());

    if (currentQuestionIndex < questions.length - 1) {
      nextQuestion();
    }
  };

  const handleCompleteTest = async () => {
    if (!confirm(language === "ko" ? "테스트를 완료하시겠습니까?" : "Шалгалтаа дуусгах уу?")) {
      return;
    }

    await completeSession();
    navigate("/topik/progress");
  };

  if (isLoading) {
    return (
      <div className="topik-test-container">
        <Header />
        <MainNav />
        <div className="topik-test-loading">
          {language === "ko" ? "로딩 중..." : "Уншиж байна..."}
        </div>
      </div>
    );
  }

  if (!currentSession || !currentQuestion) {
    return (
      <div className="topik-test-container">
        <Header />
        <MainNav />
        <div className="topik-test-empty">
          <h2>{language === "ko" ? "테스트를 시작해주세요" : "Шалгалт эхлүүлнэ үү"}</h2>
          <button onClick={() => navigate("/topik/levels")} className="topik-test-start-button">
            {language === "ko" ? "레벨 선택으로 이동" : "Түвшин сонгох руу очих"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="topik-test-container">
      <Header />
      <MainNav />

      <div className="topik-test-content">
        {/* Progress Bar */}
        <div className="topik-test-progress-bar">
          <div
            className="topik-test-progress-fill"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>

        {/* Question Header */}
        <div className="topik-test-header">
          <div className="topik-test-info">
            <span className="topik-test-level">TOPIK {currentSession.topikLevel}</span>
            <span className="topik-test-section">
              {currentSession.testSection === "listening"
                ? "🎧 듣기"
                : currentSession.testSection === "reading"
                ? "📖 읽기"
                : "✍️ 쓰기"}
            </span>
          </div>
          <div className="topik-test-question-number">
            {language === "ko" ? "문제" : "Асуулт"} {currentQuestionIndex + 1} / {questions.length}
          </div>
        </div>

        {/* Question Card */}
        <div className="topik-test-question-card">
          <div className="topik-test-question-text">
            {language === "ko" ? currentQuestion.questionText : currentQuestion.questionTextMn}
          </div>

          {currentQuestion.imageUrl && (
            <img src={currentQuestion.imageUrl} alt="Question" className="topik-test-image" />
          )}

          {currentQuestion.audioUrl && (
            <audio controls src={currentQuestion.audioUrl} className="topik-test-audio">
              {language === "ko" ? "오디오를 지원하지 않는 브라우저입니다" : "Аудио дэмжихгүй"}
            </audio>
          )}

          {/* Options */}
          {currentQuestion.questionType === "multiple-choice" && (
            <div className="topik-test-options">
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  className={`topik-test-option ${selectedAnswer === index ? "selected" : ""}`}
                  onClick={() => handleAnswerSelect(index)}
                >
                  <div className="topik-test-option-number">{index + 1}</div>
                  <div className="topik-test-option-text">
                    {language === "ko" ? option.text : option.textMn}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Text Input for fill-in-blank, short-answer */}
          {(currentQuestion.questionType === "fill-in-blank" ||
            currentQuestion.questionType === "short-answer") && (
            <input
              type="text"
              className="topik-test-input"
              placeholder={language === "ko" ? "답을 입력하세요" : "Хариултаа бичнэ үү"}
              value={selectedAnswer || ""}
              onChange={(e) => setSelectedAnswer(e.target.value)}
            />
          )}

          {/* Textarea for essay */}
          {currentQuestion.questionType === "essay" && (
            <textarea
              className="topik-test-textarea"
              placeholder={language === "ko" ? "답을 작성하세요" : "Хариултаа бичнэ үү"}
              value={selectedAnswer || ""}
              onChange={(e) => setSelectedAnswer(e.target.value)}
              rows={10}
            />
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="topik-test-actions">
          <button
            onClick={previousQuestion}
            disabled={currentQuestionIndex === 0}
            className="topik-test-button secondary"
          >
            {language === "ko" ? "← 이전" : "← Өмнөх"}
          </button>

          {currentQuestionIndex < questions.length - 1 ? (
            <button onClick={handleSubmitAnswer} className="topik-test-button primary">
              {language === "ko" ? "다음 →" : "Дараах →"}
            </button>
          ) : (
            <button onClick={handleCompleteTest} className="topik-test-button complete">
              {language === "ko" ? "완료" : "Дуусгах"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TOPIKTest;
