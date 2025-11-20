import { useLearningStore } from "../store/useLearningStore";
import { useLanguageStore } from "../store/useLanguageStore";

const FilterPanel = () => {
  const { selectedKiipLevel, setSelectedKiipLevel, clearFilters } =
    useLearningStore();
  const { language } = useLanguageStore();

  const levels = language === 'ko' ? [
    { value: 0, label: "입문", color: "#94a3b8" },
    { value: 1, label: "초급1", color: "#60a5fa" },
    { value: 2, label: "초급2", color: "#34d399" },
    { value: 3, label: "중급1", color: "#fbbf24" },
    { value: 4, label: "중급2", color: "#fb923c" },
    { value: 5, label: "고급", color: "#f87171" },
  ] : [
    { value: 0, label: "Танилцуулга", color: "#94a3b8" },
    { value: 1, label: "Анхан 1", color: "#60a5fa" },
    { value: 2, label: "Анхан 2", color: "#34d399" },
    { value: 3, label: "Дунд 1", color: "#fbbf24" },
    { value: 4, label: "Дунд 2", color: "#fb923c" },
    { value: 5, label: "Ахисан", color: "#f87171" },
  ];

  const hasActiveFilters = selectedKiipLevel !== null;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>{language === 'ko' ? '필터' : 'Шүүлтүүр'}</h3>
        {hasActiveFilters && (
          <button onClick={clearFilters} style={styles.clearAllButton}>
            {language === 'ko' ? '모두 지우기' : 'Бүгдийг арилгах'}
          </button>
        )}
      </div>

      {/* KIIP Level Filter */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>{language === 'ko' ? 'KIIP 단계' : 'KIIP Шат'}</div>
        <div style={styles.levelButtons}>
          {levels.map((level) => {
            const isSelected = selectedKiipLevel === level.value;
            return (
              <button
                key={level.value}
                onClick={() =>
                  setSelectedKiipLevel(isSelected ? null : level.value)
                }
                style={{
                  ...styles.levelButton,
                  ...(isSelected
                    ? { ...styles.selectedButton, background: level.color }
                    : {}),
                }}
              >
                {level.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    background: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "16px",
    padding: "12px",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.2)",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    position: "relative",
    zIndex: 1,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
    margin: 0,
    textShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
  },
  clearAllButton: {
    background: "rgba(239, 68, 68, 0.4)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    color: "white",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    borderRadius: "8px",
    padding: "6px 12px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "bold",
    transition: "all 0.3s ease",
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  sectionTitle: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: "11px",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  levelButtons: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "6px",
  },
  levelButton: {
    background: "rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    borderRadius: "8px",
    color: "white",
    padding: "8px 4px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "bold",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedButton: {
    border: "2px solid rgba(255, 255, 255, 0.6)",
    transform: "scale(1.05)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
  },
};

export default FilterPanel;
