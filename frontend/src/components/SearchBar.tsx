import { useState, useEffect } from 'react';
import { useLearningStore } from '../store/useLearningStore';

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
    setLocalQuery('');
    setSearchQuery('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.searchBox}>
        <div style={styles.iconContainer}>
          <span style={styles.icon}>🔍</span>
        </div>
        <input
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="한국어 또는 몽골어로 검색..."
          style={styles.input}
        />
        {localQuery && (
          <button onClick={handleClear} style={styles.clearButton}>
            ✕
          </button>
        )}
        <button
          onClick={handleSearch}
          disabled={isLoading}
          style={{
            ...styles.searchButton,
            ...(isLoading ? styles.buttonDisabled : {}),
          }}
        >
          {isLoading ? '검색 중...' : '검색'}
        </button>
      </div>

      {searchQuery && (
        <div style={styles.activeSearch}>
          검색 중: <strong>{searchQuery}</strong>
        </div>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '16px',
    padding: '8px 12px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
  },
  icon: {
    fontSize: '20px',
  },
  input: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    color: 'white',
    fontSize: '16px',
    outline: 'none',
    padding: '8px',
  },
  clearButton: {
    background: 'rgba(239, 68, 68, 0.4)',
    color: 'white',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '8px',
    width: '32px',
    height: '32px',
    cursor: 'pointer',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
  },
  searchButton: {
    background: 'rgba(99, 102, 241, 0.5)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    color: 'white',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '10px',
    padding: '8px 20px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    whiteSpace: 'nowrap',
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  activeSearch: {
    color: 'white',
    fontSize: '13px',
    padding: '8px 16px',
    background: 'rgba(99, 102, 241, 0.3)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderRadius: '10px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
  },
};

export default SearchBar;
