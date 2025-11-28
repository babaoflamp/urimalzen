import { useLearningStore } from "../store/useLearningStore";
import { useLanguageStore } from "../store/useLanguageStore";
import { translations } from "../utils/translations";
import "./WordList.css";

const WordList = () => {
  const { filteredWords, currentWordIndex, setCurrentWordIndex, userProgress } =
    useLearningStore();
  const { language } = useLanguageStore();
  const t = translations[language];

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
        <h2 className="word-list-title">{t.wordList}</h2>
        <div className="word-list-empty">
          <div className="word-list-empty-icon">📝</div>
          <div className="word-list-empty-text">
            {language === "ko"
              ? "단어가 없습니다"
              : language === "mn"
              ? "Үг байхгүй байна"
              : "没有单词"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="word-list-container">
      <h2 className="word-list-title">{t.wordList}</h2>

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
              </div>
              <div className="word-attempts">
                {word.level?.kiip !== undefined
                  ? `Lv.${word.level.kiip}`
                  : "Lv.0"}
              </div>
              <div className="word-score">{progress?.score || 0}점</div>
            </div>
          );
        })}
      </div>

      <div className="word-list-footer">
        {filteredWords.length > 0 &&
          (language === "ko"
            ? `현재 단어: ${currentWordIndex + 1} / ${filteredWords.length}`
            : language === "mn"
            ? `Одоогийн үг: ${currentWordIndex + 1} / ${filteredWords.length}`
            : `当前单词: ${currentWordIndex + 1} / ${filteredWords.length}`)}
      </div>
    </div>
  );
};

export default WordList;
