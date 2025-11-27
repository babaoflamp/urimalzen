import { useEffect, useState } from "react";
import Header from "../components/Header";
import MainNav from "../components/MainNav";
import { UnitCard } from "../components/UnitCard";
import { useUnitStore } from "../store/useUnitStore";
import "./Units.css";

const Units = () => {
  const { units, fetchUnits, isLoading } = useUnitStore();
  const [filterLevel, setFilterLevel] = useState<number | null>(null);
  const [filterCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchUnits(filterLevel ?? undefined, filterCategory ?? undefined);
  }, [fetchUnits, filterLevel, filterCategory]);

  const handleUnitClick = (unitId: string) => {
    // Navigate to unit detail page (can be implemented later)
    console.log("Unit clicked:", unitId);
  };

  const levels = [0, 1, 2, 3, 4, 5];

  return (
    <div className="units-container">
      <Header />
      <MainNav />

      <div className="units-content">
        <div className="units-hero">
          <h1 className="units-hero-title">학습 경로</h1>
          <p className="units-hero-subtitle">
            체계적인 유닛과 레슨으로 구성된 학습 경로를 따라가세요
          </p>
        </div>

        {/* Filter Section 복구 및 스타일 클래스 적용 */}
        <div className="units-filter-card">
          <div className="units-filter-card-title">KIIP 레벨</div>
          <div className="units-filter-card-buttons">
            <button
              onClick={() => setFilterLevel(null)}
              className={`units-filter-card-button${
                filterLevel === null ? " active" : ""
              }`}
            >
              전체
            </button>
            {levels.map((level) => (
              <button
                key={level}
                onClick={() => setFilterLevel(level)}
                className={`units-filter-card-button${
                  filterLevel === level ? " active" : ""
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Units Grid */}
        {isLoading ? (
          <div className="units-loading">
            <div className="units-loading-text">유닛을 불러오는 중...</div>
          </div>
        ) : units.length === 0 ? (
          <div className="units-empty">
            <div className="units-empty-icon">📚</div>
            <div className="units-empty-text">
              아직 생성된 학습 유닛이 없습니다
            </div>
            <div className="units-empty-subtext">
              관리자가 곧 학습 콘텐츠를 추가할 예정입니다
            </div>
          </div>
        ) : (
          <>
            <div className="units-grid">
              {units.map((unit) => (
                <UnitCard
                  key={unit._id}
                  unit={unit}
                  onClick={() => handleUnitClick(unit._id)}
                />
              ))}
            </div>

            <div className="units-info-box">
              <div className="units-info-icon">💡</div>
              <div className="units-info-content">
                <div className="units-info-title">학습 경로란?</div>
                <div className="units-info-text">
                  각 유닛은 여러 레슨으로 구성되어 있으며, 순차적으로 학습하면서
                  점진적으로 실력을 향상시킬 수 있습니다. 유닛을 완료하면 도전
                  과제에 도전할 수 있습니다!
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Units;
