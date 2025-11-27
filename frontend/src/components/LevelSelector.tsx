import { useLearningStore } from "../store/useLearningStore";

interface LevelSelectorProps {
  onLevelSelect?: (level: number) => void;
}

const LevelSelector = ({ onLevelSelect }: LevelSelectorProps) => {
  const { selectedKiipLevel, setSelectedKiipLevel } = useLearningStore();

  const levels = [
    {
      kiip: 0,
      cefr: "Pre-A1",
      name: "입문",
      nameMn: "Танилцуулга",
      description: "한글 자모 및 기초",
      descriptionMn: "Монгол үсэг, үндсэн ойлголт",
      color: "#94a3b8",
    },
    {
      kiip: 1,
      cefr: "A1",
      name: "초급 1",
      nameMn: "Анхан шат 1",
      description: "일상적인 기초 표현",
      descriptionMn: "Өдөр тутмын үндсэн илэрхийлэл",
      color: "#60a5fa",
    },
    {
      kiip: 2,
      cefr: "A2",
      name: "초급 2",
      nameMn: "Анхан шат 2",
      description: "친숙한 일상 주제",
      descriptionMn: "Танил өдөр тутмын сэдвүүд",
      color: "#34d399",
    },
    {
      kiip: 3,
      cefr: "B1",
      name: "중급 1",
      nameMn: "Дунд шат 1",
      description: "일상생활 및 업무",
      descriptionMn: "Өдөр тутмын амьдрал болон ажил",
      color: "#fbbf24",
    },
    {
      kiip: 4,
      cefr: "B2",
      name: "중급 2",
      nameMn: "Дунд шат 2",
      description: "복잡한 주제 이해",
      descriptionMn: "Нарийн төвөгтэй сэдвийг ойлгох",
      color: "#fb923c",
    },
    {
      kiip: 5,
      cefr: "C1-C2",
      name: "고급",
      nameMn: "Дээд шат",
      description: "전문적이고 추상적인 주제",
      descriptionMn: "Мэргэжлийн болон хийсвэр сэдвүүд",
      color: "#f87171",
    },
  ];

  const handleLevelClick = (level: number) => {
    const newLevel = selectedKiipLevel === level ? null : level;
    setSelectedKiipLevel(newLevel);
    if (onLevelSelect && newLevel !== null) {
      onLevelSelect(newLevel);
    }
  };

  return (
    <div className="levels-feature-container">
      <h2 className="levels-description-title">KIIP 단계 선택</h2>
      <div className="levels-description-subtitle">
        한국 사회 통합 프로그램 레벨
      </div>
      <div className="levels-feature-grid">
        {levels.map((level) => {
          const isSelected = selectedKiipLevel === level.kiip;
          return (
            <div
              key={level.kiip}
              className={`levels-feature-card${isSelected ? " selected" : ""}`}
              style={{ borderTop: `4px solid ${level.color}` }}
              onClick={() => handleLevelClick(level.kiip)}
            >
              <div className="levels-feature-header">
                <div
                  className="levels-feature-badge"
                  style={{ background: level.color }}
                >
                  {level.kiip}
                </div>
                <div className="levels-feature-cefr">{level.cefr}</div>
              </div>
              <div className="levels-feature-name">{level.name}</div>
              <div className="levels-feature-name-mn">{level.nameMn}</div>
              <div className="levels-feature-desc">{level.description}</div>
              <div className="levels-feature-desc-mn">
                {level.descriptionMn}
              </div>
            </div>
          );
        })}
      </div>
      {selectedKiipLevel !== null && (
        <div className="levels-feature-info-box">
          <div className="levels-feature-info-text">
            선택됨: KIIP {selectedKiipLevel} - {levels[selectedKiipLevel].name}
          </div>
          <button
            className="levels-feature-clear-button"
            onClick={() => setSelectedKiipLevel(null)}
          >
            선택 해제
          </button>
        </div>
      )}
    </div>
  );
};

// ...기존 styles 객체 전체 제거 (더 이상 사용하지 않음)

export default LevelSelector;
