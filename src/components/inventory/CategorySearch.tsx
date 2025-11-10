import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useCategories } from './hooks/useCategories';
import { useClickOutside } from './hooks/useClickOutside';

interface CategorySearchProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (fullPath: string, categoryId: number) => void;
  error?: string;
  required?: boolean;
}

const CategorySearch: React.FC<CategorySearchProps> = ({
  value,
  onChange,
  onSelect,
  error,
  required = false
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  
  const { getAllCategoryPaths, findCategoryIdByPath } = useCategories();

  useClickOutside(searchContainerRef, () => {
    setShowSuggestions(false);
  });

  // Мемоизируем функцию поиска
  const searchCategories = useCallback((searchValue: string) => {
    if (searchValue.trim() === '') {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const allPaths = getAllCategoryPaths();
    const filtered = allPaths.filter(path =>
      path.toLowerCase().includes(searchValue.toLowerCase())
    );
    setSuggestions(filtered.slice(0, 10));
    setShowSuggestions(true);
  }, [getAllCategoryPaths]); // 👈 Теперь зависимость стабильна

  // Поиск категорий по введенному тексту
  useEffect(() => {
    searchCategories(value);
  }, [value, searchCategories]); // 👈 searchCategories мемоизирована

  const handleSuggestionClick = (fullPath: string) => {
    const categoryId = findCategoryIdByPath(fullPath);
    if (categoryId) {
      onSelect(fullPath, categoryId);
      setShowSuggestions(false);
    }
  };

  return (
    <div className="form-group">
      <label htmlFor="category_search">Наименование {required && '*'}</label>
      <div className="search-container" ref={searchContainerRef}>
        <input
          type="text"
          id="category_search"
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
          placeholder="Начните вводить название категории или наименования..."
          className={error ? 'error' : ''}
          required={required}
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
        Выберите наименование из списка. Формат: Корневая категория/Дочерняя/модель ТМЦ
      </div>
    </div>
  );
};

export default CategorySearch;