import { useState } from 'react';
import { useApp } from '../context/AppContext';

const CategoryManager = () => {
  const { categories, addCategory, updateCategory, deleteCategory, friends } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    defaultFrequency: { value: 1, unit: 'weeks' },
    color: '#3b82f6'
  });

  const resetForm = () => {
    setFormData({
      name: '',
      defaultFrequency: { value: 1, unit: 'weeks' },
      color: '#3b82f6'
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateCategory(editingId, formData);
    } else {
      addCategory(formData);
    }
    resetForm();
  };

  const handleEdit = (category) => {
    setFormData({
      name: category.name,
      defaultFrequency: category.defaultFrequency,
      color: category.color
    });
    setEditingId(category.id);
    setIsAdding(true);
  };

  const handleDelete = (categoryId) => {
    const friendsInCategory = friends.filter(f => f.categories?.includes(categoryId));
    if (friendsInCategory.length > 0) {
      if (!window.confirm(`${friendsInCategory.length} friend(s) are in this category. Are you sure you want to delete it?`)) {
        return;
      }
    }
    deleteCategory(categoryId);
  };

  const colorOptions = [
    { name: 'Red', value: '#ef4444' },
    { name: 'Orange', value: '#f59e0b' },
    { name: 'Yellow', value: '#eab308' },
    { name: 'Green', value: '#10b981' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Pink', value: '#ec4899' }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Manage Categories</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-white hover:bg-gray-200 text-black text-white px-4 py-2 rounded-lg transition-colors"
        >
          Add Category
        </button>
      </div>

      {isAdding && (
        <div className="bg-[#111111] border border-[#222222] rounded-lg border border-[#222222] p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">
            {editingId ? 'Edit Category' : 'New Category'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-[#333333] rounded-lg focus:ring-2 focus:ring-white/20 focus:border-white/30"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Default Frequency
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.defaultFrequency.value}
                    onChange={(e) => setFormData({
                      ...formData,
                      defaultFrequency: {
                        ...formData.defaultFrequency,
                        value: parseInt(e.target.value)
                      }
                    })}
                    className="w-full px-3 py-2 border border-[#333333] rounded-lg focus:ring-2 focus:ring-white/20 focus:border-white/30"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Unit
                  </label>
                  <select
                    value={formData.defaultFrequency.unit}
                    onChange={(e) => setFormData({
                      ...formData,
                      defaultFrequency: {
                        ...formData.defaultFrequency,
                        unit: e.target.value
                      }
                    })}
                    className="w-full px-3 py-2 border border-[#333333] rounded-lg focus:ring-2 focus:ring-white/20 focus:border-white/30"
                  >
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Color
                </label>
                <div className="flex gap-2">
                  {colorOptions.map(color => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: color.value })}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        formData.color === color.value ? 'border-gray-800 scale-110' : 'border-[#333333]'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="bg-white hover:bg-gray-200 text-black text-white px-6 py-2 rounded-lg transition-colors"
                >
                  {editingId ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-[#222222] hover:bg-gray-300 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {categories.map(category => {
          const friendCount = friends.filter(f => f.categories?.includes(category.id)).length;

          return (
            <div
              key={category.id}
              className="bg-[#111111] border border-[#222222] rounded-lg border border-[#222222] p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-lg"
                  style={{ backgroundColor: category.color }}
                />
                <div>
                  <h3 className="font-semibold text-lg text-white">{category.name}</h3>
                  <p className="text-sm text-gray-400">
                    Contact every {category.defaultFrequency.value} {category.defaultFrequency.unit}
                    {' • '}
                    {friendCount} friend{friendCount !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(category)}
                  className="text-gray-400 hover:text-white px-3 py-1 rounded transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="text-red-400 hover:text-red-300 px-3 py-1 rounded transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryManager;
