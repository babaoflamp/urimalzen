import { useEffect, useState } from "react";
import Header from "../components/Header";
import MainNav from "../components/MainNav";
import { useLanguageStore } from "../store/useLanguageStore";
import { useAuthStore } from "../store/useAuthStore";
import { pronunciationTestAPI } from "../services/api";
import "./PronunciationTest.css";

interface TestSentence {
  _id: string;
  sentence: string;          // Korean sentence
  sentenceMn?: string;       // Mongolian translation
  sentenceCn?: string;       // Chinese translation
  order: number;
  level?: {
    kiip?: 0 | 1 | 2 | 3 | 4 | 5;
    cefr?: string;
  };
  speechPro?: {
    syllLtrs: string;
    syllPhns: string;
    fst: string;
  };
  difficultyScore?: number;
  category?: string;
  tags?: string[];
  isActive?: boolean;
}

interface TestSession {
  _id: string;
  userName: string;
  selectedSentenceIds: string[];
  totalSentences: number;
  completedSentences: number;
  averageScore: number;
  status: string;
}

interface Answer {
  sentenceNumber: number;
  koreanText: string;
  mongolianText: string;
  evaluationResult: {
    sentenceScore: number;
    wordScores: Array<{
      word: string;
      score: number;
    }>;
  };
  timeSpent: number;
}

