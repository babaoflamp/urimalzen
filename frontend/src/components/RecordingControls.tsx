import { useState, useRef } from "react";
import { useLearningStore } from "../store/useLearningStore";
import { recordingAPI, progressAPI } from "../services/api";

const RecordingControls = () => {
  const { currentWord, isRecording, setIsRecording, setUserProgress } =
    useLearningStore();
  const [recordingTime, setRecordingTime] = useState(0);

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

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");
      formData.append("wordId", currentWord._id);
      formData.append("duration", recordingTime.toString());

      await recordingAPI.uploadRecording(formData);

      // Update progress
      await progressAPI.updateProgress({
        wordId: currentWord._id,
        completed: false,
        score: 0,
      });

      // Reload progress
      const progressResponse = await progressAPI.getUserProgress();
      setUserProgress(progressResponse.data);

      alert("녹음이 저장되었습니다!");
    } catch (error) {
      console.error("Failed to upload recording:", error);
      alert("녹음 저장에 실패했습니다");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div style={styles.container}>
      {isRecording && (
        <div style={styles.recordingIndicator}>
          녹음 중... {formatTime(recordingTime)}
        </div>
      )}

      <div style={styles.buttonGroup}>
        <button
          onClick={startRecording}
          disabled={isRecording}
          style={{
            ...styles.button,
            ...(isRecording ? styles.buttonDisabled : {}),
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
