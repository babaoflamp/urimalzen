import { useLearningStore } from "../store/useLearningStore";
import { useLanguageStore } from "../store/useLanguageStore";
import { translations } from "../utils/translations";
import "./FilterPanel.css";

const FilterPanel = () => {
  const { selectedKiipLevel, setSelectedKiipLevel } = useLearningStore();
  const { language } = useLanguageStore();
  const t = translations[language];

  const levels = [
    { value: 0, label: t.introductory, color: "#94a3b8" },
    { value: 1, label: t.elementary1, color: "#60a5fa" },
    { value: 2, label: t.elementary2, color: "#34d399" },
    { value: 3, label: t.intermediate1, color: "#fbbf24" },
    { value: 4, label: t.intermediate2, color: "#fb923c" },
    { value: 5, label: t.advanced, color: "#f87171" },
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
