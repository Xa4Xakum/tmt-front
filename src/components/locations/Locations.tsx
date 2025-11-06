import React, { useState, useEffect } from 'react';
import { locationsAPI, Location, CreateLocationData } from '../../services/api';
import AddLocationModal from '../addLocationModal/AddLocationModal';
import LocationsHeader from './LocationsHeader';
import LocationsTree from './LocationsTree';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import EmptyState from './EmptyState';
import './style.css';

const Locations: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedLocations, setExpandedLocations] = useState<Set<number>>(new Set());
  
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    parentLocation: Location | null;
  }>({
    isOpen: false,
    parentLocation: null
  });

  // Загрузка данных с сервера
  const loadLocations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await locationsAPI.getLocations();
      setLocations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки');
      console.error('Ошибка загрузки локаций:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLocations();
  }, []);

  // Управление модальным окном
  const openAddModal = (parentLocation: Location | null = null) => {
    setModalState({ isOpen: true, parentLocation });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, parentLocation: null });
  };

  // Сохранение новой локации
  const handleSaveLocation = async (locationData: CreateLocationData) => {
    try {
      await locationsAPI.createLocation(locationData);
      await loadLocations();
      closeModal();
      
      if (locationData.parent_location_id) {
        setExpandedLocations(prev => new Set(prev).add(locationData.parent_location_id!));
      }
    } catch (err) {
      alert('Ошибка при создании локации: ' + (err instanceof Error ? err.message : 'Неизвестная ошибка'));
    }
  };

  // Переключение состояния развернутости
  const toggleLocation = (locationId: number) => {
    setExpandedLocations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(locationId)) {
        newSet.delete(locationId);
      } else {
        newSet.add(locationId);
      }
      return newSet;
    });
  };

  // Состояние загрузки
  if (loading) return <LoadingState />;

  // Состояние ошибки
  if (error) return <ErrorState error={error} onRetry={loadLocations} />;

  return (
    <div className="locations-page">
      <LocationsHeader 
        onRefresh={loadLocations}
      />
      
      {locations.length === 0 ? (
        <EmptyState onAddFirst={() => openAddModal()} />
      ) : (
        <LocationsTree
          locations={locations}
          expandedLocations={expandedLocations}
          onToggleLocation={toggleLocation}
          onAddChild={openAddModal}
          onAddRoot={() => openAddModal()}
        />
      )}

      <AddLocationModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onSave={handleSaveLocation}
        parentLocation={modalState.parentLocation}
        allLocations={locations}
      />
    </div>
  );
};

export default Locations;