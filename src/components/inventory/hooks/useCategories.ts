import { useState, useEffect, useCallback } from 'react';
import { categoriesAPI } from '../../../services/api';
import { Category } from '../types';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const data = await categoriesAPI.getCategories();
        setCategories(data);
        setError(null);
      } catch (err) {
        setError('Ошибка загрузки категорий');
        console.error('Ошибка загрузки категорий:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  // Функция для построения полного пути категории
  const getCategoryFullPath = useCallback((category: Category, path: string = ''): string[] => {
    const currentPath = path ? `${path}/${category.name}` : category.name;
    const paths = [currentPath];

    if (category.children && category.children.length > 0) {
      category.children.forEach(child => {
        paths.push(...getCategoryFullPath(child, currentPath));
      });
    }

    return paths;
  }, []);

  // Получение всех полных путей категорий
  const getAllCategoryPaths = useCallback((): string[] => {
    const allPaths: string[] = [];
    categories.forEach(category => {
      allPaths.push(...getCategoryFullPath(category));
    });
    return allPaths;
  }, [categories, getCategoryFullPath]);

  // Поиск ID категории по полному пути
  const findCategoryIdByPath = useCallback((fullPath: string): number | null => {
    const pathParts = fullPath.split('/');
    
    const findId = (cats: Category[], parts: string[]): number | null => {
      if (parts.length === 0) return null;
      
      const currentName = parts[0];
      const category = cats.find(cat => cat.name === currentName);
      
      if (!category) return null;
      if (parts.length === 1) return category.id;
      
      return findId(category.children, parts.slice(1));
    };

    return findId(categories, pathParts);
  }, [categories]);

  return {
    categories,
    loading,
    error,
    getAllCategoryPaths,
    findCategoryIdByPath
  };
};