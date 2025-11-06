import React from 'react';
import { Category } from '../../services/api';

interface CategoryNodeProps {
  category: Category;
  level: number;
  expandedCategories: Set<number>;
  onToggleCategory: (locationId: number) => void;
  onAddChild: (parentLocation: Category) => void;
}

const CategoryNode: React.FC<CategoryNodeProps> = ({
  category,
  level,
  expandedCategories,
  onToggleCategory,
  onAddChild
}) => {
  const hasChildren = category.children && category.children.length > 0;
  const isExpanded = expandedCategories.has(category.id);

  return (
    <div className="category-item">
      <div 
        className="category-content"
        style={{ '--level': level } as React.CSSProperties}
      >
        <div className="category-name-container">
          
          {hasChildren && (
            <span 
              className={`expand-icon ${isExpanded ? 'expanded' : ''}`}
              onClick={() => onToggleCategory(category.id)}
            >
              ▶
            </span>
          )}
          {!hasChildren && <span className="expand-icon placeholder">•</span>}
          <span className="category-name" title={category.description}>{category.name}</span>
          
          <button 
            className="add-child-btn"
            onClick={() => onAddChild(category)}
            title="Добавить дочернюю локацию"
          >
            +
          </button>
          
        </div>
      </div>
      
      {hasChildren && isExpanded && (
        <div className="category-children">
          {category.children.map(child => (
            <CategoryNode
              key={child.id}
              category={child}
              level={level + 1}
              expandedCategories={expandedCategories}
              onToggleCategory={onToggleCategory}
              onAddChild={onAddChild}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryNode;