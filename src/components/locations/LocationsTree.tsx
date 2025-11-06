import React from 'react';
import { Location } from '../../services/api';
import LocationNode from './LocationNode';

interface LocationsTreeProps {
  locations: Location[];
  expandedLocations: Set<number>;
  onToggleLocation: (locationId: number) => void;
  onAddChild: (parentLocation: Location) => void;
  onAddRoot: () => void;
}

const LocationsTree: React.FC<LocationsTreeProps> = ({
  locations,
  expandedLocations,
  onToggleLocation,
  onAddChild,
  onAddRoot
}) => {
  return (
    <div className="locations-tree">
      {locations.map(location => (
        <LocationNode
          key={location.id}
          location={location}
          level={0}
          expandedLocations={expandedLocations}
          onToggleLocation={onToggleLocation}
          onAddChild={onAddChild}
        />
      ))}
      <div className="add-root-in-list">
        <button 
          onClick={onAddRoot}
          className="add-root-in-list-btn"
          title="Добавить корневую локацию"
        >
          <span className="add-icon">+</span>
          Добавить
        </button>
      </div>
    </div>
  );
};

export default LocationsTree;