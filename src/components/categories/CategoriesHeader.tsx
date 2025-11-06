import React from 'react';

interface CategoriesHeaderProps {
  onRefresh: () => void;
}

const CategoriesHeader: React.FC<CategoriesHeaderProps> = ({ 
  onRefresh 
}) => {
  return (
    <div className="categories-header">
      <h1>Категории</h1>
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

export default CategoriesHeader;