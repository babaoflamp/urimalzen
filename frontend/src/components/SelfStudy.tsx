import { useAuthStore } from "../store/useAuthStore";
import { useLanguageStore } from "../store/useLanguageStore";
import { translations } from "../utils/translations";
import "./SelfStudy.css";

const SelfStudy = () => {
  const { user } = useAuthStore();
  const { language } = useLanguageStore();
  const t = translations[language];

  const menuItems = [
    { id: 1, label: t.cefrLevel },
    { id: 2, label: t.kiipLevelMenu },
    { id: 3, label: t.examples },
    { id: 4, label: t.synonyms },
    { id: 5, label: t.videoMaterial },
    { id: 6, label: t.externalContent },
  ];

  return (
    <div className="self-study-container">
      <div className="card-title">{t.selfStudy}</div>
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
