import { useAuthStore } from "../store/useAuthStore";
import "./SelfStudy.css";

const SelfStudy = () => {
  const { user } = useAuthStore();

  const menuItems = [
    { id: 1, label: "CEFR Level" },
    { id: 2, label: "KIIP Level" },
    { id: 3, label: "예문" },
    { id: 4, label: "유의어" },
    { id: 5, label: "영상 자료" },
    { id: 6, label: "외부 콘텐츠" },
  ];

  return (
    <div className="self-study-container">
      <div className="self-study-grid">
        {menuItems.map((item) => (
          <button key={item.id} className="self-study-menu-button">
            {item.label}
            {item.id === 1 && user && (
              <span className="self-study-badge">{user.level.cefr}</span>
            )}
            {item.id === 2 && user && (
              <span className="self-study-badge">{user.level.kiip}급</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SelfStudy;
