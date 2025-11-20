import { useLearningStore } from "../store/useLearningStore";
import { useLanguageStore } from "../store/useLanguageStore";
import { translations } from "../utils/translations";
import RecordingControls from "./RecordingControls";

const LearningArea = () => {
  const { currentWord } = useLearningStore();
  const { language } = useLanguageStore();
  const t = translations[language];

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
        <button style={styles.playButton}>▶</button>
      </div>

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
