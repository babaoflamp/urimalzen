import { useState, useEffect } from "react";
import { useLearningStore } from "../store/useLearningStore";
import "./SearchBar.css";

const SearchBar = () => {
  const { searchQuery, setSearchQuery, isLoading } = useLearningStore();
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
          placeholder="한국어 또는 몽골어로 검색..."
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
          {isLoading ? "검색 중..." : "검색"}
        </button>
      </div>

      {searchQuery && (
        <div className="search-active">
          검색 중: <strong>{searchQuery}</strong>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
