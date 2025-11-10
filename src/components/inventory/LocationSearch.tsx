import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLocations } from './hooks/useLocations';
import { useClickOutside } from './hooks/useClickOutside';

interface LocationSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (fullPath: string, locationId: number) => void;
  error?: string;
}

const LocationSearch: React.FC<LocationSearchProps> = ({
  value,
  onChange,
  onSelect,
  error
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  
  const { getAllLocationPaths, findLocationIdByPath } = useLocations();

  useClickOutside(searchContainerRef, () => {
    setShowSuggestions(false);
  });

  // Мемоизируем функцию поиска
  const searchLocations = useCallback((searchValue: string) => {
    if (searchValue.trim() === '') {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const allPaths = getAllLocationPaths();
    const filtered = allPaths.filter(path =>
      path.toLowerCase().includes(searchValue.toLowerCase())
    );
    setSuggestions(filtered.slice(0, 10));
    setShowSuggestions(true);
  }, [getAllLocationPaths]);

  // Поиск локаций по введенному тексту
  useEffect(() => {
    searchLocations(value);
  }, [value, searchLocations]);

  const handleSuggestionClick = (fullPath: string) => {
    const locationId = findLocationIdByPath(fullPath);
    if (locationId) {
      onSelect(fullPath, locationId);
      setShowSuggestions(false);
    }
  };

  return (
    <div className="form-group">
      <label htmlFor="location_search">Локация</label>
      <div className="search-container" ref={searchContainerRef}>
        <input
          type="text"
          id="location_search"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => {
            if (value && suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          placeholder="Начните вводить название локации..."
          className={error ? 'error' : ''}
        />
        
        {showSuggestions && suggestions.length > 0 && (
          <div className="suggestions-dropdown">
            {suggestions.map((path, index) => (
              <div
                key={index}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(path)}
              >
                {path}
              </div>
            ))}
          </div>
        )}
      </div>
      {error && <span className="error-text">{error}</span>}
      <div className="help-text">
        Выберите локацию из списка. Формат: Корневая/Дочерняя/Внучатая
      </div>
    </div>
  );
};

export default LocationSearch;