const PronunciationTest = () => {
  const { language } = useLanguageStore();
  const { user } = useAuthStore();

  const [sentences, setSentences] = useState<TestSentence[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<number | undefined>(
    undefined
  );
  const [session, setSession] = useState<TestSession | null>(null);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [evaluating, setEvaluating] = useState(false);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingTimer, setRecordingTimer] = useState<number | null>(
    null
  );

  // Modal state removed

  // Fetch sentences
  useEffect(() => {
    fetchSentences();
  }, [selectedLevel]);

  const fetchSentences = async () => {
    try {
      setLoading(true);
      const response = await pronunciationTestAPI.getAllSentences(
        selectedLevel
      );
      setSentences(response.data);
    } catch (error) {
      console.error("Failed to fetch sentences:", error);
    } finally {
      setLoading(false);
    }
  };

  // Start test session
  const startTest = async (startIndex: number = 0) => {
    try {
      const userName = user?.username || user?.email || "Anonymous";
      const response = await pronunciationTestAPI.startSession({
        userName,
        sentenceIds: sentences.map((s) => s._id),
      });
      setSession(response.data);
      setCurrentSentenceIndex(startIndex);
      setAnswers([]);
      setShowResults(false);
    } catch (error) {
      console.error("Failed to start test session:", error);
      alert("테스트 세션을 시작할 수 없습니다.");
    }
  };

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        setAudioBlob(blob);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      const timer = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
      setRecordingTimer(timer);
    } catch (error) {
      console.error("Failed to start recording:", error);
      alert("마이크 접근 권한이 필요합니다.");
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      if (recordingTimer) {
        clearInterval(recordingTimer);
        setRecordingTimer(null);
      }
    }
  };

  // Submit audio for evaluation
  const submitEvaluation = async () => {
    if (!audioBlob || !session) return;

    try {
      setEvaluating(true);
      const currentSentence = sentences[currentSentenceIndex];
      const formData = new FormData();
      formData.append("audio", audioBlob, `recording-${Date.now()}.webm`);
      formData.append("sessionId", session._id);
      formData.append("sentenceId", currentSentence._id);
      formData.append("timeSpent", recordingTime.toString());

      await pronunciationTestAPI.evaluatePronunciation(formData);

      // Move to next sentence or show results
      if (currentSentenceIndex < sentences.length - 1) {
        setCurrentSentenceIndex(currentSentenceIndex + 1);
        setAudioBlob(null);
        setRecordingTime(0);
      } else {
        // Test completed, fetch results
        await fetchResults();
      }
    } catch (error) {
      console.error("Failed to evaluate pronunciation:", error);
      alert("발음 평가에 실패했습니다.");
    } finally {
      setEvaluating(false);
    }
  };

  // Fetch test results
  const fetchResults = async () => {
    if (!session) return;

    try {
      const response = await pronunciationTestAPI.getSessionAnswers(
        session._id
      );
      setAnswers(response.data);
      setShowResults(true);
    } catch (error) {
      console.error("Failed to fetch results:", error);
    }
  };

  // Export to Excel
  const exportToExcel = async () => {
    if (!session) return;

    try {
      const response = await pronunciationTestAPI.exportToExcel(session._id);
      const blob = new Blob([response], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `pronunciation-test-${session._id}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export to Excel:", error);
      alert("Excel 파일 다운로드에 실패했습니다.");
    }
  };

  const currentSentence = session ? sentences[currentSentenceIndex] : null;

  return (
    <div className="pronunciation-test-container">
      <Header />
      <MainNav />

      <div className="pronunciation-test-content">
        {/* Hero Section */}
        <div className="pronunciation-test-hero">
          <h1 className="pronunciation-test-hero-title">발음 평가 테스트</h1>
          <p className="pronunciation-test-hero-subtitle">
            20개의 한국어 문장으로 발음을 평가받아보세요
          </p>
        </div>

        {/* Level Filter */}
        {!session && (
          <div className="pronunciation-test-level-filter">
            <h2 className="pronunciation-test-section-title">난이도 선택</h2>
            <div className="pronunciation-test-level-buttons">
              <button
                className={`pronunciation-test-level-btn ${
                  selectedLevel === undefined ? "active" : ""
                }`}
                onClick={() => setSelectedLevel(undefined)}
              >
                전체 (All)
              </button>
              {[0, 1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  className={`pronunciation-test-level-btn ${
                    selectedLevel === level ? "active" : ""
                  }`}
                  onClick={() => setSelectedLevel(level)}
                >
                  Level {level}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sentence List (Before Test) */}
        {!session && !showResults && (
          <div className="pronunciation-test-sentence-list-section">
            <h2 className="pronunciation-test-section-title">
              테스트 문장 ({sentences.length}개)
            </h2>
            {loading ? (
              <div className="pronunciation-test-loading">로딩 중...</div>
            ) : (
              <>
                <div className="pronunciation-test-sentence-grid">
                  {sentences.map((sentence) => (
                    <div
                      key={sentence._id}
                      className="pronunciation-test-sentence-card"
                      onClick={() =>
                        startTest(
                          sentences.findIndex((s) => s._id === sentence._id)
                        )
                      }
                    >
                      <div className="pronunciation-test-sentence-number">
                        #{sentence.order}
                      </div>
                      <div className="pronunciation-test-sentence-korean">
                        {sentence.sentence}
                      </div>
                      <div className="pronunciation-test-sentence-translation">
                        {language === "mn"
                          ? sentence.sentenceMn
                          : sentence.sentenceCn || sentence.sentenceMn}
                      </div>
                      <div className="pronunciation-test-sentence-meta">
                        <span className="pronunciation-test-badge">
                          KIIP {sentence.level?.kiip ?? 0}
                        </span>
                        <span className="pronunciation-test-badge">
                          난이도 {sentence.difficultyScore ?? 50}
                        </span>
                        {sentence.category && (
                          <span className="pronunciation-test-badge">
                            {sentence.category}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {/* Modal removed: clicking a card now starts the test directly */}
                {/* 테스트 시작하기 버튼 완전 삭제됨 */}
              </>
            )}
          </div>
        )}

        {/* Test In Progress */}
        {session && !showResults && currentSentence && (
          <div className="pronunciation-test-recording-section">
            <div className="pronunciation-test-progress">
              <div className="pronunciation-test-progress-text">
                문장 {currentSentenceIndex + 1} / {sentences.length}
              </div>
              <div className="pronunciation-test-progress-bar">
                <div
                  className="pronunciation-test-progress-fill"
                  style={{
                    width: `${
                      ((currentSentenceIndex + 1) / sentences.length) * 100
                    }%`,
                  }}
                />
              </div>
            </div>

            <div className="pronunciation-test-current-sentence">
              <div className="pronunciation-test-sentence-number-large">
                #{currentSentence.order}
              </div>
              <h2 className="pronunciation-test-sentence-korean-large">
                {currentSentence.sentence}
              </h2>
              <p className="pronunciation-test-sentence-translation-large">
                {language === "mn"
                  ? currentSentence.sentenceMn
                  : currentSentence.sentenceCn ||
                    currentSentence.sentenceMn}
              </p>
              <div className="pronunciation-test-sentence-meta">
                {currentSentence.tags?.map((tag, idx) => (
                  <span key={idx} className="pronunciation-test-badge">
                    {tag}
                  </span>
                ))}
              </div>
              {/* Previous/Next + Record button group */}
              <div className="pronunciation-test-nav-btn-group">
                <button
                  className="pronunciation-test-prev-btn"
                  onClick={() =>
                    setCurrentSentenceIndex((idx) => Math.max(0, idx - 1))
                  }
                  disabled={currentSentenceIndex === 0}
                >
                  이전 문장
                </button>
                {!audioBlob && !isRecording && (
                  <button
                    className="pronunciation-test-record-btn"
                    onClick={startRecording}
                  >
                    🎤 녹음 시작
                  </button>
                )}
                <button
                  className="pronunciation-test-next-btn"
                  onClick={() =>
                    setCurrentSentenceIndex((idx) =>
                      Math.min(sentences.length - 1, idx + 1)
                    )
                  }
                  disabled={currentSentenceIndex === sentences.length - 1}
                >
                  다음 문장
                </button>
              </div>
            </div>

            <div className="pronunciation-test-recording-controls">
              {isRecording && (
                <div className="pronunciation-test-recording-time">
                  녹음 중... {recordingTime}초
                </div>
              )}

              <div className="pronunciation-test-button-group">
                {isRecording && (
                  <button
                    className="pronunciation-test-stop-btn"
                    onClick={stopRecording}
                  >
                    ⏹ 녹음 중지
                  </button>
                )}
                {audioBlob && !evaluating && (
                  <button
                    className="pronunciation-test-submit-btn"
                    onClick={submitEvaluation}
                  >
                    ✅ 평가 받기
                  </button>
                )}
                {evaluating && (
                  <div className="pronunciation-test-evaluating">
                    평가 중...
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {showResults && (
          <div className="pronunciation-test-results-section">
            <h2 className="pronunciation-test-section-title">테스트 결과</h2>
            <div className="pronunciation-test-results-summary">
              <div className="pronunciation-test-summary-card">
                <div className="pronunciation-test-summary-label">
                  평균 점수
                </div>
                <div className="pronunciation-test-summary-value">
                  {session ? session.averageScore.toFixed(1) : 0}
                  <span className="pronunciation-test-summary-unit">점</span>
                </div>
              </div>
              <div className="pronunciation-test-summary-card">
                <div className="pronunciation-test-summary-label">
                  완료한 문장
                </div>
                <div className="pronunciation-test-summary-value">
                  {answers.length}
                  <span className="pronunciation-test-summary-unit">개</span>
                </div>
              </div>
            </div>

            <div className="pronunciation-test-results-list">
              {answers.map((answer, idx) => (
                <div key={idx} className="pronunciation-test-result-card">
                  <div className="pronunciation-test-result-header">
                    <span className="pronunciation-test-result-number">
                      #{answer.sentenceNumber}
                    </span>
                    <span
                      className={`pronunciation-test-result-score ${
                        answer.evaluationResult.sentenceScore >= 80
                          ? "excellent"
                          : answer.evaluationResult.sentenceScore >= 60
                          ? "good"
                          : "needs-improvement"
                      }`}
                    >
                      {answer.evaluationResult.sentenceScore.toFixed(1)}점
                    </span>
                  </div>
                  <div className="pronunciation-test-result-korean">
                    {answer.koreanText}
                  </div>
                  <div className="pronunciation-test-result-translation">
                    {answer.mongolianText}
                  </div>
                  <div className="pronunciation-test-result-words">
                    {answer.evaluationResult.wordScores.map((word, wIdx) => (
                      <span
                        key={wIdx}
                        className={`pronunciation-test-word-score ${
                          word.score >= 80
                            ? "pronunciation-test-word-score-high"
                            : word.score >= 60
                            ? "pronunciation-test-word-score-mid"
                            : "pronunciation-test-word-score-low"
                        }`}
                      >
                        {word.word} ({word.score.toFixed(0)})
                      </span>
                    ))}
                  </div>
                  <div className="pronunciation-test-result-time">
                    소요 시간: {answer.timeSpent}초
                  </div>
                </div>
              ))}
            </div>

            <div className="pronunciation-test-action-buttons">
              <button
                className="pronunciation-test-excel-btn"
                onClick={exportToExcel}
              >
                📊 Excel 다운로드
              </button>
              <button
                className="pronunciation-test-retry-btn"
                onClick={() => {
                  setSession(null);
                  setShowResults(false);
                  setAnswers([]);
                  setCurrentSentenceIndex(0);
                }}
              >
                🔄 다시 테스트하기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PronunciationTest;
