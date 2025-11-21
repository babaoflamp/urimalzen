import { useLearningStore } from "../store/useLearningStore";
import { useLanguageStore } from "../store/useLanguageStore";
import "./WordList.css";

const WordList = () => {
  const { filteredWords, currentWordIndex, setCurrentWordIndex, userProgress } =
    useLearningStore();
  const { language } = useLanguageStore();

  const getWordProgress = (wordId: string) => {
    return userProgress.find((p) => p.wordId === wordId);
  };

  const getLevelColor = (kiipLevel?: number) => {
    const colors: { [key: number]: string } = {
      0: "#B0BEC5",
      1: "#64B5F6",
      2: "#4DB6AC",
      3: "#FFD54F",
      4: "#FFB74D",
      5: "#FF8A65",
    };
    return kiipLevel !== undefined ? colors[kiipLevel] || "#4FC3F7" : "#4FC3F7";
  };

  if (filteredWords.length === 0) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>
          {language === "ko" ? "학습 단어 목록" : "Үгийн жагсаалт"}
        </h2>
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>📝</div>
          <div style={styles.emptyText}>
            {language === "ko" ? "단어가 없습니다" : "Үг байхгүй байна"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>
        {language === "ko" ? "학습 단어 목록" : "Үгийн жагсаалт"}
      </h2>

      <div className="word-list" style={styles.list}>
        {filteredWords.map((word, index) => {
          const progress = getWordProgress(word._id);
          const isActive = index === currentWordIndex;
          const levelColor = getLevelColor(word.level?.kiip);

          return (
            <div
              key={word._id}
              style={{
                ...styles.wordItem,
                ...(isActive ? styles.activeItem : {}),
              }}
              onClick={() => setCurrentWordIndex(index)}
            >
              <div
                style={{
                  ...styles.wordNumber,
                  background: levelColor,
                  color: "white",
                }}
              >
                {index + 1}
              </div>
              <div style={styles.wordContent}>
                <div style={styles.wordName}>{word.koreanWord}</div>
                <div style={styles.wordMongolian}>{word.mongolianWord}</div>
                {word.mainCategory && (
                  <div style={styles.wordCategory}>{word.mainCategory}</div>
                )}
              </div>
              <div style={styles.wordAttempts}>{progress?.attempts || 0}</div>
              <button style={styles.playButton}>▶</button>
            </div>
          );
        })}
      </div>

      <div style={styles.footer}>
        {filteredWords.length > 0 &&
          (language === "ko"
            ? `현재 단어: ${currentWordIndex + 1} / ${filteredWords.length}`
            : `Одоогийн үг: ${currentWordIndex + 1} / ${filteredWords.length}`)}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    background:
      "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(135, 206, 235, 0.15) 50%, rgba(38, 198, 218, 0.1) 100%)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(79, 195, 247, 0.3)",
    borderRadius: "24px",
    padding: "24px",
    boxShadow:
      "0 8px 32px 0 rgba(31, 38, 135, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
    display: "flex",
    flexDirection: "column",
    height: "fit-content",
    position: "relative",
    zIndex: 1,
  },
  title: {
    color: "#1a1a1a",
    textAlign: "center",
    fontSize: "22px",
    marginBottom: "8px",
    fontWeight: "bold",
  },
  count: {
    color: "#4a4a4a",
    textAlign: "center",
    fontSize: "14px",
    marginBottom: "16px",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "20px",
    maxHeight: "440px",
    overflowY: "auto",
    paddingRight: "8px",
  },
  wordItem: {
    background:
      "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(135, 206, 235, 0.12) 100%)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    border: "1px solid rgba(79, 195, 247, 0.25)",
    padding: "10px",
    borderRadius: "16px",
    display: "grid",
    gridTemplateColumns: "40px 1fr 40px 35px",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow:
      "0 4px 16px rgba(31, 38, 135, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
  },
  activeItem: {
    background:
      "linear-gradient(135deg, rgba(79, 195, 247, 0.35) 0%, rgba(38, 198, 218, 0.3) 100%)",
    border: "1px solid rgba(79, 195, 247, 0.5)",
    transform: "scale(1.03) translateX(4px)",
    boxShadow:
      "0 8px 24px rgba(79, 195, 247, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
  },
  wordNumber: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    fontSize: "15px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
  },
  wordContent: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  wordName: {
    color: "#1a1a1a",
    fontWeight: "bold",
    fontSize: "15px",
    lineHeight: "1.2",
  },
  wordMongolian: {
    color: "#4a4a4a",
    fontSize: "12px",
    lineHeight: "1.2",
  },
  wordCategory: {
    color: "#757575",
    fontSize: "11px",
    marginTop: "2px",
  },
  wordAttempts: {
    background: "rgba(79, 195, 247, 0.2)",
    color: "#1a1a1a",
    padding: "4px",
    borderRadius: "10px",
    textAlign: "center",
    fontSize: "13px",
    fontWeight: "bold",
    width: "36px",
    height: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid rgba(79, 195, 247, 0.3)",
  },
  playButton: {
    background:
      "linear-gradient(135deg, rgba(79, 195, 247, 0.25) 0%, rgba(38, 198, 218, 0.2) 100%)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    color: "#1a1a1a",
    border: "1px solid rgba(79, 195, 247, 0.3)",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "14px",
    width: "32px",
    height: "32px",
    transition: "all 0.3s ease",
    boxShadow:
      "0 4px 12px rgba(31, 38, 135, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.5)",
  },
  footer: {
    background:
      "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(135, 206, 235, 0.15) 100%)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    border: "1px solid rgba(79, 195, 247, 0.3)",
    color: "#1a1a1a",
    padding: "10px 16px",
    borderRadius: "14px",
    textAlign: "center",
    fontSize: "13px",
    fontWeight: "bold",
    boxShadow:
      "0 4px 16px rgba(31, 38, 135, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
    margin: "0 auto",
    maxWidth: "fit-content",
    minWidth: "200px",
  },
  empty: {
    textAlign: "center",
    padding: "60px 20px",
  },
  emptyIcon: {
    fontSize: "64px",
    marginBottom: "16px",
  },
  emptyText: {
    color: "#757575",
    fontSize: "16px",
  },
};

export default WordList;
