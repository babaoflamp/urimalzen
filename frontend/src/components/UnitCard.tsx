import type { Unit, Lesson } from '../types';

interface UnitCardProps {
  unit: Unit;
  onClick?: () => void;
  isSelected?: boolean;
}

export const UnitCard = ({ unit, onClick, isSelected = false }: UnitCardProps) => {
  const levelColors: { [key: number]: string } = {
    0: '#94a3b8',
    1: '#60a5fa',
    2: '#34d399',
    3: '#fbbf24',
    4: '#fb923c',
    5: '#f87171',
  };

  const levelColor = levelColors[unit.kiipLevel] || '#667eea';

  return (
    <div
      style={{
        ...styles.unitCard,
        ...(isSelected ? styles.selectedCard : {}),
        borderLeft: `6px solid ${levelColor}`,
      }}
      onClick={onClick}
    >
      <div style={styles.unitHeader}>
        <div style={{ ...styles.unitNumber, background: levelColor }}>
          {unit.unitNumber}
        </div>
        <div>
          <div style={styles.unitBadge}>KIIP {unit.kiipLevel}</div>
        </div>
      </div>

      <div style={styles.unitTitle}>{unit.title}</div>
      <div style={styles.unitTitleMn}>{unit.titleMn}</div>

      <div style={styles.unitCategory}>{unit.mainCategory}</div>

      <div style={styles.unitDescription}>{unit.description}</div>
      <div style={styles.unitDescriptionMn}>{unit.descriptionMn}</div>

      <div style={styles.unitFooter}>
        <div style={styles.lessonCount}>
          📚 {unit.lessons?.length || 0}개 레슨
        </div>
        <div style={styles.challengeBadge}>
          {unit.challenge ? '🏆 도전' : ''}
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
      style={{
        ...styles.lessonCard,
        ...(isCompleted ? styles.completedCard : {}),
      }}
      onClick={onClick}
    >
      <div style={styles.lessonHeader}>
        <div style={styles.lessonNumber}>
          {unitNumber ? `${unitNumber}-${lesson.lessonNumber}` : lesson.lessonNumber}
        </div>
        {isCompleted && <div style={styles.completedBadge}>✓ 완료</div>}
      </div>

      <div style={styles.lessonTitle}>{lesson.title}</div>
      <div style={styles.lessonTitleMn}>{lesson.titleMn}</div>

      <div style={styles.objectiveContainer}>
        <div style={styles.objectiveLabel}>학습 목표:</div>
        <div style={styles.objectiveText}>{lesson.learningObjective}</div>
        <div style={styles.objectiveTextMn}>{lesson.learningObjectiveMn}</div>
      </div>

      <div style={styles.exerciseInfo}>
        {lesson.exercises?.length || 0}개 연습 문제
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  // Unit Card Styles
  unitCard: {
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '16px',
    padding: '24px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  selectedCard: {
    background: 'rgba(99, 102, 241, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    transform: 'scale(1.02)',
    boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
  },
  unitHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  unitNumber: {
    width: '56px',
    height: '56px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '28px',
    fontWeight: 'bold',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
  },
  unitBadge: {
    background: 'rgba(255, 255, 255, 0.3)',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  unitTitle: {
    color: 'white',
    fontSize: '20px',
    fontWeight: 'bold',
    lineHeight: '1.3',
  },
  unitTitleMn: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: '16px',
    marginBottom: '8px',
  },
  unitCategory: {
    background: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: 'bold',
    alignSelf: 'flex-start',
  },
  unitDescription: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '14px',
    lineHeight: '1.5',
    marginTop: '8px',
  },
  unitDescriptionMn: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '13px',
    lineHeight: '1.5',
  },
  unitFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: '1px solid rgba(255, 255, 255, 0.2)',
  },
  lessonCount: {
    color: 'white',
    fontSize: '13px',
    fontWeight: 'bold',
  },
  challengeBadge: {
    color: 'white',
    fontSize: '13px',
  },

  // Lesson Card Styles
  lessonCard: {
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '16px',
    padding: '20px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  completedCard: {
    background: 'rgba(52, 211, 153, 0.3)',
    border: '1px solid rgba(52, 211, 153, 0.5)',
  },
  lessonHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lessonNumber: {
    background: 'rgba(99, 102, 241, 0.5)',
    color: 'white',
    width: '48px',
    height: '48px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: 'bold',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
  },
  completedBadge: {
    background: 'rgba(52, 211, 153, 0.5)',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  lessonTitle: {
    color: 'white',
    fontSize: '18px',
    fontWeight: 'bold',
    lineHeight: '1.3',
  },
  lessonTitleMn: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: '15px',
  },
  objectiveContainer: {
    background: 'rgba(0, 0, 0, 0.1)',
    borderRadius: '10px',
    padding: '12px',
    marginTop: '4px',
  },
  objectiveLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '11px',
    fontWeight: 'bold',
    marginBottom: '6px',
    textTransform: 'uppercase',
  },
  objectiveText: {
    color: 'white',
    fontSize: '13px',
    lineHeight: '1.4',
    marginBottom: '4px',
  },
  objectiveTextMn: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: '12px',
    lineHeight: '1.4',
  },
  exerciseInfo: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '12px',
    fontWeight: 'bold',
    marginTop: '4px',
  },
};

export default UnitCard;
