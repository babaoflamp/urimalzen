import { useLearningStore } from "../store/useLearningStore";
import { useLanguageStore } from "../store/useLanguageStore";
import { translations } from "../utils/translations";

const RankingInfo = () => {
  const { ranking } = useLearningStore();
  const { language } = useLanguageStore();
  const t = translations[language];

  const rankingItems = [
    { id: 1, label: t.worldRank, value: ranking?.globalRank || 0 },
    { id: 2, label: t.countryRank, value: ranking?.countryRank || 0 },
    { id: 3, label: t.koreaRank, value: ranking?.koreaRank || 0 },
    { id: 4, label: t.regionRank, value: ranking?.regionRank || 0 },
  ];

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>{t.rankingInfo}</h2>

      <div style={styles.grid}>
        {rankingItems.map((item) => (
          <div key={item.id} style={styles.rankingBox}>
            <div style={styles.rankingLabel}>{item.label}</div>
            <div style={styles.rankingValue}>
              {item.value > 0 ? `${item.value}${t.rank}` : "-"}
            </div>
          </div>
        ))}
      </div>

      {ranking && (
        <div style={styles.stats}>
          <div style={styles.statItem}>
            <span style={styles.statLabel}>{t.completedWords}:</span>
            <span style={styles.statValue}>{ranking.wordsCompleted}</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statLabel}>{t.totalScore}:</span>
            <span style={styles.statValue}>{ranking.score}</span>
          </div>
        </div>
      )}
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
    padding: "24px",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.2)",
    position: "relative",
    zIndex: 1,
  },
  title: {
    color: "white",
    textAlign: "center",
    fontSize: "22px",
    marginBottom: "24px",
    fontWeight: "bold",
    textShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    marginBottom: "20px",
  },
  rankingBox: {
    background: "rgba(16, 185, 129, 0.3)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    borderRadius: "16px",
    padding: "18px",
    textAlign: "center",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
  },
  rankingLabel: {
    color: "white",
    fontSize: "16px",
    marginBottom: "8px",
  },
  rankingValue: {
    color: "white",
    fontSize: "28px",
    fontWeight: "bold",
  },
  stats: {
    background: "rgba(16, 185, 129, 0.2)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    borderRadius: "16px",
    padding: "18px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
  },
  statItem: {
    display: "flex",
    justifyContent: "space-between",
    color: "white",
  },
  statLabel: {
    fontSize: "16px",
  },
  statValue: {
    fontSize: "18px",
    fontWeight: "bold",
  },
};

export default RankingInfo;
