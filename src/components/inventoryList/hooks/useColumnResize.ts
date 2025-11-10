import { useState, useRef, useCallback, useEffect } from 'react';

interface ColumnWidths {
  [key: string]: number;
}

const defaultWidths = {
  id: 80,
  category_id: 120,
  location_id: 120,
  serial_number: 150,
  mac: 150,
  ip_address: 120,
  description: 200,
  created_at: 180,
  actions: 150
};

export const useColumnResize = () => {
  const [columnWidths, setColumnWidths] = useState<ColumnWidths>(() => {
    const saved = localStorage.getItem('inventory-column-widths');
    return saved ? { ...defaultWidths, ...JSON.parse(saved) } : defaultWidths;
  });
  const [isResizing, setIsResizing] = useState(false);
  const [resizingColumn, setResizingColumn] = useState<string | null>(null);
  const resizingRef = useRef<{ column: string; startX: number; startWidth: number } | null>(null);

  // Сохраняем ширину в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('inventory-column-widths', JSON.stringify(columnWidths));
  }, [columnWidths]);

  const startResize = useCallback((column: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    const th = event.currentTarget.parentElement as HTMLTableCellElement;
    const startWidth = th.offsetWidth;
    const startX = event.clientX;

    resizingRef.current = { column, startX, startWidth };
    setIsResizing(true);
    setResizingColumn(column);

    // Добавляем класс к body для глобального курсора
    document.body.classList.add('resizing');
    document.body.style.userSelect = 'none';

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!resizingRef.current) return;

      const delta = moveEvent.clientX - resizingRef.current.startX;
      const newWidth = Math.max(50, resizingRef.current.startWidth + delta);

      setColumnWidths(prev => ({
        ...prev,
        [column]: newWidth
      }));
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.classList.remove('resizing');
      document.body.style.userSelect = '';
      resizingRef.current = null;
      setIsResizing(false);
      setResizingColumn(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, []);

  const resetWidths = useCallback(() => {
    setColumnWidths(defaultWidths);
    localStorage.removeItem('inventory-column-widths');
  }, []);

  return {
    columnWidths,
    isResizing,
    resizingColumn,
    startResize,
    resetWidths
  };
};