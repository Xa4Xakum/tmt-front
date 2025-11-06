import React from 'react';

interface EmptyStateProps {
  onAddFirst: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onAddFirst }) => {
  return (
    <div className="empty-state">
      <p>Нет локаций.</p>
      <button onClick={onAddFirst} className="add-first-btn">
        Создать первую локацию
      </button>
    </div>
  );
};

export default EmptyState;