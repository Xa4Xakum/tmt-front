import { CreateInventoryItemData, InventoryItem, Location, Category } from '../../services/api';

// Переиспользуем типы из API
export type { CreateInventoryItemData, InventoryItem, Location, Category };

// Дополнительные типы для формы
export interface InventoryFormData {
  category_id: string;  // В форме это string, потом преобразуем в number
  location_id: string;
  serial_number: string;
  mac: string;
  ip_address: string;
  description: string;
}

export interface InventoryFormProps {
  onSubmit: (formData: CreateInventoryItemData) => void;
  loading?: boolean;
}