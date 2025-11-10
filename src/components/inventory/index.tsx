import React, { useState } from 'react';
import { inventoryItemsApi, CreateInventoryItemData } from '../../services/api';
import InventoryForm from './InventoryForm';
import './style.css';

const InventoryPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (formData: CreateInventoryItemData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSuccessMessage(null);

    try {
      console.log('Отправка данных:', formData);
      
      const createdItem = await inventoryItemsApi.createInventoryItem(formData);
      
      console.log('ТМЦ создана:', createdItem);
      setSuccessMessage(`ТМЦ успешно добавлена! ID: ${createdItem.id}`);
      
      // Очищаем форму через 3 секунды
      setTimeout(() => {
        setSuccessMessage(null);
        // Здесь можно добавить сброс формы если нужно
      }, 3000);

    } catch (error) {
      console.error('Ошибка при добавлении ТМЦ:', error);
      setSubmitError('Ошибка при добавлении ТМЦ. Проверьте данные и попробуйте снова.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-inventory-page">
      <div className="page-header">
        <h1>Добавление ТМЦ</h1>
      </div>

      {submitError && (
        <div className="alert alert-error">
          {submitError}
        </div>
      )}

      {successMessage && (
        <div className="alert alert-success">
          {successMessage}
        </div>
      )}

      <InventoryForm onSubmit={handleSubmit} loading={isSubmitting} />
    </div>
  );
};

export default InventoryPage;