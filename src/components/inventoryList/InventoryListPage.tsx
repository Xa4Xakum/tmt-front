import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { inventoryItemsApi, InventoryItem } from '../../services/api';
import { useColumnResize } from './hooks/useColumnResize';
import './style.css';

const InventoryListPage: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 20;

  const { columnWidths, isResizing, startResize, resetWidths } = useColumnResize();

  useEffect(() => {
    loadInventoryItems();
  }, [offset]);

  const loadInventoryItems = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const responseItems = await inventoryItemsApi.getInventoryItems(offset, limit);
      setItems(prev => offset === 0 ? responseItems : [...prev, ...responseItems]);
      setHasMore(responseItems.length === limit);
    } catch (err) {
      console.error('Ошибка загрузки:', err);
      setError('Ошибка загрузки списка ТМЦ');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setOffset(0);
  };

  const handleLoadMore = () => {
    setOffset(prev => prev + limit);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту ТМЦ?')) {
      return;
    }

    try {
      // TODO: Добавить метод delete в API когда будет готов
      // await inventoryItemsApi.deleteInventoryItem(id);
      setItems(prev => prev.filter(item => item.id !== id));
      alert('ТМЦ удалена (в реальном приложении будет вызов API)');
    } catch (err) {
      setError('Ошибка удаления ТМЦ');
      console.error('Ошибка удаления:', err);
    }
  };

  if (loading && items.length === 0) {
    return (
      <div className="inventory-list-page">
        <div className="page-header">
          <h1>Список ТМЦ</h1>
          <div className="loading">Загрузка...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="inventory-list-page">
      <div className="page-header">
        <div className="header-top">
          <h1>Список ТМЦ</h1>
          <div className="header-actions">
            <button onClick={resetWidths} className="reset-widths-button" title="Сбросить ширину колонок">
              📏 Сбросить ширину
            </button>
            <button onClick={handleRefresh} className="refresh-button" disabled={loading}>
              Обновить
            </button>
            <Link to="/inventory/add" className="add-button">
              + Добавить ТМЦ
            </Link>
          </div>
        </div>

        <div className="stats">
          Всего записей: {items.length}
          {hasMore && ' (есть еще)'}
          {isResizing && ' • Ресайз...'}
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
          <button onClick={handleRefresh} className="retry-button">
            Повторить
          </button>
        </div>
      )}

      {items.length === 0 && !loading ? (
        <div className="empty-state">
          <h3>ТМЦ не найдены</h3>
          <p>Начните с добавления новой ТМЦ</p>
          <Link to="/inventory/add" className="add-button primary">
            Добавить первую ТМЦ
          </Link>
        </div>
      ) : (
        <>
        <div className="table-wrapper">
        <div className="inventory-table-container">
            <table className="inventory-table">
            <thead>
                <tr>
                <th style={{ width: columnWidths.id }}>
                    <div className="column-header">
                    <span>ID</span>
                    <div 
                        className="resize-handle"
                        onMouseDown={(e) => startResize('id', e)}
                        title="Перетащите для изменения ширины"
                    />
                    </div>
                </th>
                <th style={{ width: columnWidths.category_id }}>
                    <div className="column-header">
                    <span>ID Категории</span>
                    <div 
                        className="resize-handle"
                        onMouseDown={(e) => startResize('category_id', e)}
                        title="Перетащите для изменения ширины"
                    />
                    </div>
                </th>
                <th style={{ width: columnWidths.location_id }}>
                    <div className="column-header">
                    <span>ID Локации</span>
                    <div 
                        className="resize-handle"
                        onMouseDown={(e) => startResize('location_id', e)}
                        title="Перетащите для изменения ширины"
                    />
                    </div>
                </th>
                <th style={{ width: columnWidths.serial_number }}>
                    <div className="column-header">
                    <span>Серийный номер</span>
                    <div 
                        className="resize-handle"
                        onMouseDown={(e) => startResize('serial_number', e)}
                        title="Перетащите для изменения ширины"
                    />
                    </div>
                </th>
                <th style={{ width: columnWidths.mac }}>
                    <div className="column-header">
                    <span>MAC-адрес</span>
                    <div 
                        className="resize-handle"
                        onMouseDown={(e) => startResize('mac', e)}
                        title="Перетащите для изменения ширины"
                    />
                    </div>
                </th>
                <th style={{ width: columnWidths.ip_address }}>
                    <div className="column-header">
                    <span>IP-адрес</span>
                    <div 
                        className="resize-handle"
                        onMouseDown={(e) => startResize('ip_address', e)}
                        title="Перетащите для изменения ширины"
                    />
                    </div>
                </th>
                <th style={{ width: columnWidths.description }}>
                    <div className="column-header">
                    <span>Описание</span>
                    <div 
                        className="resize-handle"
                        onMouseDown={(e) => startResize('description', e)}
                        title="Перетащите для изменения ширины"
                    />
                    </div>
                </th>
                <th style={{ width: columnWidths.created_at }}>
                    <div className="column-header">
                    <span>Дата создания</span>
                    <div 
                        className="resize-handle"
                        onMouseDown={(e) => startResize('created_at', e)}
                        title="Перетащите для изменения ширины"
                    />
                    </div>
                </th>
                <th style={{ width: columnWidths.actions }}>
                    <div className="column-header">
                    <span>Действия</span>
                    <div 
                        className="resize-handle"
                        onMouseDown={(e) => startResize('actions', e)}
                        title="Перетащите для изменения ширины"
                    />
                    </div>
                </th>
                </tr>
            </thead>
            <tbody>
                {items.map((item) => (
                <tr key={item.id}>
                    <td className="id-cell">{item.id}</td>
                    <td>{item.category_id}</td>
                    <td>{item.location_id || '—'}</td>
                    <td className="serial-cell">{item.serial_number || '—'}</td>
                    <td className="mac-cell">{item.mac || '—'}</td>
                    <td className="ip-cell">{item.ip_address || '—'}</td>
                    <td className="description-cell">
                    {item.description ? (
                        <span title={item.description}>
                        {item.description.length > 50 
                            ? `${item.description.substring(0, 50)}...` 
                            : item.description
                        }
                        </span>
                    ) : '—'}
                    </td>
                    <td className="date-cell">{formatDate(item.created_at)}</td>
                    <td className="actions-cell">
                    <Link 
                        to={`/inventory/${item.id}`} 
                        className="action-button view"
                        title="Просмотреть детали"
                    >
                        👁️
                    </Link>
                    <Link 
                        to={`/inventory/edit/${item.id}`} 
                        className="action-button edit"
                        title="Редактировать"
                    >
                        ✏️
                    </Link>
                    <button 
                        onClick={() => handleDelete(item.id)}
                        className="action-button delete"
                        title="Удалить"
                    >
                        🗑️
                    </button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        </div>

          {hasMore && (
            <div className="load-more-section">
              <button 
                onClick={handleLoadMore}
                disabled={loading}
                className="load-more-button"
              >
                {loading ? 'Загрузка...' : 'Загрузить еще'}
              </button>
            </div>
          )}

          {loading && items.length > 0 && (
            <div className="loading-more">Загрузка дополнительных записей...</div>
          )}
        </>
      )}
    </div>
  );
};

export default InventoryListPage;