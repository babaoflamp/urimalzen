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

  const getLevelClass = (kiipLevel?: number) => {
    if (kiipLevel === undefined) return "level-1";
    return `level-${kiipLevel}`;
  };

  if (filteredWords.length === 0) {
    return (
      <div className="word-list-container">
        <h2 className="word-list-title">
          {language === "ko" ? "학습 단어 목록" : "Үгийн жагсаалт"}
        </h2>
        <div className="word-list-empty">
          <div className="word-list-empty-icon">📝</div>
          <div className="word-list-empty-text">
            {language === "ko" ? "단어가 없습니다" : "Үг байхгүй байна"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="word-list-container">
      <h2 className="word-list-title">
        {language === "ko" ? "학습 단어 목록" : "Үгийн жагсаалт"}
      </h2>

      <div className="word-list">
        {filteredWords.map((word, index) => {
          const progress = getWordProgress(word._id);
          const isActive = index === currentWordIndex;
          const levelClass = getLevelClass(word.level?.kiip);

          return (
            <div
              key={word._id}
              className={`word-item ${isActive ? "active" : ""}`}
              onClick={() => setCurrentWordIndex(index)}
            >
              <div className={`word-number ${levelClass}`}>{index + 1}</div>
              <div className="word-content">
                <div className="word-name">{word.koreanWord}</div>
                <div className="word-mongolian">{word.mongolianWord}</div>
                {word.mainCategory && (
                  <div className="word-category">{word.mainCategory}</div>
                )}
              </div>
              <div className="word-attempts">{progress?.attempts || 0}</div>
              <button className="word-play-button">▶</button>
            </div>
          );
        })}
      </div>

      <div className="word-list-footer">
        {filteredWords.length > 0 &&
          (language === "ko"
            ? `현재 단어: ${currentWordIndex + 1} / ${filteredWords.length}`
            : `Одоогийн үг: ${currentWordIndex + 1} / ${filteredWords.length}`)}
      </div>
    </div>
  );
};

export default WordList;
