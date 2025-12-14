import { useApp } from '../context/AppContext';
import { formatDate, formatRelativeDate, calculateNextContactDue, getContactStatus } from '../utils/dateHelpers';

const FriendProfile = ({ friend, onClose, onEdit }) => {
  const { categories, logContact, deleteFriend } = useApp();

  const friendCategories = categories.filter(cat =>
    friend.categories?.includes(cat.id)
  );

  const nextContactDue = calculateNextContactDue(friend.lastContacted, friend.contactFrequency);
  const status = getContactStatus(nextContactDue);

  const handleQuickLog = () => {
    const notes = prompt('Add notes about this contact (optional):');
    if (notes !== null) {
      logContact(friend.id, notes);
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${friend.name}?`)) {
      deleteFriend(friend.id);
      onClose();
    }
  };

  const sortedHistory = [...(friend.contactHistory || [])].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const upcomingDates = friend.importantDates?.filter(d => {
    const dateObj = new Date(d.date);
    return dateObj >= new Date();
  }).sort((a, b) => new Date(a.date) - new Date(b.date)) || [];

  const pastDates = friend.importantDates?.filter(d => {
    const dateObj = new Date(d.date);
    return dateObj < new Date() && d.type === 'one-time';
  }).sort((a, b) => new Date(b.date) - new Date(a.date)) || [];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#111111] border border-[#222222] rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-bold text-white">{friend.name}</h2>
              <p className="text-gray-400 mt-1">{friend.contact}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {friendCategories.map(category => (
              <span
                key={category.id}
                className="px-3 py-1 rounded-full text-white text-sm"
                style={{ backgroundColor: category.color }}
              >
                {category.name}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-[#0a0a0a] p-4 rounded-lg">
              <p className="text-sm text-gray-400">Last Contacted</p>
              <p className="text-lg font-semibold text-white mt-1">
                {formatRelativeDate(friend.lastContacted)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {formatDate(friend.lastContacted)}
              </p>
            </div>
            <div className="bg-[#0a0a0a] p-4 rounded-lg">
              <p className="text-sm text-gray-400">Contact Frequency</p>
              <p className="text-lg font-semibold text-white mt-1">
                Every {friend.contactFrequency.value} {friend.contactFrequency.unit}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Status: <span className={`font-medium ${
                  status === 'overdue' ? 'text-red-600' :
                  status === 'due-today' ? 'text-orange-600' :
                  status === 'due-soon' ? 'text-yellow-600' :
                  'text-green-600'
                }`}>{status === 'overdue' ? 'Overdue' : status === 'due-today' ? 'Due Today' : status === 'due-soon' ? 'Due Soon' : 'On Track'}</span>
              </p>
            </div>
          </div>

          {friend.notes && (
            <div className="mb-6">
              <h3 className="font-semibold text-white mb-2">Notes</h3>
              <p className="text-white bg-[#0a0a0a] p-3 rounded-lg">{friend.notes}</p>
            </div>
          )}

          {upcomingDates.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-white mb-3">Upcoming Important Dates</h3>
              <div className="space-y-2">
                {upcomingDates.map(date => (
                  <div key={date.id} className="bg-[#1a1a1a] border border-blue-900/30 p-3 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-white">{date.title}</p>
                        <p className="text-sm text-gray-400">{formatDate(date.date)}</p>
                        {date.notes && <p className="text-sm text-gray-500 mt-1">{date.notes}</p>}
                      </div>
                      <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
                        {date.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6">
            <h3 className="font-semibold text-white mb-3">Contact History</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {sortedHistory.map(contact => (
                <div key={contact.id} className="bg-[#0a0a0a] p-3 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-white">
                        {formatDate(contact.date)}
                      </p>
                      {contact.notes && (
                        <p className="text-sm text-gray-400 mt-1">{contact.notes}</p>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatRelativeDate(contact.date)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {pastDates.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-white mb-3">Past Important Dates</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {pastDates.map(date => (
                  <div key={date.id} className="bg-[#0a0a0a] p-3 rounded-lg">
                    <p className="font-medium text-white">{date.title}</p>
                    <p className="text-sm text-gray-500">{formatDate(date.date)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-[#222222]">
            <button
              onClick={handleQuickLog}
              className="flex-1 bg-white hover:bg-gray-200 text-black px-6 py-3 rounded-lg transition-colors font-medium"
            >
              Log Contact
            </button>
            <button
              onClick={onEdit}
              className="px-6 py-3 bg-white hover:bg-gray-200 text-black text-white rounded-lg transition-colors"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="px-6 py-3 bg-[#1a1a1a] hover:bg-red-900/20 border border-red-900/30 text-red-400 hover:text-red-300 text-white rounded-lg transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendProfile;
