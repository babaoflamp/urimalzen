import { useLearningStore } from "../store/useLearningStore";
import { useLanguageStore } from "../store/useLanguageStore";
import "./FilterPanel.css";

const FilterPanel = () => {
  const { selectedKiipLevel, setSelectedKiipLevel } = useLearningStore();
  const { language } = useLanguageStore();

  const levels =
    language === "ko"
      ? [
          { value: 0, label: "입문", color: "#94a3b8" },
          { value: 1, label: "초급1", color: "#60a5fa" },
          { value: 2, label: "초급2", color: "#34d399" },
          { value: 3, label: "중급1", color: "#fbbf24" },
          { value: 4, label: "중급2", color: "#fb923c" },
          { value: 5, label: "고급", color: "#f87171" },
        ]
      : [
          { value: 0, label: "Танилцуулга", color: "#94a3b8" },
          { value: 1, label: "Анхан 1", color: "#60a5fa" },
          { value: 2, label: "Анхан 2", color: "#34d399" },
          { value: 3, label: "Дунд 1", color: "#fbbf24" },
          { value: 4, label: "Дунд 2", color: "#fb923c" },
          { value: 5, label: "Ахисан", color: "#f87171" },
        ];

  return (
    <div className="filter-container">
      {/* KIIP Level Filter */}
      <div className="filter-section">
        <div className="filter-level-buttons">
          {levels.map((level) => {
            const isSelected = selectedKiipLevel === level.value;
            return (
              <button
                key={level.value}
                onClick={() =>
                  setSelectedKiipLevel(isSelected ? null : level.value)
                }
                className={`filter-level-btn ${isSelected ? "selected" : ""}`}
                style={isSelected ? { background: level.color } : {}}
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

export default FilterPanel;
