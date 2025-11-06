import React from 'react';

interface LocationsHeaderProps {
  onRefresh: () => void;
}

const LocationsHeader: React.FC<LocationsHeaderProps> = ({ 
  onRefresh 
}) => {
  return (
    <div className="locations-header">
      <h1>Локации</h1>
      <button 
        onClick={onRefresh}
        className="refresh-icon-btn"
        title="Обновить"
      >
        ⟳
      </button>
    </div>
  );
};

export default LocationsHeader;