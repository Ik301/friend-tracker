import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

const SerendipityMode = () => {
  const { friends, categories, logContact } = useApp();
  const [state, setState] = useState('idle'); // idle, shuffling, revealed
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [shuffleNames, setShuffleNames] = useState([]);
  const [currentShuffleName, setCurrentShuffleName] = useState('');

  // Filter friends for serendipity
  const getEligibleFriends = () => {
    const today = new Date();
    const twoWeeksAgo = new Date(today);
    twoWeeksAgo.setDate(today.getDate() - 14);

    // Filter for anyone not contacted in over 2 weeks
    const eligibleFriends = friends.filter(f => {
      const lastContactDate = new Date(f.lastContacted);
      return lastContactDate < twoWeeksAgo;
    });

    return eligibleFriends;
  };

  const handleSurpriseMe = () => {
    const eligible = getEligibleFriends();

    if (eligible.length === 0) {
      alert("Great job! You've contacted everyone recently. No one needs a call right now.");
      return;
    }

    setState('shuffling');

    // Create array of random names for shuffle animation
    const shuffleArray = [];
    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * eligible.length);
      shuffleArray.push(eligible[randomIndex].name);
    }
    setShuffleNames(shuffleArray);

    // Animate through names
    let currentIndex = 0;
    const shuffleInterval = setInterval(() => {
      setCurrentShuffleName(shuffleArray[currentIndex]);
      currentIndex++;
      if (currentIndex >= shuffleArray.length) {
        clearInterval(shuffleInterval);

        // Pick final random friend
        const randomIndex = Math.floor(Math.random() * eligible.length);
        const chosenFriend = eligible[randomIndex];

        setTimeout(() => {
          setSelectedFriend(chosenFriend);
          setState('revealed');
        }, 200);
      }
    }, 150);
  };

  const handleLogContact = () => {
    const today = new Date().toISOString().split('T')[0];
    logContact(selectedFriend.id, today);
    setState('idle');
    setSelectedFriend(null);
  };

  const handleSkip = () => {
    setState('idle');
    setSelectedFriend(null);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 min-h-screen flex items-center justify-center">
      {/* State A: Idle */}
      {state === 'idle' && (
        <div className="text-center">
          <div className="mb-8">
            {/* Coffee cup icon */}
            <svg
              className="w-24 h-24 mx-auto mb-6 text-[#c38e70]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
              <line x1="6" y1="1" x2="6" y2="4" />
              <line x1="10" y1="1" x2="10" y2="4" />
              <line x1="14" y1="1" x2="14" y2="4" />
            </svg>
          </div>

          <h1 className="text-4xl font-bold text-[#edc4b3] mb-4">
            Reconnect with someone
          </h1>

          <p className="text-xl text-[#b07d62] mb-12">
            Let fate decide who you call today
          </p>

          <button
            onClick={handleSurpriseMe}
            className="bg-[#c38e70] hover:bg-[#b07d62] text-[#2d1810] px-12 py-4 rounded-lg text-xl font-bold transition-all transform hover:scale-105 active:scale-95"
          >
            Surprise Me
          </button>
        </div>
      )}

      {/* State B: Shuffling */}
      {state === 'shuffling' && (
        <div className="text-center">
          <div className="mb-8">
            {/* Spinning loader */}
            <div className="w-24 h-24 mx-auto mb-6">
              <div className="w-full h-full border-8 border-[#3d241a] border-t-[#c38e70] rounded-full animate-spin"></div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-[#edc4b3] mb-4 h-12 flex items-center justify-center">
            {currentShuffleName}
          </h2>

          <p className="text-lg text-[#b07d62]">
            Finding someone special...
          </p>
        </div>
      )}

      {/* State C: Revealed */}
      {state === 'revealed' && selectedFriend && (
        <div className="w-full max-w-md">
          <div className="bg-[#3d241a] border-2 border-[#774936] rounded-2xl p-8 text-center">
            {/* Profile placeholder/photo */}
            <div className="w-32 h-32 mx-auto mb-6 bg-[#2d1810] border-4 border-[#c38e70] rounded-full flex items-center justify-center">
              <span className="text-5xl text-[#c38e70] font-bold">
                {selectedFriend.name.charAt(0).toUpperCase()}
              </span>
            </div>

            {/* Name */}
            <h2 className="text-3xl font-bold text-[#edc4b3] mb-2">
              {selectedFriend.name}
            </h2>

            {/* Contact info */}
            <p className="text-[#b07d62] mb-6">
              {selectedFriend.contact}
            </p>

            {/* Notes to jog memory */}
            {selectedFriend.notes && (
              <div className="bg-[#2d1810] border border-[#774936] rounded-lg p-4 mb-8 text-left">
                <p className="text-sm text-[#9d6b53] mb-1">Notes:</p>
                <p className="text-[#edc4b3]">
                  {selectedFriend.notes}
                </p>
              </div>
            )}

            {/* Action buttons */}
            <div className="space-y-3">
              <button
                onClick={handleLogContact}
                className="w-full bg-[#c38e70] hover:bg-[#b07d62] text-[#2d1810] px-6 py-4 rounded-lg text-lg font-bold transition-all"
              >
                ✓ Log Contact
              </button>

              <button
                onClick={handleSkip}
                className="w-full bg-[#4a2f1f] hover:bg-[#5a3f2f] text-[#edc4b3] px-6 py-4 rounded-lg text-lg font-medium transition-all"
              >
                Skip / Spin Again
              </button>
            </div>
          </div>

          {/* Encouragement text */}
          <p className="text-center text-[#9d6b53] mt-6 text-sm">
            A 2-minute call can make someone's day
          </p>
        </div>
      )}
    </div>
  );
};

export default SerendipityMode;
