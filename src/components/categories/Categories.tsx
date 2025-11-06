import React, { useState, useEffect } from 'react';
import { categoriesAPI, Category, CreateCategoryData } from '../../services/api';
import AddCategoryModal from '../addCategoryModal/AddCategoryModal';
import CategoriesHeader from './CategoriesHeader';
import CategoriesTree from './CategoriesTree';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import EmptyState from './EmptyState';
import './style.css';

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    parentCategory: Category | null;
  }>({
    isOpen: false,
    parentCategory: null
  });

  // Загрузка данных с сервера
  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoriesAPI.getCategories();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки');
      console.error('Ошибка загрузки локаций:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Управление модальным окном
  const openAddModal = (parentCategory: Category | null = null) => {
    setModalState({ isOpen: true, parentCategory });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, parentCategory: null });
  };

  // Сохранение новой локации
  const handleSaveCategory = async (categoryData: CreateCategoryData) => {
    try {
      await categoriesAPI.createCategory(categoryData);
      await loadCategories();
      closeModal();
      
      if (categoryData.parent_category_id) {
        setExpandedCategories(prev => new Set(prev).add(categoryData.parent_category_id!));
      }
    } catch (err) {
      alert('Ошибка при создании локации: ' + (err instanceof Error ? err.message : 'Неизвестная ошибка'));
    }
  };

  // Переключение состояния развернутости
  const toggleCategory = (categoryId: number) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  // Состояние загрузки
  if (loading) return <LoadingState />;

  // Состояние ошибки
  if (error) return <ErrorState error={error} onRetry={loadCategories} />;

  return (
    <div className="categories-page">
      <CategoriesHeader 
        onRefresh={loadCategories}
      />
      
      {categories.length === 0 ? (
        <EmptyState onAddFirst={() => openAddModal()} />
      ) : (
        <CategoriesTree
          categories={categories}
          expandedCategories={expandedCategories}
          onToggleCategory={toggleCategory}
          onAddChild={openAddModal}
          onAddRoot={() => openAddModal()}
        />
      )}

      <AddCategoryModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onSave={handleSaveCategory}
        parentCategory={modalState.parentCategory}
        allCategories={categories}
      />
    </div>
  );
};

export default Categories;