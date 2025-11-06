import React, { useState, useEffect } from 'react';
import { Category, CreateCategoryData } from '../../services/api';
import './style.css';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (categoryData: CreateCategoryData) => void;
  parentCategory?: Category | null;
  allCategories: Category[];
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  parentCategory,
  allCategories
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null);

  // Сбрасываем форму при открытии
  useEffect(() => {
    if (isOpen) {
      setName('');
      setDescription('');
      setSelectedParentId(parentCategory?.id || null);
    }
  }, [isOpen, parentCategory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert('Введите название категории');
      return;
    }

    onSave({
      name: name.trim(),
      description: description.trim(),
      parent_category_id: selectedParentId
    });
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>
            {parentCategory 
              ? `Добавить дочернюю категорию для "${parentCategory.name}"`
              : 'Добавить корневую категорию'
            }
          </h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="category-form">
          <div className="form-group">
            <label htmlFor="name">Название категории *</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Введите название категории"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Описание</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Введите описание категории"
              rows={3}
            />
          </div>

          {!parentCategory && (
            <div className="form-group">
              <label htmlFor="parent">Родительская категория</label>
              <select
                id="parent"
                value={selectedParentId || ''}
                onChange={(e) => setSelectedParentId(e.target.value ? Number(e.target.value) : null)}
              >
                <option value="">-- Без родителя (корневая) --</option>
                {allCategories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Отмена
            </button>
            <button type="submit" className="save-btn">
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryModal;