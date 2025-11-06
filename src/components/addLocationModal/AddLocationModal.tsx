import React, { useState, useEffect } from 'react';
import { Location, CreateLocationData } from '../../services/api';
import './style.css';

interface AddLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (locationData: CreateLocationData) => void;
  parentLocation?: Location | null;
  allLocations: Location[];
}

const AddLocationModal: React.FC<AddLocationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  parentLocation,
  allLocations
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null);

  // Сбрасываем форму при открытии
  useEffect(() => {
    if (isOpen) {
      setName('');
      setDescription('');
      setSelectedParentId(parentLocation?.id || null);
    }
  }, [isOpen, parentLocation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert('Введите название локации');
      return;
    }

    onSave({
      name: name.trim(),
      description: description.trim(),
      parent_location_id: selectedParentId
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
            {parentLocation 
              ? `Добавить дочернюю локацию для "${parentLocation.name}"`
              : 'Добавить корневую локацию'
            }
          </h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="location-form">
          <div className="form-group">
            <label htmlFor="name">Название локации *</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Введите название локации"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Описание</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Введите описание локации"
              rows={3}
            />
          </div>

          {!parentLocation && (
            <div className="form-group">
              <label htmlFor="parent">Родительская локация</label>
              <select
                id="parent"
                value={selectedParentId || ''}
                onChange={(e) => setSelectedParentId(e.target.value ? Number(e.target.value) : null)}
              >
                <option value="">-- Без родителя (корневая) --</option>
                {allLocations.map(location => (
                  <option key={location.id} value={location.id}>
                    {location.name}
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

export default AddLocationModal;