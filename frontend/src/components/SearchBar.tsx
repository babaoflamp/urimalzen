import { useState, useEffect } from "react";
import { useLearningStore } from "../store/useLearningStore";
import { useLanguageStore } from "../store/useLanguageStore";
import { translations } from "../utils/translations";
import "./SearchBar.css";

const SearchBar = () => {
  const { searchQuery, setSearchQuery, isLoading } = useLearningStore();
  const { language } = useLanguageStore();
  const t = translations[language];
  const [localQuery, setLocalQuery] = useState(searchQuery);

  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  const handleSearch = () => {
    setSearchQuery(localQuery);
  };

  const handleClear = () => {
    setLocalQuery("");
    setSearchQuery("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="search-container">
      <div className="search-box">
        <div className="search-icon-container">
          <span className="search-icon">🔍</span>
        </div>
        <input
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={
            language === "ko"
              ? "한국어로 검색"
              : language === "mn"
              ? "Солонгосоор хайх"
              : "搜索韩语"
          }
          className="search-input"
        />
        <div className="search-clear-container">
          {localQuery && (
            <button onClick={handleClear} className="search-clear-btn">
              ✕
            </button>
          )}
        </div>
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="search-button"
        >
          {isLoading
            ? language === "ko"
              ? "검색 중..."
              : language === "mn"
              ? "Хайж байна..."
              : "搜索中..."
            : language === "ko"
            ? "검색"
            : language === "mn"
            ? "Хайх"
            : "搜索"}
        </button>
      </div>

      {searchQuery && (
        <div className="search-active">
          {language === "ko"
            ? "검색 중: "
            : language === "mn"
            ? "Хайлтын утга: "
            : "搜索内容："}
          <strong>{searchQuery}</strong>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
