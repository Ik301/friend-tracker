import { useState } from 'react';
import { useApp } from '../context/AppContext';

const CategoryManager = () => {
  const { categories, addCategory, updateCategory, deleteCategory, friends } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
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

  const handleDeleteClick = (categoryId) => {
    setDeleteConfirm(categoryId);
  };

  const confirmDelete = () => {
    deleteCategory(deleteConfirm);
    setDeleteConfirm(null);
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
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
        <h2 className="text-2xl font-bold text-[#edc4b3]">Manage Categories</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-[#c38e70] hover:bg-[#b07d62] text-[#2d1810] text-[#edc4b3] px-4 py-2 rounded-lg transition-colors"
        >
          Add Category
        </button>
      </div>

      {isAdding && (
        <div className="bg-[#3d241a] border border-[#774936] rounded-lg border border-[#774936] p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">
            {editingId ? 'Edit Category' : 'New Category'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#edc4b3] mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#2d1810] text-[#edc4b3] border border-[#8a5a44] rounded-lg focus:ring-2 focus:ring-white/20 focus:border-white/30"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#edc4b3] mb-1">
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
                    className="w-full px-3 py-2 bg-[#2d1810] text-[#edc4b3] border border-[#8a5a44] rounded-lg focus:ring-2 focus:ring-white/20 focus:border-white/30"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#edc4b3] mb-1">
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
                  Color
                </label>
                <div className="flex gap-2">
                  {colorOptions.map(color => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: color.value })}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        formData.color === color.value ? 'border-gray-800 scale-110' : 'border-[#8a5a44]'
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
                  className="bg-[#c38e70] hover:bg-[#b07d62] text-[#2d1810] text-[#edc4b3] px-6 py-2 rounded-lg transition-colors"
                >
                  {editingId ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-[#222222] hover:bg-gray-300 text-[#edc4b3] px-6 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={cancelDelete}
          />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-md w-full mx-4 bg-[#3d241a] border border-[#774936] rounded-lg z-50 p-6">
            <h3 className="text-xl font-bold text-[#edc4b3] mb-4">Remove Plot?</h3>
            <p className="text-[#b07d62] mb-6">
              Are you sure you want to remove this Plot? All plants in it will be moved to General.
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
              >
                Remove Plot
              </button>
              <button
                onClick={cancelDelete}
                className="flex-1 bg-[#4a2f1f] hover:bg-[#5a3f2f] text-[#edc4b3] px-4 py-2 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}

      <div className="grid gap-4">
        {categories.map(category => {
          const friendCount = friends.filter(f => f.categories?.includes(category.id)).length;

          return (
            <div
              key={category.id}
              className="bg-[#3d241a] border border-[#774936] rounded-lg border border-[#774936] p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-lg"
                  style={{ backgroundColor: category.color }}
                />
                <div>
                  <h3 className="font-semibold text-lg text-[#edc4b3]">{category.name}</h3>
                  <p className="text-sm text-[#c38e70]">
                    Contact every {category.defaultFrequency.value} {category.defaultFrequency.unit}
                    {' • '}
                    {friendCount} friend{friendCount !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {/* Edit Icon */}
                <button
                  onClick={() => handleEdit(category)}
                  className="text-[#c38e70] hover:text-[#edc4b3] p-2 rounded transition-colors"
                  aria-label="Edit category"
                  title="Edit"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>

                {/* Trash Icon */}
                <button
                  onClick={() => handleDeleteClick(category.id)}
                  className="text-[#78716c] hover:text-red-500 p-2 rounded transition-colors"
                  aria-label="Delete category"
                  title="Delete"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
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
