import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import FriendCard from './FriendCard';
import FriendForm from './FriendForm';
import FriendProfile from './FriendProfile';
import { calculateNextContactDue, getContactStatus, getUpcomingDates, formatDate } from '../utils/dateHelpers';

const Dashboard = () => {
  const { friends, categories } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingFriend, setEditingFriend] = useState(null);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('next-due');

  const filteredAndSortedFriends = useMemo(() => {
    let filtered = friends;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(friend =>
        friend.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(friend =>
        selectedCategories.some(catId => friend.categories?.includes(catId))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(friend => {
        const nextDue = calculateNextContactDue(friend.lastContacted, friend.contactFrequency);
        const status = getContactStatus(nextDue);

        switch (statusFilter) {
          case 'due-today':
            return status === 'due-today';
          case 'due-this-week':
            return status === 'due-today' || status === 'due-soon';
          case 'overdue':
            return status === 'overdue';
          default:
            return true;
        }
      });
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'next-due': {
          const aDue = calculateNextContactDue(a.lastContacted, a.contactFrequency);
          const bDue = calculateNextContactDue(b.lastContacted, b.contactFrequency);
          return new Date(aDue) - new Date(bDue);
        }
        case 'last-contacted': {
          return new Date(a.lastContacted) - new Date(b.lastContacted);
        }
        case 'alphabetical': {
          return a.name.localeCompare(b.name);
        }
        case 'most-overdue': {
          const aDue = calculateNextContactDue(a.lastContacted, a.contactFrequency);
          const bDue = calculateNextContactDue(b.lastContacted, b.contactFrequency);
          const aStatus = getContactStatus(aDue);
          const bStatus = getContactStatus(bDue);
          if (aStatus === 'overdue' && bStatus !== 'overdue') return -1;
          if (aStatus !== 'overdue' && bStatus === 'overdue') return 1;
          return new Date(aDue) - new Date(bDue);
        }
        default:
          return 0;
      }
    });

    return sorted;
  }, [friends, searchTerm, selectedCategories, statusFilter, sortBy]);

  const stats = useMemo(() => {
    const dueToday = friends.filter(f => {
      const nextDue = calculateNextContactDue(f.lastContacted, f.contactFrequency);
      return getContactStatus(nextDue) === 'due-today';
    }).length;

    const overdue = friends.filter(f => {
      const nextDue = calculateNextContactDue(f.lastContacted, f.contactFrequency);
      return getContactStatus(nextDue) === 'overdue';
    }).length;

    const upcomingDates = getUpcomingDates(friends, 7);

    return {
      total: friends.length,
      dueToday,
      overdue,
      upcomingDates: upcomingDates.length
    };
  }, [friends]);

  const upcomingDates = useMemo(() => getUpcomingDates(friends, 7), [friends]);

  const handleCategoryFilterToggle = (categoryId) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Friend Contact Tracker</h1>
        <p className="text-gray-500">Stay connected with the people who matter</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#111111] border border-[#222222] rounded-lg p-4">
          <p className="text-sm text-gray-500">Total Friends</p>
          <p className="text-3xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="bg-[#111111] border border-orange-900/30 rounded-lg p-4">
          <p className="text-sm text-orange-400">Due Today</p>
          <p className="text-3xl font-bold text-orange-400">{stats.dueToday}</p>
        </div>
        <div className="bg-[#111111] border border-red-900/30 rounded-lg p-4">
          <p className="text-sm text-red-400">Overdue</p>
          <p className="text-3xl font-bold text-red-400">{stats.overdue}</p>
        </div>
        <div className="bg-[#111111] border border-blue-900/30 rounded-lg p-4">
          <p className="text-sm text-blue-400">Upcoming Events</p>
          <p className="text-3xl font-bold text-blue-400">{stats.upcomingDates}</p>
        </div>
      </div>

      {/* Upcoming Important Dates */}
      {upcomingDates.length > 0 && (
        <div className="bg-[#111111] border-l-4 border-blue-500 rounded-lg p-4 mb-8">
          <h3 className="font-semibold text-white mb-3">Upcoming Important Dates</h3>
          <div className="space-y-2">
            {upcomingDates.slice(0, 5).map(date => (
              <div key={`${date.friendId}-${date.id}`} className="flex justify-between items-center text-sm">
                <div>
                  <span className="font-medium text-white">{date.friendName}</span>
                  <span className="text-gray-400"> - {date.title}</span>
                </div>
                <span className="text-gray-500">
                  {date.daysUntil === 0 ? 'Today' : `In ${date.daysUntil} day${date.daysUntil !== 1 ? 's' : ''}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters and Controls */}
      <div className="bg-[#111111] border border-[#222222] rounded-lg p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Search friends..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 bg-[#0a0a0a] border border-[#222222] text-white placeholder-gray-600 rounded-lg focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all"
          />
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-white hover:bg-gray-200 text-black px-6 py-2 rounded-lg transition-all whitespace-nowrap font-medium"
          >
            + Add Friend
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-sm font-medium text-gray-500 self-center">Categories:</span>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => handleCategoryFilterToggle(category.id)}
              className={`px-3 py-1 rounded-full text-sm transition-all ${
                selectedCategories.includes(category.id)
                  ? 'text-white'
                  : 'bg-[#1a1a1a] text-gray-400 hover:bg-[#222222] border border-[#333333]'
              }`}
              style={{
                backgroundColor: selectedCategories.includes(category.id) ? category.color : undefined,
                borderColor: selectedCategories.includes(category.id) ? category.color : undefined
              }}
            >
              {category.name}
            </button>
          ))}
          {selectedCategories.length > 0 && (
            <button
              onClick={() => setSelectedCategories([])}
              className="text-sm text-gray-500 hover:text-white underline"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm text-gray-500 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#222222] text-white rounded-lg focus:ring-2 focus:ring-white/20 focus:border-white/30"
            >
              <option value="all">All Friends</option>
              <option value="due-today">Due Today</option>
              <option value="due-this-week">Due This Week</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm text-gray-500 mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#222222] text-white rounded-lg focus:ring-2 focus:ring-white/20 focus:border-white/30"
            >
              <option value="next-due">Next Due Date</option>
              <option value="last-contacted">Last Contacted</option>
              <option value="alphabetical">Alphabetical</option>
              <option value="most-overdue">Most Overdue</option>
            </select>
          </div>
        </div>
      </div>

      {/* Friends List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAndSortedFriends.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">
              {friends.length === 0
                ? "No friends yet. Add your first friend to get started!"
                : "No friends match your filters."}
            </p>
          </div>
        ) : (
          filteredAndSortedFriends.map(friend => (
            <FriendCard
              key={friend.id}
              friend={friend}
              onEdit={() => setEditingFriend(friend)}
              onViewProfile={() => setSelectedFriend(friend)}
            />
          ))
        )}
      </div>

      {/* Modals */}
      {showAddForm && (
        <FriendForm
          onClose={() => setShowAddForm(false)}
          onSuccess={() => setShowAddForm(false)}
        />
      )}

      {editingFriend && (
        <FriendForm
          friend={editingFriend}
          onClose={() => setEditingFriend(null)}
          onSuccess={() => setEditingFriend(null)}
        />
      )}

      {selectedFriend && (
        <FriendProfile
          friend={selectedFriend}
          onClose={() => setSelectedFriend(null)}
          onEdit={() => {
            setEditingFriend(selectedFriend);
            setSelectedFriend(null);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
