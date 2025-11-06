import React from 'react';
import { Location } from '../../services/api';

interface LocationNodeProps {
  location: Location;
  level: number;
  expandedLocations: Set<number>;
  onToggleLocation: (locationId: number) => void;
  onAddChild: (parentLocation: Location) => void;
}

const LocationNode: React.FC<LocationNodeProps> = ({
  location,
  level,
  expandedLocations,
  onToggleLocation,
  onAddChild
}) => {
  const hasChildren = location.children && location.children.length > 0;
  const isExpanded = expandedLocations.has(location.id);

  return (
    <div className="location-item">
      <div 
        className="location-content"
        style={{ '--level': level } as React.CSSProperties}
      >
        <div className="location-name-container">
          
          {hasChildren && (
            <span 
              className={`expand-icon ${isExpanded ? 'expanded' : ''}`}
              onClick={() => onToggleLocation(location.id)}
            >
              ▶
            </span>
          )}
          {!hasChildren && <span className="expand-icon placeholder">•</span>}
          <span className="location-name" title={location.description}>{location.name}</span>
          
          <button 
            className="add-child-btn"
            onClick={() => onAddChild(location)}
            title="Добавить дочернюю локацию"
          >
            +
          </button>
          
        </div>
      </div>
      
      {hasChildren && isExpanded && (
        <div className="location-children">
          {location.children.map(child => (
            <LocationNode
              key={child.id}
              location={child}
              level={level + 1}
              expandedLocations={expandedLocations}
              onToggleLocation={onToggleLocation}
              onAddChild={onAddChild}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationNode;