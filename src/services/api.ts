const host = 'http://localhost:8000'

export interface Location {
  id: number;
  name: string;
  description: string;
  parent_location_id: number | null;
  created_at: string;
  children: Location[];
}

export interface CreateLocationData {
  name: string;
  description: string;
  parent_location_id?: number | null;
}

export const locationsAPI = {
  // Получить все локации с деревом
  getLocations: async (): Promise<Location[]> => {
    const response = await fetch(host + '/location/roots');
    if (!response.ok) {
      throw new Error('Failed to fetch locations');
    }
    return await response.json();
  },

  // Получить локацию по ID
  getLocation: async (id: number): Promise<Location> => {
    const response = await fetch(host + `/location/by_id?id=${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch location');
    }
    return await response.json();
  },

  // Создать новую локацию
  createLocation: async (locationData: CreateLocationData): Promise<Location> => {
    const response = await fetch(host + '/location/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(locationData),
    });
    if (!response.ok) {
      throw new Error('Failed to create location');
    }
    return await response.json();
  },
};


export interface Category {
  id: number;
  name: string;
  description: string;
  parent_category_id: number | null;
  created_at: string;
  children: Category[];
}

export interface CreateCategoryData {
  name: string;
  description: string;
  parent_category_id?: number | null;
}

export const categoriesAPI = {
  // Получить все категории с деревом
  getCategories: async (): Promise<Category[]> => {
    const response = await fetch(host + '/category/roots');
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    return await response.json();
  },

  // Получить локацию по ID
  getCategory: async (id: number): Promise<Category> => {
    const response = await fetch(host + `/category/by_id?id=${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch category');
    }
    return await response.json();
  },

  // Создать новую локацию
  createCategory: async (categoryData: CreateCategoryData): Promise<Category> => {
    const response = await fetch(host + '/category/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoryData),
    });
    if (!response.ok) {
      throw new Error('Failed to create category');
    }
    return await response.json();
  },
};

export interface CreateInventoryItemData {
  category_id: number;
  location_id?: number | null;
  serial_number?: string | null;
  mac?: string | null;
  ip_address?: string | null;
  description?: string | null;
}


export interface InventoryItem {
  id: number;
  category_id: number;
  location_id?: number | null;
  serial_number?: string | null;
  mac?: string | null;
  ip_address?: string | null;
  description?: string | null;
  created_at: string;
  category_name?: string; // Будем добавлять на бэкенде или фронтенде
  location_name?: string; // Будем добавлять на бэкенде или фронтенде
}


export const inventoryItemsApi = {
  createInventoryItem: async (inventoryData: CreateInventoryItemData): Promise<InventoryItem> => {
    const response = await fetch(host + '/inventory_item/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inventoryData),
    });
    if (!response.ok) {
      throw new Error('Failed to create InventoryItem');
    }
    return await response.json();
  },

  getById: async (id: number): Promise<InventoryItem> => {
    const response = await fetch(host + `/inventory_item/by_id?id=${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch InventoryItem');
    }
    return await response.json();
  },

  getInventoryItems: async (offset: number = 0, limit: number = 20): Promise<InventoryItem[]> => {
    const response = await fetch(`${host}/inventory_item/list?offset=${offset}&limit=${limit}`);
    if (!response.ok) {
      throw new Error('Failed to fetch inventory items');
    }
    
    const data = await response.json();
    console.log('Ответ от /list:', data);
    
    return Array.isArray(data) ? data : [];
  },
};