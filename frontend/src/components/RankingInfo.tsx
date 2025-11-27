import { useLearningStore } from "../store/useLearningStore";
import { useLanguageStore } from "../store/useLanguageStore";
import { translations } from "../utils/translations";
import "./RankingInfo.css";

const RankingInfo = () => {
  const { ranking } = useLearningStore();
  const { language } = useLanguageStore();
  const t = translations[language];

  const rankingItems = [
    { id: 1, label: t.worldRank, value: ranking?.globalRank || 0, badge: "🌍" },
    {
      id: 2,
      label: t.countryRank,
      value: ranking?.countryRank || 0,
      badge: "🇰🇷",
    },
    { id: 3, label: t.koreaRank, value: ranking?.koreaRank || 0, badge: "🏙️" },
    {
      id: 4,
      label: t.regionRank,
      value: ranking?.regionRank || 0,
      badge: "📍",
    },
  ];

  return (
    <div className="ranking-info-container">
      <div className="card-title">{t.rankingInfo}</div>
      <div className="ranking-info-grid">
        {rankingItems.map((item) => (
          <div key={item.id} className="ranking-box">
            <span className="ranking-badge">{item.badge}</span>
            <div className="ranking-label">{item.label}</div>
            <div className="ranking-value">
              {item.value > 0 ? `${item.value}${t.rank}` : "-"}
            </div>
          </div>
        ))}
      </div>

      {ranking && (
        <div className="ranking-stats">
          <div className="stat-item">
            <span className="stat-label">{t.completedWords}:</span>
            <span className="stat-value">{ranking.wordsCompleted}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">{t.totalScore}:</span>
            <span className="stat-value">{ranking.score}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RankingInfo;
