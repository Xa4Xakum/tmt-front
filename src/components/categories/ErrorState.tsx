import React from 'react';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  return (
    <div className="categories-page">
      <h1>Категории</h1>
      <div className="error">
        <p>Ошибка: {error}</p>
        <button onClick={onRetry} className="retry-btn">
          Попробовать снова
        </button>
      </div>
    </div>
  );
};

export default ErrorState;