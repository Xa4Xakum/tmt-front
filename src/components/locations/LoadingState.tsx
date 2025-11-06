import React from 'react';

const LoadingState: React.FC = () => {
  return (
    <div className="locations-page">
      <h1>Локации</h1>
      <div className="loading">Загрузка локаций...</div>
    </div>
  );
};

export default LoadingState;