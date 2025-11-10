import React, { useState } from 'react';
import CategorySearch from './CategorySearch';
import LocationSearch from './LocationSearch';
import { InventoryFormData, CreateInventoryItemData } from './types';

interface InventoryFormProps {
  onSubmit: (formData: CreateInventoryItemData) => void;
  loading?: boolean;
}

const InventoryForm: React.FC<InventoryFormProps> = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState<InventoryFormData>({
    category_id: '',
    location_id: '',
    serial_number: '',
    mac: '',
    ip_address: '',
    description: '',
  });

  const [categorySearch, setCategorySearch] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [errors, setErrors] = useState<Partial<InventoryFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<InventoryFormData> = {};

    if (!formData.category_id) {
      newErrors.category_id = 'Наименование обязательно';
    }

    // Валидация MAC-адреса (опционально)
    if (formData.mac && !/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(formData.mac)) {
      newErrors.mac = 'Неверный формат MAC-адреса';
    }

    // Валидация IP-адреса (опционально)
    if (formData.ip_address && !/^(\d{1,3}\.){3}\d{1,3}$/.test(formData.ip_address)) {
      newErrors.ip_address = 'Неверный формат IP-адреса';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Преобразуем данные формы в формат API
    const apiData: CreateInventoryItemData = {
      category_id: parseInt(formData.category_id),
      location_id: formData.location_id ? parseInt(formData.location_id) : null,
      serial_number: formData.serial_number || null,
      mac: formData.mac || null,
      ip_address: formData.ip_address || null,
      description: formData.description || null,
    };

    onSubmit(apiData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Очищаем ошибку при вводе
    if (errors[name as keyof InventoryFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleCategorySelect = (fullPath: string, categoryId: number) => {
    setFormData(prev => ({ ...prev, category_id: categoryId.toString() }));
    setCategorySearch(fullPath);
    
    // Очищаем ошибку категории
    if (errors.category_id) {
      setErrors(prev => ({ ...prev, category_id: '' }));
    }
  };

  const handleLocationSelect = (fullPath: string, locationId: number) => {
    setFormData(prev => ({ ...prev, location_id: locationId.toString() }));
    setLocationSearch(fullPath);
  };

  return (
    <form onSubmit={handleSubmit} className="inventory-form">
      <div className="form-section">
        <h2>Основная информация</h2>
        
        <CategorySearch
          value={categorySearch}
          onChange={setCategorySearch}
          onSelect={handleCategorySelect}
          error={errors.category_id}
          required
        />

        <LocationSearch
          value={locationSearch}
          onChange={setLocationSearch}
          onSelect={handleLocationSelect}
        />
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
            placeholder="Введите MAC-адрес (формат: XX:XX:XX:XX:XX:XX)"
            className={errors.mac ? 'error' : ''}
          />
          {errors.mac && <span className="error-text">{errors.mac}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="ip_address">IP-адрес</label>
          <input
            type="text"
            id="ip_address"
            name="ip_address"
            value={formData.ip_address}
            onChange={handleChange}
            placeholder="Введите IP-адрес (формат: XXX.XXX.XXX.XXX)"
            className={errors.ip_address ? 'error' : ''}
          />
          {errors.ip_address && <span className="error-text">{errors.ip_address}</span>}
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
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Добавление...' : 'Добавить ТМЦ'}
        </button>
        <button type="button" className="cancel-btn">
          Отмена
        </button>
      </div>
    </form>
  );
};

export default InventoryForm;