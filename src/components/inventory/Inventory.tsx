import React, { useState, useEffect, useRef } from 'react';
import { categoriesAPI, locationsAPI } from '../../services/api';
import './style.css';

// TODO: Разбить и отрефакторить этот файл
interface Category {
  id: number;
  name: string;
  children: Category[];
}

interface Location {
  id: number;
  name: string;
  address?: string;
  parent_id?: number;
  children?: Location[];
}

interface InventoryFormData {
  category_id: string;
  location_id: string;
  item_type: 'equipment' | 'spare_part';
  parent_item_id: string;
  serial_number: string;
  mac: string;
  ip_address: string;
  description: string;
}

const InventoryPage: React.FC = () => {
  const [formData, setFormData] = useState<InventoryFormData>({
    category_id: '',
    location_id: '',
    item_type: 'equipment',
    parent_item_id: '',
    serial_number: '',
    mac: '',
    ip_address: '',
    description: '',
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  
  // Состояния для категорий
  const [categorySuggestions, setCategorySuggestions] = useState<string[]>([]);
  const [showCategorySuggestions, setShowCategorySuggestions] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');
  
  // Состояния для локаций
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  
  const categorySearchRef = useRef<HTMLDivElement>(null);
  const locationSearchRef = useRef<HTMLDivElement>(null);

  // Загрузка категорий
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCategories(await categoriesAPI.getCategories());
      } catch (error) {
        console.error('Ошибка загрузки категорий:', error);
      }
    };

    loadCategories();
  }, []);

  // Загрузка локаций
  useEffect(() => {
    const loadLocations = async () => {
      try {
        setLocations(await locationsAPI.getLocations());
      } catch (error) {
        console.error('Ошибка загрузки локаций:', error);
      }
    };

    loadLocations();
  }, []);

  // Обработчик клика вне областей поиска
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categorySearchRef.current && !categorySearchRef.current.contains(event.target as Node)) {
        setShowCategorySuggestions(false);
      }
      if (locationSearchRef.current && !locationSearchRef.current.contains(event.target as Node)) {
        setShowLocationSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Функция для построения полного пути категории
  const getCategoryFullPath = (category: Category, path: string = ''): string[] => {
    const currentPath = path ? `${path}/${category.name}` : category.name;
    const paths = [currentPath];

    if (category.children && category.children.length > 0) {
      category.children.forEach(child => {
        paths.push(...getCategoryFullPath(child, currentPath));
      });
    }

    return paths;
  };

  // Функция для построения полного пути локации
  const getLocationFullPath = (location: Location, path: string = ''): string[] => {
    const currentPath = path ? `${path}/${location.name}` : location.name;
    const paths = [currentPath];

    if (location.children && location.children.length > 0) {
      location.children.forEach(child => {
        paths.push(...getLocationFullPath(child, currentPath));
      });
    }

    return paths;
  };

  // Получение всех полных путей категорий
  const getAllCategoryPaths = (): string[] => {
    const allPaths: string[] = [];
    categories.forEach(category => {
      allPaths.push(...getCategoryFullPath(category));
    });
    return allPaths;
  };

  // Получение всех полных путей локаций
  const getAllLocationPaths = (): string[] => {
    const allPaths: string[] = [];
    locations.forEach(location => {
      allPaths.push(...getLocationFullPath(location));
    });
    return allPaths;
  };

  // Поиск категорий по введенному тексту
  useEffect(() => {
    if (categorySearch.trim() === '') {
      setCategorySuggestions([]);
      setShowCategorySuggestions(false);
      return;
    }

    const allPaths = getAllCategoryPaths();
    const filtered = allPaths.filter(path =>
      path.toLowerCase().includes(categorySearch.toLowerCase())
    );
    setCategorySuggestions(filtered.slice(0, 10));
    setShowCategorySuggestions(true);
  }, [categorySearch, categories]);

  // Поиск локаций по введенному тексту
  useEffect(() => {
    if (locationSearch.trim() === '') {
      setLocationSuggestions([]);
      setShowLocationSuggestions(false);
      return;
    }

    const allPaths = getAllLocationPaths();
    const filtered = allPaths.filter(path =>
      path.toLowerCase().includes(locationSearch.toLowerCase())
    );
    setLocationSuggestions(filtered.slice(0, 10));
    setShowLocationSuggestions(true);
  }, [locationSearch, locations]);

  // Обработчик выбора категории из подсказок
  const handleCategorySelect = (fullPath: string) => {
    const findCategoryIdByPath = (cats: Category[], pathParts: string[]): number | null => {
      if (pathParts.length === 0) return null;
      
      const currentName = pathParts[0];
      const category = cats.find(cat => cat.name === currentName);
      
      if (!category) return null;
      if (pathParts.length === 1) return category.id;
      
      return findCategoryIdByPath(category.children, pathParts.slice(1));
    };

    const pathParts = fullPath.split('/');
    const categoryId = findCategoryIdByPath(categories, pathParts);
    
    if (categoryId) {
      setFormData(prev => ({ ...prev, category_id: categoryId.toString() }));
      setCategorySearch(fullPath);
    }
    
    setShowCategorySuggestions(false);
  };

  // Обработчик выбора локации из подсказок
  const handleLocationSelect = (fullPath: string) => {
    const findLocationIdByPath = (locs: Location[], pathParts: string[]): number | null => {
      if (pathParts.length === 0) return null;
      
      const currentName = pathParts[0];
      const location = locs.find(loc => loc.name === currentName);
      
      if (!location) return null;
      if (pathParts.length === 1) return location.id;
      
      return findLocationIdByPath(location.children || [], pathParts.slice(1));
    };

    const pathParts = fullPath.split('/');
    const locationId = findLocationIdByPath(locations, pathParts);
    
    if (locationId) {
      setFormData(prev => ({ ...prev, location_id: locationId.toString() }));
      setLocationSearch(fullPath);
    }
    
    setShowLocationSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Данные для отправки:', formData);
    alert('ТМЦ добавлена! (пока в консоль)');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="add-inventory-page">
      <div className="page-header">
        <h1>Добавление ТМЦ</h1>
      </div>

      <form onSubmit={handleSubmit} className="inventory-form">
        <div className="form-section">
          <h2>Основная информация</h2>
          
          <div className="form-group">
            <label htmlFor="item_type">Тип ТМЦ *</label>
            <select
              id="item_type"
              name="item_type"
              value={formData.item_type}
              onChange={handleChange}
              required
            >
              <option value="equipment">Оборудование</option>
              <option value="spare_part">Запчасть</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="category_search">Категория *</label>
            <div className="search-container" ref={categorySearchRef}>
              <input
                type="text"
                id="category_search"
                value={categorySearch}
                onChange={(e) => {
                  setCategorySearch(e.target.value);
                  setShowCategorySuggestions(true);
                }}
                onFocus={() => {
                  if (categorySearch && categorySuggestions.length > 0) {
                    setShowCategorySuggestions(true);
                  }
                }}
                placeholder="Начните вводить название категории..."
                required
              />
              
              {showCategorySuggestions && categorySuggestions.length > 0 && (
                <div className="suggestions-dropdown">
                  {categorySuggestions.map((path, index) => (
                    <div
                      key={index}
                      className="suggestion-item"
                      onClick={() => handleCategorySelect(path)}
                    >
                      {path}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <input
              type="hidden"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
            />
            <div className="help-text">
              Выберите категорию из списка. Формат: Корневая/Дочерняя/Внучатая
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="location_search">Локация</label>
            <div className="search-container" ref={locationSearchRef}>
              <input
                type="text"
                id="location_search"
                value={locationSearch}
                onChange={(e) => {
                  setLocationSearch(e.target.value);
                  setShowLocationSuggestions(true);
                }}
                onFocus={() => {
                  if (locationSearch && locationSuggestions.length > 0) {
                    setShowLocationSuggestions(true);
                  }
                }}
                placeholder="Начните вводить название локации..."
              />
              
              {showLocationSuggestions && locationSuggestions.length > 0 && (
                <div className="suggestions-dropdown">
                  {locationSuggestions.map((path, index) => (
                    <div
                      key={index}
                      className="suggestion-item"
                      onClick={() => handleLocationSelect(path)}
                    >
                      {path}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <input
              type="hidden"
              name="location_id"
              value={formData.location_id}
              onChange={handleChange}
            />
            <div className="help-text">
              Выберите локацию из списка. Формат: Корневая/Дочерняя/Внучатая
            </div>
          </div>

          {formData.item_type === 'spare_part' && (
            <div className="form-group">
              <label htmlFor="parent_item_id">ID родительского оборудования</label>
              <input
                type="number"
                id="parent_item_id"
                name="parent_item_id"
                value={formData.parent_item_id}
                onChange={handleChange}
                placeholder="Введите ID оборудования"
              />
            </div>
          )}
        </div>

        <div className="form-section">
          <h2>Идентификационные данные</h2>
          
          <div className="form-group">
            <label htmlFor="serial_number">Серийный номер</label>
            <input
              type="text"
              id="serial_number"
              name="serial_number"
              value={formData.serial_number}
              onChange={handleChange}
              placeholder="Введите серийный номер"
            />
          </div>

          <div className="form-group">
            <label htmlFor="mac">MAC-адрес</label>
            <input
              type="text"
              id="mac"
              name="mac"
              value={formData.mac}
              onChange={handleChange}
              placeholder="Введите MAC-адрес"
            />
          </div>

          <div className="form-group">
            <label htmlFor="ip_address">IP-адрес</label>
            <input
              type="text"
              id="ip_address"
              name="ip_address"
              value={formData.ip_address}
              onChange={handleChange}
              placeholder="Введите IP-адрес"
            />
          </div>
        </div>

        <div className="form-section">
          <div className="form-group">
            <label htmlFor="description">Описание</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Введите описание ТМЦ"
              rows={4}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            Добавить ТМЦ
          </button>
          <button type="button" className="cancel-btn">
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};

export default InventoryPage;