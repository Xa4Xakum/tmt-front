import { useState, useEffect, useCallback } from 'react';
import { locationsAPI } from '../../../services/api';
import { Location } from '../types';

export const useLocations = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLocations = async () => {
      try {
        setLoading(true);
        const data = await locationsAPI.getLocations();
        setLocations(data);
        setError(null);
      } catch (err) {
        setError('Ошибка загрузки локаций');
        console.error('Ошибка загрузки локаций:', err);
      } finally {
        setLoading(false);
      }
    };

    loadLocations();
  }, []);

  // Функция для построения полного пути локации
  const getLocationFullPath = useCallback((location: Location, path: string = ''): string[] => {
    const currentPath = path ? `${path}/${location.name}` : location.name;
    const paths = [currentPath];

    if (location.children && location.children.length > 0) {
      location.children.forEach(child => {
        paths.push(...getLocationFullPath(child, currentPath));
      });
    }

    return paths;
  }, []);

  // Получение всех полных путей локаций
  const getAllLocationPaths = useCallback((): string[] => {
    const allPaths: string[] = [];
    locations.forEach(location => {
      allPaths.push(...getLocationFullPath(location));
    });
    return allPaths;
  }, [locations, getLocationFullPath]);

  // Поиск ID локации по полному пути
  const findLocationIdByPath = useCallback((fullPath: string): number | null => {
    const pathParts = fullPath.split('/');
    
    const findId = (locs: Location[], parts: string[]): number | null => {
      if (parts.length === 0) return null;
      
      const currentName = parts[0];
      const location = locs.find(loc => loc.name === currentName);
      
      if (!location) return null;
      if (parts.length === 1) return location.id;
      
      return findId(location.children || [], parts.slice(1));
    };

    return findId(locations, pathParts);
  }, [locations]);

  return {
    locations,
    loading,
    error,
    getAllLocationPaths,
    findLocationIdByPath
  };
};