import React from 'react';

const LoadingState: React.FC = () => {
  return (
    <div className="categories-page">
      <h1>Категории</h1>
      <div className="loading">Загрузка категорий...</div>
    </div>
  );
};

export default LoadingState;