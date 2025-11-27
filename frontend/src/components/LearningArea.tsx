import { useState } from "react";
import { useLearningStore } from "../store/useLearningStore";
import { useLanguageStore } from "../store/useLanguageStore";
import { translations } from "../utils/translations";
import { ttsAPI } from "../services/api";
import RecordingControls from "./RecordingControls";
import stylesModule from "./LearningArea.module.css";

const LearningArea = () => {
  const { currentWord } = useLearningStore();
  const { language } = useLanguageStore();
  const t = translations[language];
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);

  const handlePlayAudio = async () => {
    if (!currentWord || isPlaying) return;

    setIsPlaying(true);
    setAudioError(null);

    try {
      // Get audio from TTS API
      const response = await ttsAPI.getWordAudio(currentWord._id);

      if (response.success && response.data.audioUrl) {
        // 오디오 URL이 절대경로인지 상대경로인지 판별
        let audioUrl = response.data.audioUrl;
        if (!/^https?:\/\//.test(audioUrl)) {
          // 상대경로면 API 서버 주소를 붙임
          audioUrl = `${import.meta.env.VITE_API_URL?.replace(
            "/api",
            ""
          )}${audioUrl}`;
        }
        const audio = new Audio(audioUrl);

        audio.onended = () => setIsPlaying(false);
        audio.onerror = () => {
          setIsPlaying(false);
          setAudioError("오디오 재생 실패");
        };

        await audio.play();
      } else {
        setAudioError("오디오를 찾을 수 없습니다");
        setIsPlaying(false);
      }
    } catch (error: any) {
      console.error("Audio playback error:", error);
      setAudioError(
        error.response?.data?.message || "오디오 재생 중 오류 발생"
      );
      setIsPlaying(false);
    }
  };

  if (!currentWord) {
    // 단어가 선택되지 않았을 때 아무것도 렌더링하지 않음 (FunStoryContent가 대신 표시됨)
    return null;
  }

  return (
    <div style={styles.container}>
      {/* 최상단 카테고리 바 */}
      {currentWord.mainCategory && (
        <div className={stylesModule["category-bar"]}>
          <span className={stylesModule["category-badge"]}>
            {currentWord.mainCategory}
          </span>
        </div>
      )}
      <div style={styles.titleBar}>
        <div style={{ ...styles.wordTitleContainer, flex: 1 }}>
          <div style={styles.wordTitle}>{currentWord.koreanWord}</div>
          {language !== "ko" && (
            <div style={styles.mongolianText}>
              [
              {language === "zh"
                ? currentWord.chineseWord || currentWord.mongolianWord
                : currentWord.mongolianWord}
              ]
            </div>
          )}
        </div>
        <button
          style={{
            ...styles.playButton,
            ...(isPlaying ? styles.playButtonActive : {}),
          }}
          onClick={handlePlayAudio}
          disabled={isPlaying}
        >
          {isPlaying ? "🔊" : "▶"}
        </button>
      </div>

      {audioError && <div style={styles.errorMessage}>{audioError}</div>}

      <div style={styles.contentArea}>
        <div style={styles.imageSection}>
          <div style={styles.imageBox}>
            {currentWord.imageUrl ? (
              <img
                src={currentWord.imageUrl}
                alt={currentWord.koreanWord}
                style={styles.flowerImage}
              />
            ) : (
              <div style={styles.imagePlaceholder}>이미지</div>
            )}
          </div>
        </div>

        <div style={styles.textSection}>
          <div style={styles.textBox}>
            <p style={styles.description}>{currentWord.description}</p>
            <p style={styles.pronunciation}>
              {t.pronunciation_label}: {currentWord.pronunciation}
            </p>
          </div>
        </div>
      </div>

      <RecordingControls />
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    background:
      "linear-gradient(135deg, rgba(38, 50, 56, 0.85) 0%, rgba(135, 206, 235, 0.15) 50%, rgba(38, 198, 218, 0.1) 100%)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(79, 195, 247, 0.3)",
    borderRadius: "24px",
    padding: "12px",
    boxShadow:
      "0 8px 32px 0 rgba(31, 38, 135, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
    position: "relative",
    zIndex: 1,
  },
  titleBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  wordTitleContainer: {
    background:
      "linear-gradient(135deg, rgba(79, 195, 247, 0.25) 0%, rgba(38, 198, 218, 0.2) 100%)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    border: "1px solid rgba(79, 195, 247, 0.4)",
    padding: "18px 40px",
    borderRadius: "20px",
    flex: 1,
    textAlign: "center",
    marginRight: "20px",
    boxShadow:
      "0 4px 16px rgba(31, 38, 135, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.7)",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  wordTitle: {
    color: "#fff",
    fontSize: "28px",
    fontWeight: "bold",
  },
  playButton: {
    background:
      "linear-gradient(135deg, rgba(79, 195, 247, 0.3) 0%, rgba(38, 198, 218, 0.25) 100%)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    border: "1px solid rgba(79, 195, 247, 0.4)",
    color: "#1a1a1a",
    borderRadius: "20px",
    fontSize: "32px",
    cursor: "pointer",
    width: "80px",
    height: "80px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transition: "all 0.3s ease",
    boxShadow:
      "0 4px 16px rgba(31, 38, 135, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.7)",
  },
  playButtonActive: {
    background:
      "linear-gradient(135deg, rgba(79, 195, 247, 0.5) 0%, rgba(38, 198, 218, 0.4) 100%)",
    transform: "scale(0.95)",
    boxShadow:
      "0 2px 8px rgba(31, 38, 135, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
  },
  errorMessage: {
    background:
      "linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.1) 100%)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    color: "#dc2626",
    padding: "12px",
    borderRadius: "12px",
    textAlign: "center",
    marginBottom: "16px",
    fontSize: "14px",
    backdropFilter: "blur(10px)",
  },
  mongolianText: {
    color: "#4a4a4a",
    fontSize: "16px",
    fontWeight: "600",
  },
  contentArea: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginBottom: "20px",
  },
  imageSection: {
    background:
      "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(135, 206, 235, 0.12) 100%)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    border: "1px solid rgba(79, 195, 247, 0.25)",
    borderRadius: "20px",
    padding: "20px",
    boxShadow:
      "0 4px 16px rgba(31, 38, 135, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.7)",
  },
  imageBox: {
    background: "rgba(135, 206, 235, 0.1)",
    borderRadius: "16px",
    minHeight: "300px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    border: "1px solid rgba(79, 195, 247, 0.2)",
  },
  flowerImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "16px",
  },
  imagePlaceholder: {
    color: "#757575",
    fontSize: "24px",
    fontWeight: "bold",
  },
  textSection: {
    background:
      "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(38, 198, 218, 0.12) 100%)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    border: "1px solid rgba(79, 195, 247, 0.25)",
    borderRadius: "20px",
    padding: "20px",
    boxShadow:
      "0 4px 16px rgba(31, 38, 135, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.7)",
  },
  textBox: {
    background: "rgba(38, 198, 218, 0.08)",
    borderRadius: "16px",
    padding: "24px",
    minHeight: "300px",
    border: "1px solid rgba(79, 195, 247, 0.2)",
  },
  sectionTitle: {
    color: "#1a1a1a",
    marginTop: 0,
    marginBottom: "15px",
    fontSize: "20px",
  },
  description: {
    color: "#1a1a1a",
    fontSize: "16px",
    lineHeight: "1.6",
    marginBottom: "15px",
  },
  pronunciation: {
    color: "#4a4a4a",
    fontSize: "14px",
    fontStyle: "italic",
  },
  emptyState: {
    color: "#757575",
    fontSize: "24px",
    textAlign: "center",
    padding: "100px 0",
  },
};

export default LearningArea;
