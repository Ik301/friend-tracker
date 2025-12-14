import { useApp } from '../context/AppContext';
import { calculateNextContactDue, getContactStatus, formatRelativeDate, getDaysUntilDue } from '../utils/dateHelpers';

const FriendCard = ({ friend, onEdit, onViewProfile }) => {
  const { categories, logContact } = useApp();

  const nextContactDue = calculateNextContactDue(friend.lastContacted, friend.contactFrequency);
  const status = getContactStatus(nextContactDue);
  const daysUntil = getDaysUntilDue(nextContactDue);

  const friendCategories = categories.filter(cat =>
    friend.categories?.includes(cat.id)
  );

  const handleQuickLog = (e) => {
    e.stopPropagation();
    logContact(friend.id, 'Quick contact logged');
  };

  const getStatusText = () => {
    if (status === 'overdue') return `${Math.abs(daysUntil)} days overdue`;
    if (status === 'due-today') return 'Due today';
    if (status === 'due-soon') return `Due in ${daysUntil} days`;
    return `${daysUntil} days until due`;
  };

  const getStatusBorder = () => {
    switch (status) {
      case 'overdue':
        return 'border-l-red-500';
      case 'due-today':
        return 'border-l-orange-500';
      case 'due-soon':
        return 'border-l-yellow-500';
      default:
        return 'border-l-green-500';
    }
  };

  const getStatusTextColor = () => {
    switch (status) {
      case 'overdue':
        return 'text-red-400';
      case 'due-today':
        return 'text-orange-400';
      case 'due-soon':
        return 'text-yellow-400';
      default:
        return 'text-green-400';
    }
  };

  return (
    <div
      className={`bg-[#3d241a] rounded-lg border border-[#774936] ${getStatusBorder()} border-l-4 p-4 cursor-pointer hover:border-[#8a5a44] transition-all`}
      onClick={onViewProfile}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-[#edc4b3]">{friend.name}</h3>
          <p className="text-sm text-[#b07d62]">{friend.contact}</p>
        </div>
        <button
          onClick={handleQuickLog}
          className="bg-[#c38e70] hover:bg-[#b07d62] text-[#2d1810] text-sm px-3 py-1 rounded-lg transition-all font-medium"
        >
          Log
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {friendCategories.map(category => (
          <span
            key={category.id}
            className="text-xs px-2 py-1 rounded-full text-[#edc4b3]"
            style={{ backgroundColor: category.color }}
          >
            {category.name}
          </span>
        ))}
      </div>

      <div className="flex justify-between items-center text-sm">
        <div>
          <p className="text-[#b07d62]">
            Last: {formatRelativeDate(friend.lastContacted)}
          </p>
          <p className={`font-medium mt-1 ${getStatusTextColor()}`}>
            {getStatusText()}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="text-[#c38e70] hover:text-[#edc4b3] transition-colors"
        >
          Edit
        </button>
      </div>

      {friend.notes && (
        <div className="mt-3 pt-3 border-t border-[#774936]">
          <p className="text-sm text-[#b07d62] italic line-clamp-2">{friend.notes}</p>
        </div>
      )}
    </div>
  );
};

export default FriendCard;
