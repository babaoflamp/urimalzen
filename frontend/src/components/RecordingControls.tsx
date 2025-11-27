import { useState, useRef } from "react";
import { useLearningStore } from "../store/useLearningStore";
import { useLanguageStore } from "../store/useLanguageStore";
import { sttAPI, progressAPI } from "../services/api";
import "./RecordingControls.css";

const RecordingControls = () => {
  const { currentWord, isRecording, setIsRecording, setUserProgress } =
    useLearningStore();
  const { language } = useLanguageStore();

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
    if (score >= 80) return "score-excellent";
    if (score >= 60) return "score-good";
    return "score-poor";
  };

  return (
    <div className="recording-controls-container">
      {isRecording && (
        <div className="recording-indicator">
          녹음 중... {formatTime(recordingTime)}
        </div>
      )}

      {isEvaluating && (
        <div className="evaluating-indicator">발음 평가 중...</div>
      )}

      {evaluationResult && (
        <div className="evaluation-result">
          <div className="evaluation-header">발음 평가 결과</div>

          <div className="score-grid">
            <div
              className={`score-card ${getScoreColor(
                Math.round(
                  (evaluationResult.pronunciationScore +
                    evaluationResult.fluencyScore +
                    evaluationResult.completenessScore) /
                    3
                )
              )}`}
            >
              <div className="score-label">종합 점수</div>
              <div className="score-value">
                {Math.round(
                  (evaluationResult.pronunciationScore +
                    evaluationResult.fluencyScore +
                    evaluationResult.completenessScore) /
                    3
                )}
              </div>
            </div>

            <div
              className={`score-card ${getScoreColor(
                evaluationResult.pronunciationScore
              )}`}
            >
              <div className="score-label">발음</div>
              <div className="score-value">
                {evaluationResult.pronunciationScore}
              </div>
            </div>

            <div
              className={`score-card ${getScoreColor(
                evaluationResult.fluencyScore
              )}`}
            >
              <div className="score-label">유창성</div>
              <div className="score-value">{evaluationResult.fluencyScore}</div>
            </div>

            <div
              className={`score-card ${getScoreColor(
                evaluationResult.completenessScore
              )}`}
            >
              <div className="score-label">완성도</div>
              <div className="score-value">
                {evaluationResult.completenessScore}
              </div>
            </div>
          </div>

          {evaluationResult.transcribedText && (
            <div className="transcription">
              <div className="transcription-label">인식된 텍스트:</div>
              <div className="transcription-text">
                {evaluationResult.transcribedText}
              </div>
            </div>
          )}

          {evaluationResult.feedback && (
            <div className="feedback">
              <div className="feedback-label">피드백:</div>
              <div className="feedback-text">
                {language === "ko"
                  ? evaluationResult.feedback.ko
                  : evaluationResult.feedback.mn}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="button-group">
        <button
          onClick={startRecording}
          disabled={isRecording || isEvaluating}
          className="recording-button"
        >
          {language === "zh"
            ? "开始录音"
            : language === "mn"
            ? "Бичлэг эхлүүлэх"
            : "녹음 시작"}
        </button>

        <button
          onClick={stopRecording}
          disabled={!isRecording}
          className="recording-button"
        >
          {language === "zh"
            ? "停止录音"
            : language === "mn"
            ? "Бичлэг дуусгах"
            : "녹음 종료"}
        </button>
      </div>
    </div>
  );
};

export default RecordingControls;
