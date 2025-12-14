import { useState } from 'react';
import { useApp } from '../context/AppContext';

// Helper function to calculate plant health status
const calculatePlantStatus = (lastContacted, frequency) => {
  const today = new Date();
  const lastContact = new Date(lastContacted);
  const daysSinceContact = Math.floor((today - lastContact) / (1000 * 60 * 60 * 24));

  if (daysSinceContact < frequency) {
    return 'thriving';
  } else if (daysSinceContact < frequency * 2) {
    return 'wilting';
  } else {
    return 'withered';
  }
};

// SVG Plant Icons
const PlantIcon = ({ status }) => {
  const getColor = () => {
    switch (status) {
      case 'thriving':
        return '#10b981'; // Vibrant green
      case 'wilting':
        return '#f59e0b'; // Yellow-orange
      case 'withered':
        return '#78716c'; // Desaturated brown/grey
      default:
        return '#10b981';
    }
  };

  const color = getColor();

  if (status === 'thriving') {
    return (
      <svg width="100%" height="100%" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Blooming Flower */}
        <circle cx="24" cy="20" r="6" fill={color} opacity="0.9" />
        <circle cx="18" cy="16" r="5" fill={color} opacity="0.8" />
        <circle cx="30" cy="16" r="5" fill={color} opacity="0.8" />
        <circle cx="18" cy="24" r="5" fill={color} opacity="0.8" />
        <circle cx="30" cy="24" r="5" fill={color} opacity="0.8" />
        <circle cx="24" cy="20" r="3" fill="#fbbf24" />
        {/* Stem */}
        <rect x="22" y="26" width="4" height="14" fill="#15803d" rx="2" />
        {/* Leaves */}
        <ellipse cx="18" cy="32" rx="6" ry="3" fill="#16a34a" opacity="0.9" />
        <ellipse cx="30" cy="34" rx="6" ry="3" fill="#16a34a" opacity="0.9" />
      </svg>
    );
  } else if (status === 'wilting') {
    return (
      <svg width="100%" height="100%" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Wilting Plant */}
        <path d="M24 26 Q20 28 18 32" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M24 26 Q28 28 30 32" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
        <ellipse cx="16" cy="33" rx="5" ry="2.5" fill={color} opacity="0.7" transform="rotate(-20 16 33)" />
        <ellipse cx="32" cy="34" rx="5" ry="2.5" fill={color} opacity="0.7" transform="rotate(15 32 34)" />
        {/* Drooping stem */}
        <path d="M24 40 Q23 34 24 26" stroke="#92400e" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Small wilted flower */}
        <circle cx="24" cy="24" r="3" fill="#d97706" opacity="0.6" />
        <circle cx="21" cy="23" r="2" fill="#d97706" opacity="0.5" />
        <circle cx="27" cy="23" r="2" fill="#d97706" opacity="0.5" />
      </svg>
    );
  } else {
    return (
      <svg width="100%" height="100%" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Withered Branch */}
        <path d="M24 40 L24 28" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M24 34 L20 30" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <path d="M24 32 L28 28" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <path d="M24 30 L21 27" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M24 28 L27 25" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        {/* Small dry leaves */}
        <ellipse cx="20" cy="30" rx="2" ry="1" fill={color} opacity="0.4" />
        <ellipse cx="28" cy="28" rx="2" ry="1" fill={color} opacity="0.4" />
      </svg>
    );
  }
};

