import { createContext, useContext, useState, useEffect } from 'react';
import { loadData, saveData } from '../utils/localStorage';
import { generateUniqueId, calculateNextContactDue } from '../utils/dateHelpers';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [data, setData] = useState(loadData());

  useEffect(() => {
    saveData(data);
  }, [data]);

  // Friend operations
  const addFriend = (friendData) => {
    const newFriend = {
      ...friendData,
      id: generateUniqueId(),
      lastContacted: friendData.lastContacted || new Date().toISOString(),
      contactHistory: [{
        id: generateUniqueId(),
        date: friendData.lastContacted || new Date().toISOString(),
        notes: 'Friend added'
      }]
    };

    setData(prev => ({
      ...prev,
      friends: [...prev.friends, newFriend]
    }));

    return newFriend;
  };

  const updateFriend = (friendId, updates) => {
    setData(prev => ({
      ...prev,
      friends: prev.friends.map(friend =>
        friend.id === friendId ? { ...friend, ...updates } : friend
      )
    }));
  };

  const deleteFriend = (friendId) => {
    setData(prev => ({
      ...prev,
      friends: prev.friends.filter(friend => friend.id !== friendId)
    }));
  };

  const logContact = (friendId, notes = '') => {
    const contactDate = new Date().toISOString();

    setData(prev => ({
      ...prev,
      friends: prev.friends.map(friend => {
        if (friend.id !== friendId) return friend;

        const newHistory = [
          ...(friend.contactHistory || []),
          {
            id: generateUniqueId(),
            date: contactDate,
            notes
          }
        ];

        return {
          ...friend,
          lastContacted: contactDate,
          contactHistory: newHistory
        };
      })
    }));
  };

  // Category operations
  const addCategory = (categoryData) => {
    const newCategory = {
      ...categoryData,
      id: generateUniqueId()
    };

    setData(prev => ({
      ...prev,
      categories: [...prev.categories, newCategory]
    }));

    return newCategory;
  };

  const updateCategory = (categoryId, updates) => {
    setData(prev => ({
      ...prev,
      categories: prev.categories.map(cat =>
        cat.id === categoryId ? { ...cat, ...updates } : cat
      )
    }));
  };

  const deleteCategory = (categoryId) => {
    setData(prev => ({
      ...prev,
      categories: prev.categories.filter(cat => cat.id !== categoryId),
      friends: prev.friends.map(friend => ({
        ...friend,
        categories: friend.categories?.filter(catId => catId !== categoryId) || []
      }))
    }));
  };

  // Important date operations
  const addImportantDate = (friendId, dateData) => {
    setData(prev => ({
      ...prev,
      friends: prev.friends.map(friend => {
        if (friend.id !== friendId) return friend;

        const newDate = {
          ...dateData,
          id: generateUniqueId()
        };

        return {
          ...friend,
          importantDates: [...(friend.importantDates || []), newDate]
        };
      })
    }));
  };

  const updateImportantDate = (friendId, dateId, updates) => {
    setData(prev => ({
      ...prev,
      friends: prev.friends.map(friend => {
        if (friend.id !== friendId) return friend;

        return {
          ...friend,
          importantDates: friend.importantDates?.map(date =>
            date.id === dateId ? { ...date, ...updates } : date
          )
        };
      })
    }));
  };

  const deleteImportantDate = (friendId, dateId) => {
    setData(prev => ({
      ...prev,
      friends: prev.friends.map(friend => {
        if (friend.id !== friendId) return friend;

        return {
          ...friend,
          importantDates: friend.importantDates?.filter(date => date.id !== dateId)
        };
      })
    }));
  };

  // Notification operations
  const addNotification = (notification) => {
    const newNotification = {
      ...notification,
      id: generateUniqueId(),
      createdAt: new Date().toISOString(),
      read: false
    };

    setData(prev => ({
      ...prev,
      notifications: [...prev.notifications, newNotification]
    }));
  };

  const markNotificationRead = (notificationId) => {
    setData(prev => ({
      ...prev,
      notifications: prev.notifications.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    }));
  };

  const dismissNotification = (notificationId) => {
    setData(prev => ({
      ...prev,
      notifications: prev.notifications.filter(notif => notif.id !== notificationId)
    }));
  };

  const clearAllNotifications = () => {
    setData(prev => ({
      ...prev,
      notifications: []
    }));
  };

  // Settings operations
  const updateSettings = (updates) => {
    setData(prev => ({
      ...prev,
      settings: { ...prev.settings, ...updates }
    }));
  };

  const value = {
    friends: data.friends,
    categories: data.categories,
    settings: data.settings,
    notifications: data.notifications,
    addFriend,
    updateFriend,
    deleteFriend,
    logContact,
    addCategory,
    updateCategory,
    deleteCategory,
    addImportantDate,
    updateImportantDate,
    deleteImportantDate,
    addNotification,
    markNotificationRead,
    dismissNotification,
    clearAllNotifications,
    updateSettings
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
