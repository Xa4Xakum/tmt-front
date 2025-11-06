import React from 'react';
import { Category } from '../../services/api';
import CategoryNode from './CategoryNode';

interface CategoriesTreeProps {
  categories: Category[];
  expandedCategories: Set<number>;
  onToggleCategory: (categoryId: number) => void;
  onAddChild: (parentLocation: Category) => void;
  onAddRoot: () => void;
}

const CategoriesTree: React.FC<CategoriesTreeProps> = ({
  categories,
  expandedCategories,
  onToggleCategory,
  onAddChild,
  onAddRoot
}) => {
  return (
    <div className="locations-tree">
      {categories.map(category => (
        <CategoryNode
          key={category.id}
          category={category}
          level={0}
          expandedCategories={expandedCategories}
          onToggleCategory={onToggleCategory}
          onAddChild={onAddChild}
        />
      ))}
      <div className="add-root-in-list">
        <button 
          onClick={onAddRoot}
          className="add-root-in-list-btn"
          title="Добавить корневую категорию"
        >
          <span className="add-icon">+</span>
          Добавить
        </button>
      </div>
    </div>
  );
};

export default CategoriesTree;