import type { Unit, Lesson } from "../types";

interface UnitCardProps {
  unit: Unit;
  onClick?: () => void;
  isSelected?: boolean;
}

export const UnitCard = ({
  unit,
  onClick,
  isSelected = false,
}: UnitCardProps) => {
  const levelColors: { [key: number]: string } = {
    0: "#94a3b8",
    1: "#60a5fa",
    2: "#34d399",
    3: "#fbbf24",
    4: "#fb923c",
    5: "#f87171",
  };
  const kiipLevel = unit.kiipLevel ?? 0;
  const levelColor = levelColors[kiipLevel] || "#667eea";
  return (
    <div
      className={`units-feature-card${isSelected ? " selected" : ""}`}
      style={
        { ["--unit-level-color" as any]: levelColor } as React.CSSProperties
      }
      onClick={onClick}
    >
      <div className="units-feature-header">
        <div className="units-feature-number">{unit.unitNumber}</div>
        <div className="units-feature-badge">KIIP {unit.kiipLevel}</div>
      </div>
      <div className="units-feature-title">{unit.title}</div>
      <div className="units-feature-title-mn">{unit.titleMn}</div>
      <div className="units-feature-category">{unit.mainCategory}</div>
      <div className="units-feature-desc">{unit.description}</div>
      <div className="units-feature-desc-mn">{unit.descriptionMn}</div>
      <div className="units-feature-footer">
        <div className="units-feature-lesson-count">
          📚 {unit.lessons?.length || 0}개 레슨
        </div>
        <div className="units-feature-challenge">
          {unit.challenge ? "🏆 도전" : ""}
        </div>
      </div>
    </div>
  );
};

interface LessonCardProps {
  lesson: Lesson;
  unitNumber?: number;
  onClick?: () => void;
  isCompleted?: boolean;
}

export const LessonCard = ({
  lesson,
  unitNumber,
  onClick,
  isCompleted = false,
}: LessonCardProps) => {
  return (
    <div
      className={`units-feature-lesson-card${isCompleted ? " completed" : ""}`}
      onClick={onClick}
    >
      <div className="units-feature-lesson-header">
        <div className="units-feature-lesson-number">
          {unitNumber
            ? `${unitNumber}-${lesson.lessonNumber}`
            : lesson.lessonNumber}
        </div>
        {isCompleted && (
          <div className="units-feature-lesson-completed">✓ 완료</div>
        )}
      </div>
      <div className="units-feature-lesson-title">{lesson.title}</div>
      <div className="units-feature-lesson-title-mn">{lesson.titleMn}</div>
      <div className="units-feature-lesson-info">
        <div className="units-feature-lesson-wordcount">
          📚 {lesson.wordIds?.length || 0}개 단어
        </div>
        {lesson.isReview && (
          <div className="units-feature-lesson-review">🔄 복습</div>
        )}
      </div>
    </div>
  );
};

// ...기존 styles 객체 전체 제거 (더 이상 사용하지 않음)

export default UnitCard;
