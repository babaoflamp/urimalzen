import { useState, useRef } from "react";
import { useLearningStore } from "../store/useLearningStore";
import { useLanguageStore } from "../store/useLanguageStore";
import { translations } from "../utils/translations";
import { sttAPI, progressAPI } from "../services/api";

const RecordingControls = () => {
  const { currentWord, isRecording, setIsRecording, setUserProgress } =
    useLearningStore();
  const { language } = useLanguageStore();
  const t = translations[language];

  const [recordingTime, setRecordingTime] = useState(0);
  const [evaluationResult, setEvaluationResult] = useState<any>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        await uploadRecording(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Failed to start recording:", error);
      alert("마이크 권한을 허용해주세요");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const uploadRecording = async (audioBlob: Blob) => {
    if (!currentWord) return;

    setIsEvaluating(true);
    setEvaluationResult(null);

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");
      formData.append("wordId", currentWord._id);

      // Evaluate pronunciation using STT API
      const response = await sttAPI.evaluatePronunciation(formData);

      if (response.success && response.data) {
        const evaluation = response.data;
        setEvaluationResult(evaluation);

        // Calculate overall score (average of all scores)
        const overallScore = Math.round(
          (evaluation.pronunciationScore +
            evaluation.fluencyScore +
            evaluation.completenessScore) /
            3
        );

        // Update progress with evaluation score
        await progressAPI.updateProgress({
          wordId: currentWord._id,
          completed: overallScore >= 70,
          score: overallScore,
        });

        // Reload progress
        const progressResponse = await progressAPI.getUserProgress();
        setUserProgress(progressResponse.data);
      }
    } catch (error: any) {
      console.error("Failed to evaluate pronunciation:", error);
      alert(error.response?.data?.message || "발음 평가에 실패했습니다");
    } finally {
      setIsEvaluating(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "rgba(16, 185, 129, 0.4)"; // Green
    if (score >= 60) return "rgba(251, 191, 36, 0.4)"; // Yellow
    return "rgba(239, 68, 68, 0.4)"; // Red
  };

  return (
    <div style={styles.container}>
      {isRecording && (
        <div style={styles.recordingIndicator}>
          녹음 중... {formatTime(recordingTime)}
        </div>
      )}

      {isEvaluating && (
        <div style={styles.evaluatingIndicator}>
          발음 평가 중...
        </div>
      )}

      {evaluationResult && (
        <div style={styles.evaluationResult}>
          <div style={styles.evaluationHeader}>발음 평가 결과</div>

          <div style={styles.scoreGrid}>
            <div
              style={{
                ...styles.scoreCard,
                background: getScoreColor(
                  Math.round(
                    (evaluationResult.pronunciationScore +
                      evaluationResult.fluencyScore +
                      evaluationResult.completenessScore) /
                      3
                  )
                ),
              }}
            >
              <div style={styles.scoreLabel}>종합 점수</div>
              <div style={styles.scoreValue}>
                {Math.round(
                  (evaluationResult.pronunciationScore +
                    evaluationResult.fluencyScore +
                    evaluationResult.completenessScore) /
                    3
                )}
              </div>
            </div>

            <div
              style={{
                ...styles.scoreCard,
                background: getScoreColor(evaluationResult.pronunciationScore),
              }}
            >
              <div style={styles.scoreLabel}>발음</div>
              <div style={styles.scoreValue}>
                {evaluationResult.pronunciationScore}
              </div>
            </div>

            <div
              style={{
                ...styles.scoreCard,
                background: getScoreColor(evaluationResult.fluencyScore),
              }}
            >
              <div style={styles.scoreLabel}>유창성</div>
              <div style={styles.scoreValue}>
                {evaluationResult.fluencyScore}
              </div>
            </div>

            <div
              style={{
                ...styles.scoreCard,
                background: getScoreColor(evaluationResult.completenessScore),
              }}
            >
              <div style={styles.scoreLabel}>완성도</div>
              <div style={styles.scoreValue}>
                {evaluationResult.completenessScore}
              </div>
            </div>
          </div>

          {evaluationResult.transcribedText && (
            <div style={styles.transcription}>
              <div style={styles.transcriptionLabel}>인식된 텍스트:</div>
              <div style={styles.transcriptionText}>
                {evaluationResult.transcribedText}
              </div>
            </div>
          )}

          {evaluationResult.feedback && (
            <div style={styles.feedback}>
              <div style={styles.feedbackLabel}>피드백:</div>
              <div style={styles.feedbackText}>
                {language === "ko"
                  ? evaluationResult.feedback.ko
                  : evaluationResult.feedback.mn}
              </div>
            </div>
          )}
        </div>
      )}

      <div style={styles.buttonGroup}>
        <button
          onClick={startRecording}
          disabled={isRecording || isEvaluating}
          style={{
            ...styles.button,
            ...(isRecording || isEvaluating ? styles.buttonDisabled : {}),
          }}
        >
          녹음 시작
        </button>

        <button
          onClick={stopRecording}
          disabled={!isRecording}
          style={{
            ...styles.button,
            ...(isRecording ? {} : styles.buttonDisabled),
          }}
        >
          녹음 종료
        </button>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  recordingIndicator: {
    background: "rgba(239, 68, 68, 0.4)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    color: "white",
    padding: "16px",
    borderRadius: "16px",
    textAlign: "center",
    fontSize: "18px",
    fontWeight: "bold",
    animation: "pulse 1.5s infinite",
    boxShadow: "0 4px 16px rgba(239, 68, 68, 0.3)",
  },
  evaluatingIndicator: {
    background: "rgba(59, 130, 246, 0.4)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    color: "white",
    padding: "16px",
    borderRadius: "16px",
    textAlign: "center",
    fontSize: "18px",
    fontWeight: "bold",
    boxShadow: "0 4px 16px rgba(59, 130, 246, 0.3)",
  },
  evaluationResult: {
    background: "rgba(16, 185, 129, 0.2)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
  },
  evaluationHeader: {
    color: "white",
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "16px",
    textAlign: "center",
  },
  scoreGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "12px",
    marginBottom: "16px",
  },
  scoreCard: {
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    borderRadius: "12px",
    padding: "16px",
    textAlign: "center",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },
  scoreLabel: {
    color: "white",
    fontSize: "14px",
    marginBottom: "8px",
    fontWeight: "bold",
  },
  scoreValue: {
    color: "white",
    fontSize: "28px",
    fontWeight: "bold",
  },
  transcription: {
    background: "rgba(129, 199, 132, 0.2)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "12px",
    padding: "16px",
    marginBottom: "12px",
  },
  transcriptionLabel: {
    color: "white",
    fontSize: "14px",
    fontWeight: "bold",
    marginBottom: "8px",
  },
  transcriptionText: {
    color: "white",
    fontSize: "16px",
    lineHeight: "1.5",
  },
  feedback: {
    background: "rgba(129, 199, 132, 0.2)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "12px",
    padding: "16px",
  },
  feedbackLabel: {
    color: "white",
    fontSize: "14px",
    fontWeight: "bold",
    marginBottom: "8px",
  },
  feedbackText: {
    color: "white",
    fontSize: "16px",
    lineHeight: "1.5",
  },
  buttonGroup: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },
  button: {
    background: "rgba(251, 191, 36, 0.3)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    color: "white",
    borderRadius: "16px",
    padding: "20px",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
  },
  buttonDisabled: {
    background: "rgba(156, 163, 175, 0.3)",
    cursor: "not-allowed",
    opacity: 0.5,
  },
};

export default RecordingControls;
