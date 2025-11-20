import { useState } from "react";
import { useLearningStore } from "../store/useLearningStore";
import { useLanguageStore } from "../store/useLanguageStore";
import { translations } from "../utils/translations";
import { ttsAPI } from "../services/api";
import RecordingControls from "./RecordingControls";

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
        // Create audio element and play
        const audio = new Audio(`${import.meta.env.VITE_API_URL?.replace('/api', '')}${response.data.audioUrl}`);

        audio.onended = () => setIsPlaying(false);
        audio.onerror = () => {
          setIsPlaying(false);
          setAudioError('오디오 재생 실패');
        };

        await audio.play();
      } else {
        setAudioError('오디오를 찾을 수 없습니다');
        setIsPlaying(false);
      }
    } catch (error: any) {
      console.error('Audio playback error:', error);
      setAudioError(error.response?.data?.message || '오디오 재생 중 오류 발생');
      setIsPlaying(false);
    }
  };

  if (!currentWord) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyState}>{t.selectWord}</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.titleBar}>
        <div style={styles.wordTitle}>{currentWord.koreanWord}</div>
        <button
          style={{
            ...styles.playButton,
            ...(isPlaying ? styles.playButtonActive : {}),
          }}
          onClick={handlePlayAudio}
          disabled={isPlaying}
        >
          {isPlaying ? '🔊' : '▶'}
        </button>
      </div>

      {audioError && (
        <div style={styles.errorMessage}>{audioError}</div>
      )}

      <div style={styles.mongolianText}>[{currentWord.mongolianWord}]</div>

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
    background: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "24px",
    padding: "32px",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.2)",
    position: "relative",
    zIndex: 1,
  },
  titleBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  wordTitle: {
    background: "rgba(16, 185, 129, 0.3)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    color: "white",
    padding: "18px 40px",
    borderRadius: "16px",
    fontSize: "28px",
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    marginRight: "20px",
    textShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
  },
  playButton: {
    background: "rgba(251, 191, 36, 0.4)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    color: "white",
    borderRadius: "16px",
    fontSize: "32px",
    cursor: "pointer",
    width: "80px",
    height: "80px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
  },
  playButtonActive: {
    background: "rgba(251, 191, 36, 0.7)",
    transform: "scale(0.95)",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
  },
  errorMessage: {
    background: "rgba(239, 68, 68, 0.2)",
    border: "1px solid rgba(239, 68, 68, 0.4)",
    color: "white",
    padding: "12px",
    borderRadius: "12px",
    textAlign: "center",
    marginBottom: "16px",
    fontSize: "14px",
  },
  mongolianText: {
    background: "rgba(251, 191, 36, 0.3)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    color: "white",
    padding: "12px",
    borderRadius: "12px",
    textAlign: "center",
    marginBottom: "24px",
    fontSize: "18px",
    fontWeight: "bold",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
  },
  contentArea: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginBottom: "20px",
  },
  imageSection: {
    background: "rgba(16, 185, 129, 0.2)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
  },
  imageBox: {
    background: "rgba(129, 199, 132, 0.2)",
    borderRadius: "12px",
    minHeight: "300px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    border: "1px solid rgba(255, 255, 255, 0.2)",
  },
  flowerImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "12px",
  },
  imagePlaceholder: {
    color: "white",
    fontSize: "24px",
    fontWeight: "bold",
  },
  textSection: {
    background: "rgba(16, 185, 129, 0.2)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
  },
  textBox: {
    background: "rgba(129, 199, 132, 0.2)",
    borderRadius: "12px",
    padding: "24px",
    minHeight: "300px",
    border: "1px solid rgba(255, 255, 255, 0.2)",
  },
  sectionTitle: {
    color: "white",
    marginTop: 0,
    marginBottom: "15px",
    fontSize: "20px",
  },
  description: {
    color: "white",
    fontSize: "16px",
    lineHeight: "1.6",
    marginBottom: "15px",
  },
  pronunciation: {
    color: "white",
    fontSize: "14px",
    fontStyle: "italic",
  },
  emptyState: {
    color: "white",
    fontSize: "24px",
    textAlign: "center",
    padding: "100px 0",
  },
};

export default LearningArea;
