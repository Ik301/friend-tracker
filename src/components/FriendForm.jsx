import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { generateUniqueId } from '../utils/dateHelpers';

const FriendForm = ({ friend = null, onClose, onSuccess }) => {
  const { categories, addFriend, updateFriend } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    lastContacted: new Date().toISOString().split('T')[0],
    contactFrequency: { value: 1, unit: 'weeks' },
    categories: [],
    notes: '',
    importantDates: []
  });

  useEffect(() => {
    if (friend) {
      setFormData({
        name: friend.name || '',
        contact: friend.contact || '',
        lastContacted: friend.lastContacted ? friend.lastContacted.split('T')[0] : new Date().toISOString().split('T')[0],
        contactFrequency: friend.contactFrequency || { value: 1, unit: 'weeks' },
        categories: friend.categories || [],
        notes: friend.notes || '',
        importantDates: friend.importantDates || []
      });
    }
  }, [friend]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const friendData = {
      ...formData,
      lastContacted: new Date(formData.lastContacted).toISOString()
    };

    if (friend) {
      updateFriend(friend.id, friendData);
    } else {
      addFriend(friendData);
    }

    onSuccess?.();
    onClose();
  };

  const handleCategoryToggle = (categoryId) => {
    setFormData(prev => {
      const isSelected = prev.categories.includes(categoryId);

      if (isSelected) {
        return {
          ...prev,
          categories: prev.categories.filter(id => id !== categoryId)
        };
      } else {
        // If this is the first category, suggest its default frequency
        if (prev.categories.length === 0) {
          const category = categories.find(c => c.id === categoryId);
          if (category) {
            return {
              ...prev,
              categories: [...prev.categories, categoryId],
              contactFrequency: category.defaultFrequency
            };
          }
        }
        return {
          ...prev,
          categories: [...prev.categories, categoryId]
        };
      }
    });
  };

  const addImportantDate = () => {
    setFormData(prev => ({
      ...prev,
      importantDates: [
        ...prev.importantDates,
        {
          id: generateUniqueId(),
          title: '',
          date: '',
          type: 'one-time',
          notificationDaysBefore: 3,
          notes: ''
        }
      ]
    }));
  };

  const updateImportantDate = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      importantDates: prev.importantDates.map((date, i) =>
        i === index ? { ...date, [field]: value } : date
      )
    }));
  };

  const removeImportantDate = (index) => {
    setFormData(prev => ({
      ...prev,
      importantDates: prev.importantDates.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 bg-[#2d1810]/95 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#3d241a] border border-[#774936] rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#edc4b3]">
              {friend ? 'Edit Friend' : 'Add New Friend'}
            </h2>
            <button
              onClick={onClose}
              className="text-[#b07d62] hover:text-[#edc4b3] text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#edc4b3] mb-1">
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-[#2d1810] text-[#edc4b3] border border-[#8a5a44] rounded-lg focus:ring-2 focus:ring-white/20 focus:border-white/30"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#edc4b3] mb-1">
                Contact Info *
              </label>
              <input
                type="text"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                placeholder="Phone, email, or social media handle"
                className="w-full px-3 py-2 bg-[#2d1810] text-[#edc4b3] border border-[#8a5a44] rounded-lg focus:ring-2 focus:ring-white/20 focus:border-white/30"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#edc4b3] mb-1">
                Last Contacted
              </label>
              <input
                type="date"
                value={formData.lastContacted}
                onChange={(e) => setFormData({ ...formData, lastContacted: e.target.value })}
                className="w-full px-3 py-2 bg-[#2d1810] text-[#edc4b3] border border-[#8a5a44] rounded-lg focus:ring-2 focus:ring-white/20 focus:border-white/30"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#edc4b3] mb-2">
                Categories
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => handleCategoryToggle(category.id)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      formData.categories.includes(category.id)
                        ? 'border-gray-800 text-[#edc4b3]'
                        : 'border-[#8a5a44] text-[#edc4b3] hover:border-gray-400'
                    }`}
                    style={{
                      backgroundColor: formData.categories.includes(category.id) ? category.color : 'white'
                    }}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#edc4b3] mb-1">
                  Contact Every
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.contactFrequency.value}
                  onChange={(e) => setFormData({
                    ...formData,
                    contactFrequency: {
                      ...formData.contactFrequency,
                      value: parseInt(e.target.value)
                    }
                  })}
                  className="w-full px-3 py-2 bg-[#2d1810] text-[#edc4b3] border border-[#8a5a44] rounded-lg focus:ring-2 focus:ring-white/20 focus:border-white/30"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#edc4b3] mb-1">
                  Unit
                </label>
                <select
                  value={formData.contactFrequency.unit}
                  onChange={(e) => setFormData({
                    ...formData,
                    contactFrequency: {
                      ...formData.contactFrequency,
                      unit: e.target.value
                    }
                  })}
                  className="w-full px-3 py-2 bg-[#2d1810] text-[#edc4b3] border border-[#8a5a44] rounded-lg focus:ring-2 focus:ring-white/20 focus:border-white/30"
                >
                  <option value="days">Days</option>
                  <option value="weeks">Weeks</option>
                  <option value="months">Months</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#edc4b3] mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="What did you talk about last time?"
                rows="3"
                className="w-full px-3 py-2 bg-[#2d1810] text-[#edc4b3] border border-[#8a5a44] rounded-lg focus:ring-2 focus:ring-white/20 focus:border-white/30"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-[#edc4b3]">
                  Important Dates
                </label>
                <button
                  type="button"
                  onClick={addImportantDate}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  + Add Date
                </button>
              </div>

              <div className="space-y-3">
                {formData.importantDates.map((date, index) => (
                  <div key={date.id} className="p-3 border border-[#774936] rounded-lg">
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <input
                        type="text"
                        value={date.title}
                        onChange={(e) => updateImportantDate(index, 'title', e.target.value)}
                        placeholder="Event name"
                        className="px-2 py-1 border border-[#8a5a44] rounded text-sm"
                      />
                      <input
                        type="date"
                        value={date.date}
                        onChange={(e) => updateImportantDate(index, 'date', e.target.value)}
                        className="px-2 py-1 border border-[#8a5a44] rounded text-sm"
                      />
                    </div>
                    <div className="flex gap-2 items-center">
                      <select
                        value={date.type}
                        onChange={(e) => updateImportantDate(index, 'type', e.target.value)}
                        className="px-2 py-1 border border-[#8a5a44] rounded text-sm flex-1"
                      >
                        <option value="one-time">One-time</option>
                        <option value="recurring">Recurring</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => removeImportantDate(index)}
                        className="text-red-600 hover:text-red-800 text-sm px-2"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-[#c38e70] hover:bg-[#b07d62] text-[#2d1810] text-[#edc4b3] px-6 py-3 rounded-lg transition-colors font-medium"
              >
                {friend ? 'Update Friend' : 'Add Friend'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-[#222222] hover:bg-gray-300 text-[#edc4b3] rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FriendForm;
