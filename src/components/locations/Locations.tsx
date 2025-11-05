import React from 'react';
import './style.css';

interface Location {
  id: number;
  name: string;
  description: string;
  parent_location_id: number | null;
  created_at: string;
  children: Location[];
}

interface LocationsPageProps {
  locations: Location[];
}

const LocationsPage: React.FC<LocationsPageProps> = ({ locations }) => {
  const LocationTree: React.FC<{ location: Location; level: number }> = ({ location, level }) => {
    const hasChildren = location.children && location.children.length > 0;
    
    return (
      <div className="location-item">
        <div 
          className="location-content"
          style={{ 
            '--level': level  // Передаем уровень как CSS переменную
          } as React.CSSProperties}
        >
          <div className="location-name-container">
            <span className="location-name">{location.name}</span>
            {hasChildren && <span className="expand-icon">▶</span>}
          </div>
        </div>
        
        {hasChildren && (
          <div className="location-children">
            {location.children.map(child => (
              <LocationTree 
                key={child.id} 
                location={child} 
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="locations-page">
      <h1>Локации</h1>
      <div className="locations-tree">
        {locations.map(location => (
          <LocationTree 
            key={location.id} 
            location={location} 
            level={0}
          />
        ))}
      </div>
    </div>
  );
};

export default LocationsPage;