// Plant Care Card (Bottom Sheet on Mobile, Popover on Desktop)
const PlantCareCard = ({ friend, status, onClose, onWater }) => {
  const getStatusText = () => {
    switch (status) {
      case 'thriving':
        return 'Thriving! Keep it up!';
      case 'wilting':
        return 'Needs Water Soon';
      case 'withered':
        return 'Needs Water Now!';
      default:
        return '';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'thriving':
        return 'text-green-400';
      case 'wilting':
        return 'text-orange-400';
      case 'withered':
        return 'text-red-400';
      default:
        return 'text-[#edc4b3]';
    }
  };

  const handleWater = () => {
    onWater(friend);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
        onClick={onClose}
      />

      {/* Card - Bottom sheet on mobile, centered on desktop */}
      <div className="fixed bottom-0 left-0 right-0 md:bottom-auto md:top-1/2 md:left-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-md md:rounded-lg bg-[#3d241a] border border-[#774936] rounded-t-2xl md:rounded-b-2xl z-50 animate-slide-up md:animate-scale-in">
        {/* Handle bar for mobile */}
        <div className="md:hidden flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-[#774936] rounded-full" />
        </div>

        <div className="p-6">
          {/* Friend Info */}
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-[#edc4b3] mb-2">{friend.name}</h3>
            <p className="text-sm text-[#b07d62] mb-1">{friend.contact}</p>
            <p className={`text-sm font-semibold ${getStatusColor()}`}>
              Status: {getStatusText()}
            </p>
          </div>

          {/* Plant Icon Preview */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24">
              <PlantIcon status={status} />
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleWater}
              className="w-full bg-[#c38e70] hover:bg-[#b07d62] text-[#2d1810] px-6 py-3 rounded-lg transition-all font-semibold"
            >
              💧 Water Now
            </button>
            <button
              onClick={onClose}
              className="w-full bg-[#4a2f1f] hover:bg-[#5a3f2f] text-[#edc4b3] px-6 py-3 rounded-lg transition-all font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// Main Garden Visualization Component
const GardenVisualization = ({ friends }) => {
  const { logContact, categories } = useApp();
  const [selectedFriend, setSelectedFriend] = useState(null);

  const handlePlantClick = (friend) => {
    setSelectedFriend(friend);
  };

  const handleWater = (friend) => {
    const today = new Date().toISOString().split('T')[0];
    logContact(friend.id, today);
  };

  // Group friends by category (friends can appear in multiple categories)
  const friendsByCategory = {};

  categories.forEach(category => {
    friendsByCategory[category.id] = friends.filter(f =>
      f.categories?.includes(category.id)
    );
  });

  // Friends with no categories go to a "General" plot
  const uncategorizedFriends = friends.filter(f =>
    !f.categories || f.categories.length === 0
  );

  if (!friends || friends.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-32 h-32 mx-auto mb-4 opacity-30">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="16" y="32" width="16" height="8" fill="#774936" rx="1" />
            <path d="M24 32 Q20 28 20 22 Q20 16 24 14 Q28 16 28 22 Q28 28 24 32" fill="#9d6b53" opacity="0.5" />
          </svg>
        </div>
        <p className="text-[#b07d62] text-lg">Your garden is empty</p>
        <p className="text-[#9d6b53] text-sm mt-2">Add friends to start growing!</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#edc4b3] mb-2">Your Friendship Garden</h2>
        <p className="text-[#b07d62] text-sm">Tap a plant to care for your relationship</p>
      </div>

      {/* Category Plots */}
      <div className="space-y-8 mb-8">
        {categories.map(category => {
          const categoryFriends = friendsByCategory[category.id];
          if (!categoryFriends || categoryFriends.length === 0) return null;

          return (
            <div key={category.id} className="bg-[#3d241a] border-2 rounded-lg p-4" style={{ borderColor: category.color }}>
              {/* Plot Header */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: category.color }}
                />
                <h3 className="text-lg font-semibold text-[#edc4b3]">{category.name}</h3>
                <span className="text-sm text-[#b07d62]">({categoryFriends.length} plant{categoryFriends.length !== 1 ? 's' : ''})</span>
              </div>

              {/* Plants Grid */}
              <div
                className="grid gap-3"
                style={{
                  gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                }}
              >
                {categoryFriends.map((friend) => {
                  const frequency = friend.contactFrequency?.value || 7;
                  const status = calculatePlantStatus(friend.lastContacted, frequency);

                  return (
                    <button
                      key={`${category.id}-${friend.id}`}
                      onClick={() => handlePlantClick(friend)}
                      className="group relative aspect-square bg-[#2d1810] rounded-lg border-2 hover:border-[#c38e70] transition-all focus:outline-none focus:ring-2 focus:ring-[#c38e70] focus:ring-offset-2 focus:ring-offset-[#3d241a] min-h-[44px] min-w-[44px]"
                      style={{ borderColor: category.color + '80' }}
                      aria-label={`${friend.name} - ${status}`}
                    >
                      <div className="p-2 w-full h-full">
                        <PlantIcon status={status} />
                      </div>

                      {/* Name label on hover (desktop only) */}
                      <div className="hidden md:block absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        <div className="bg-[#2d1810] border border-[#774936] px-2 py-1 rounded text-xs text-[#edc4b3] whitespace-nowrap">
                          {friend.name}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* General/Uncategorized Plot */}
        {uncategorizedFriends.length > 0 && (
          <div className="bg-[#3d241a] border-2 border-[#774936] rounded-lg p-4">
            {/* Plot Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-4 h-4 rounded bg-[#9d6b53]" />
              <h3 className="text-lg font-semibold text-[#edc4b3]">General</h3>
              <span className="text-sm text-[#b07d62]">({uncategorizedFriends.length} plant{uncategorizedFriends.length !== 1 ? 's' : ''})</span>
            </div>

            {/* Plants Grid */}
            <div
              className="grid gap-3"
              style={{
                gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
              }}
            >
              {uncategorizedFriends.map((friend) => {
                const frequency = friend.contactFrequency?.value || 7;
                const status = calculatePlantStatus(friend.lastContacted, frequency);

                return (
                  <button
                    key={friend.id}
                    onClick={() => handlePlantClick(friend)}
                    className="group relative aspect-square bg-[#2d1810] rounded-lg border-2 border-[#774936] hover:border-[#c38e70] transition-all focus:outline-none focus:ring-2 focus:ring-[#c38e70] focus:ring-offset-2 focus:ring-offset-[#3d241a] min-h-[44px] min-w-[44px]"
                    aria-label={`${friend.name} - ${status}`}
                  >
                    <div className="p-2 w-full h-full">
                      <PlantIcon status={status} />
                    </div>

                    {/* Name label on hover (desktop only) */}
                    <div className="hidden md:block absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      <div className="bg-[#2d1810] border border-[#774936] px-2 py-1 rounded text-xs text-[#edc4b3] whitespace-nowrap">
                        {friend.name}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-[#3d241a] border border-green-900/30 rounded-lg p-4 text-center">
          <div className="w-8 h-8 mx-auto mb-2">
            <PlantIcon status="thriving" />
          </div>
          <p className="text-2xl font-bold text-green-400">
            {friends.filter(f => calculatePlantStatus(f.lastContacted, f.contactFrequency?.value || 7) === 'thriving').length}
          </p>
          <p className="text-xs text-[#b07d62] mt-1">Thriving</p>
        </div>

        <div className="bg-[#3d241a] border border-orange-900/30 rounded-lg p-4 text-center">
          <div className="w-8 h-8 mx-auto mb-2">
            <PlantIcon status="wilting" />
          </div>
          <p className="text-2xl font-bold text-orange-400">
            {friends.filter(f => calculatePlantStatus(f.lastContacted, f.contactFrequency?.value || 7) === 'wilting').length}
          </p>
          <p className="text-xs text-[#b07d62] mt-1">Wilting</p>
        </div>

        <div className="bg-[#3d241a] border border-red-900/30 rounded-lg p-4 text-center">
          <div className="w-8 h-8 mx-auto mb-2">
            <PlantIcon status="withered" />
          </div>
          <p className="text-2xl font-bold text-red-400">
            {friends.filter(f => calculatePlantStatus(f.lastContacted, f.contactFrequency?.value || 7) === 'withered').length}
          </p>
          <p className="text-xs text-[#b07d62] mt-1">Withered</p>
        </div>
      </div>

      {/* Plant Care Card */}
      {selectedFriend && (
        <PlantCareCard
          friend={selectedFriend}
          status={calculatePlantStatus(selectedFriend.lastContacted, selectedFriend.contactFrequency?.value || 7)}
          onClose={() => setSelectedFriend(null)}
          onWater={handleWater}
        />
      )}
    </div>
  );
};

export default GardenVisualization;
