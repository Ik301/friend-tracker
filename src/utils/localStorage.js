const STORAGE_KEY = 'friendTrackerData';

const DEFAULT_DATA = {
  friends: [],
  categories: [
    {
      id: '1',
      name: 'Close Friends',
      defaultFrequency: { value: 5, unit: 'days' },
      color: '#ef4444'
    },
    {
      id: '2',
      name: 'Friends',
      defaultFrequency: { value: 2, unit: 'weeks' },
      color: '#f59e0b'
    },
    {
      id: '3',
      name: 'Acquaintances',
      defaultFrequency: { value: 1, unit: 'months' },
      color: '#10b981'
    },
    {
      id: '4',
      name: 'Professional',
      defaultFrequency: { value: 2, unit: 'months' },
      color: '#3b82f6'
    },
    {
      id: '5',
      name: 'Family',
      defaultFrequency: { value: 1, unit: 'weeks' },
      color: '#8b5cf6'
    }
  ],
  settings: {
    notificationPreferences: {
      dailyCheck: true,
      weeklyDigest: true,
      importantDateDaysBefore: 3
    },
    lastDigestDate: null
  },
  notifications: []
};

export const loadData = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return DEFAULT_DATA;
    }
    const data = JSON.parse(stored);

    // Validate data structure
    if (!data.friends || !data.categories || !data.settings) {
      console.warn('Invalid data structure, resetting to defaults');
      return DEFAULT_DATA;
    }

    return data;
  } catch (error) {
    console.error('Error loading data from localStorage:', error);
    return DEFAULT_DATA;
  }
};

export const saveData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving data to localStorage:', error);
    return false;
  }
};

export const exportData = () => {
  const data = loadData();
  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `friend-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

export const importData = (jsonString) => {
  try {
    const data = JSON.parse(jsonString);
    if (data.friends && data.categories && data.settings) {
      saveData(data);
      return { success: true };
    }
    return { success: false, error: 'Invalid data format' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const clearAllData = () => {
  localStorage.removeItem(STORAGE_KEY);
};
